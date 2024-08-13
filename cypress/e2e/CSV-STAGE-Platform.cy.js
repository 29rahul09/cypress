const journal = "neurologyopen";
const domain = "https://neurologyopen-stage-next.bmj.com";

describe("Investigate Article Page on Stage-site", () => {
  before(() => {
    cy.visit("https://neurologyopen-stage-next.bmj.com/");
  });

  it(`Should check the Article Page response`, () => {
    // Function to check the response of a URL
    const results = [{ url: "URL", status: "STATUS" }]; // Array to store URL and response status
    const responseCheck = (url) => {
      cy.request(`${domain}${url}`, { failOnStatusCode: false }).then(
        (response) => {
          results.push({ url: url, status: response.status });
          const csvContent = results
            .map((result) => `${result.url},${result.status}`)
            .join("\n");
          cy.writeFile(
            `cypress/inspection/${journal}/RESPONSE/ArticleResponse.csv`,
            csvContent
          );
        }
      );
    };
    cy.fixture(`${journal}.json`).then((urls) => {
      urls.forEach((url) => {
        responseCheck(url);
      });
    });
  });

  it.only(`Should not have any broken images on the page`, () => {
    // Function to check Broken and Non-Broken images on a given page
    const brokenImages = []; // Array to store URLs of broken images
    const nonBrokenImages = []; // Array to store URLs of non-broken images

    const checkImage = (url) => {
      cy.visit(`${domain}${url}`, { failOnStatusCode: false });
      cy.get("main")
        .find("img")
        .each(($img) => {
          cy.wrap($img).should("have.attr", "src");

          cy.wrap($img).then(($imgElement) => {
            const imgSrc = $imgElement.attr("src");

            const img = new Image();
            img.src = imgSrc;

            img.onload = () => {
              if (img.naturalWidth === 0) {
                brokenImages.push(`${url} ==> ${imgSrc}`);
              } else {
                nonBrokenImages.push(`${url}`);
              }
            };

            img.onerror = () => {
              brokenImages.push(`${url} ==> ${imgSrc}`);
            };
          });
        })
        .then(() => {
          // Write broken images to a CSV file
          if (brokenImages.length > 0) {
            const brokenCsvContent =
              "Broken Image URL\n" + brokenImages.join("\n");
            cy.writeFile(
              `cypress/inspection/${journal}/BROKENIMAGE/brokenImage.csv`,
              brokenCsvContent
            );
          }

          // Write non-broken images to a CSV file
          if (nonBrokenImages.length > 0) {
            const nonBrokenCsvContent =
              "Non-Broken Image URL\n" + nonBrokenImages.join("\n");
            cy.writeFile(
              `cypress/inspection/${journal}/BROKENIMAGE/nonBrokenImage.csv`,
              nonBrokenCsvContent
            );
          }
        });
    };
    cy.fixture(`${journal}.json`).then((urls) => {
      urls.forEach((url) => {
        checkImage(url);
      });
    });
  });

  it("Should visit URL and find the Article Headings", () => {
    cy.fixture(`${journal}.json`).then((urls) => {
      // Function to visit a URL and process its headings
      const visitUrlAndCollectHeadings = (url, index) => {
        cy.visit(`${domain}${url}`, { failOnStatusCode: false });
        cy.get("body").then(($body) => {
          if ($body.find('[data-testid="overview-list"]').length > 0) {
            cy.get('[data-testid="overview-list"]')
              .find("li")
              .then(($headings) => {
                const headingsText = [];
                $headings.each((index, $el) => {
                  const headingText = Cypress.$($el).text();
                  if (Cypress.$($el).is(":visible")) {
                    headingsText.push(headingText);
                  } else {
                    headingsText.push("No headings found");
                  }
                });
                // headingsText.sort();
                const result = {
                  url,
                  headings: headingsText.join(" | "),
                };

                // Write the output after each URL is processed
                const csvContent = `${result.url},${result.headings}\n`;
                cy.writeFile(
                  `cypress/inspection/${journal}/STAGE/ArticleHeadings.csv`,
                  csvContent,
                  { flag: "a+" }
                );
              });
          }
        });
      };
      urls.forEach((url, index) => {
        visitUrlAndCollectHeadings(url, index);
      });
    });
  });
});
