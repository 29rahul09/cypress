import { title } from "process";

export const validateTopBoxSectionTest = (articleUrl, journal) => {
  const writeUniqueEntriesToFile = (filePath, entries) => {
    cy.writeFile(filePath, "", { flag: "a+" }).then(() => {
      cy.readFile(filePath, "utf8").then((existingContent) => {
        const existingEntries = existingContent
          ? existingContent.split("\n")
          : [];
        const newEntries = entries.filter(
          (entry) => !existingEntries.includes(entry)
        );
        if (newEntries.length > 0) {
          cy.writeFile(filePath, newEntries.join("\n") + "\n", {
            flag: "a+",
          });
        }
      });
    });
  };
  const processUrls = (url) => {
    const externalLinks = [];
    cy.get("body")
      .then(($body) => {
        const result = {
          url,
          title: $body.find("h1#article-title-1").length > 0,
          requestPermissions: $body.find('[data-testid="request-permissions"]').length > 0,
          citation: $body.find('[data-testid="citation"]').length > 0,
          share: $body.find('[data-testid="share"]').length > 0,
          pdfLink: $body.find('[data-testid="pdf"] a').length > 0,
          tableTitle: $body.find('[data-testid="table-title"]').length > 0,
          publicationDate: $body.find('[data-testid="publication-icon"]').length > 0,
        };

        externalLinks.push(
          `${result.url}, title ==> ${result.title}, requestPermissions ==> ${result.requestPermissions}, citation ==> ${result.citation},  share ==> ${result.share}, pdfLink ==> ${result.pdfLink}, tableTitle ==> ${result.tableTitle}, publicationDate ==> ${result.publicationDate}\n`
        );
      })
      .then(() => {
        if (externalLinks.length > 0) {
          writeUniqueEntriesToFile(
            `cypress/downloads/${journal}/HW/externalLinks.csv`,
            externalLinks
          );
        }
      });
  };
    const topBoxError = [];
    cy.get("body").then(($body) => {
      const promises = [];

      const selectors = {
        title: "h1#article-title-1",
        requestPermissions: '[data-testid="request-permissions"]',
        citation: '[data-testid="citation"]',
        share: '[data-testid="share"]',
        pdfLink: '[data-testid="pdf"] a',
      };

      Object.entries(selectors).forEach(([key, selector]) => {
        if ($body.find(selector).length > 0) {
          switch (key) {
            case "title":
              promises.push(cy.get(selector).should("be.visible"));
              break;
            case "requestPermissions":
              promises.push(
                cy
                  .get(selector)
                  .should("exist")
                  .should("have.attr", "href")
                  .then((href) => {
                    return cy
                      .request({ url: `${href}`, failOnStatusCode: false })
                      .then((response) => {
                        if (response.status !== 200) {
                          topBoxError.push(
                            `Request Permission Error ==> /content${articleUrl}`
                          );
                        }
                      })
                      .then(() => {
                        if (topBoxError.length > 0) {
                          writeUniqueEntriesToFile(
                            `cypress/SmokeTest/${journal}/TopBoxError.csv`,
                            topBoxError
                          );
                        }
                      });
                  })
              );
              break;
            case "citation":
              promises.push(
                cy.get(selector).should("exist").contains("Cite this article")
              );
              break;
            case "share":
              promises.push(
                cy.get(selector).should("exist").contains("Share")
              );
              break;
            default:
              break;
          }
        }
      });

      if ($body.find(selectors.pdfLink).length > 0) {
        promises.push(
          cy
            .get(selectors.pdfLink)
            .should("have.attr", "href")
            .then((href) => {
              return cy
                .request({ url: `${href}`, failOnStatusCode: false })
                .then((response) => {
                  if (response.status !== 200) {
                    topBoxError.push(`PDF Button Error ==> /content${articleUrl}`);
                  }
                })
                .then(() => {
                  if (topBoxError.length > 0) {
                    writeUniqueEntriesToFile(
                      `cypress/SmokeTest/${journal}/TopBoxError.csv`,
                      topBoxError
                    );
                  }
                });
            })
        );
      }
      return Promise.all(promises);
    });
  };

  export default validateTopBoxSectionTest;