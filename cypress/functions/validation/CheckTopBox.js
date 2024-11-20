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
                            `Request Permission Error ==> ${articleUrl}`
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
                    topBoxError.push(`PDF Button Error ==> ${articleUrl}`);
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