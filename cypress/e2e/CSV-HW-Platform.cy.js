const journal = "neurologyopen";
const domain = "https://neurologyopen.bmj.com";

describe("Investigate Article url on Live-site", () => {
  it("should visit url and find the Article Headings", () => {
    cy.fixture(`${journal}.json`).then((urls) => {
      const visitUrlAndCollectHeadings = (url, index) => {
        cy.visit(`${domain}${url}`, { failOnStatusCode: false });
        cy.get("body")
          .find("h2")
          .then(($headings) => {
            const headingsText = [];

            $headings.each((index, $el) => {
              const headingText = Cypress.$($el).text();
              if (
                Cypress.$($el).is(":visible") &&
                headingText !== "Cookies and privacy" &&
                headingText !== "You are here"
              ) {
                headingsText.push(headingText);
              }
            });
            // && (headingText === 'Abstract' || headingText === 'Supplementary urls' || headingText === 'Supplementary materials' || headingText === 'Statistics from Altmetric.com')
            // Sort headings alphabetically
            headingsText.sort();

            const result = {
              url,
              headings: headingsText.join(" | "),
            };

            // Write the output after each URL is processed
            const csvContent = `${result.url},${result.headings}\n`;
            cy.writeFile(
              `cypress/inspection/${journal}/HW/ArticleHeadings.csv`,
              csvContent,
              { flag: "a+" }
            );
          });
      };

      urls.forEach((url, index) => {
        visitUrlAndCollectHeadings(url, index);
      });
    });
  });

  it.skip("Find if the article has Boxed text and External Links", () => {
    cy.fixture(`${journal}.json`).then((urls) => {
      const processUrls = (url) => {
        return cy
          .visit({
            url: `${domain}${url}`,
            failOnStatusCode: false,
          })
          .then(() => {
            cy.get("body").then(($body) => {
              let hasCTLinks = false;
              let hasKeyMessageBox = false;
              let hasBodyTextBox = false;
              let hasFigNTabWithRef = false;

              if ($body.find('*[class^="external-ref"]').length > 0) {
                hasCTLinks = true;
              }
              if (
                $body.find("#boxed-text-1").length > 0 ||
                $body.find(".boxed-text").length > 0
              ) {
                hasKeyMessageBox = true;
              }
              if ($body.find("#boxed-text-2").length > 0) {
                hasBodyTextBox = true;
              }
              if (
                $body.find(".table-caption > p > a").length > 0 ||
                $body.find(".fig-caption > p > a").length > 0
              ) {
                hasFigNTabWithRef = true;
              }

              const result = {
                url,
                CTLinks: hasCTLinks,
                keyMessageBox: hasKeyMessageBox,
                bodyTextBox: hasBodyTextBox,
                figNTabWithRef: hasFigNTabWithRef,
              };

              // Write the output after each URL is processed
              const csvContent = `${result.url},${result.CTLinks},${result.keyMessageBox},${result.bodyTextBox},${result.figNTabWithRef}\n`;
              cy.writeFile(
                `cypress/inspection/${journal}/HW/externalLinks.csv`,
                csvContent,
                { flag: "a+" }
              );
            });
          });
      };

      urls.forEach((url) => processUrls(url));
    });
  });
});
