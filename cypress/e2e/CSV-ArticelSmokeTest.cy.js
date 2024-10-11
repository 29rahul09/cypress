const journal = "bmjopensem";
const domain = "https://bmjopensem-stage-next.bmj.com";

describe(
  "Run Smoke Test on Stage-site",
  {
    viewportHeight: 800,
    viewportWidth: 1280,
  },
  () => {
    const validateArticlePage = (articleUrl) => {
      cy.visit({
        url: `${domain}${articleUrl}`,
        failOnStatusCode: false,
      });

      cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });

      validateTopBoxSection(articleUrl);
      validateImages(articleUrl);
      validateSupplementaryMaterials(articleUrl);
      validateRapidResponses(articleUrl);
    };
    const validateTopBoxSection = (articleUrl) => {
      const topBoxError = [];
      cy.get("body").then(($body) => {
        const promises = []; // Array to store promises

        if ($body.find("#article-title-1").length > 0) {
          promises.push(cy.get("h1#article-title-1").should("be.visible"));
        }

        if (
          $body.find(
            '[data-testid="request-permissions"] [data-testid="request-permissions-text"]'
          ).length > 0
        ) {
          promises.push(
            cy
              .get(
                '[data-testid="request-permissions"] [data-testid="request-permissions-text"]'
              )
              .should("exist")
              .contains("Request permission")
          );
        }

        if ($body.find('[data-testid="citation"]').length > 0) {
          promises.push(
            cy
              .get('[data-testid="citation"]')
              .should("exist")
              .contains("Cite this article")
          );
        }

        if ($body.find('[data-testid="share"]').length > 0) {
          promises.push(
            cy.get('[data-testid="share"]').should("exist").contains("Share")
          );
        }

        if ($body.find('[data-testid="pdf"] a').length > 0) {
          promises.push(
            cy
              .get('[data-testid="pdf"] a')
              .should("have.attr", "href")
              .then((href) => {
                return cy
                  .request({ url: `${href}`, failOnStatusCode: false })
                  .then((response) => {
                    if (response.status !== 200) {
                      topBoxError.push(`PDF link is missing ==> ${articleUrl}`);
                    }
                  });
              })
          );
        }

        // Wait for all promises to resolve
        Promise.all(promises).then(() => {
          if (topBoxError.length > 0) {
            const topBoxCsvContent = "Top Box Error\n" + topBoxError.join("\n");
            cy.writeFile(
              `cypress/inspection/SmokeTest/${journal}/TopBoxError.csv`,
              topBoxCsvContent
            );
          }
        });
      });
    };

    const validateSupplementaryMaterials = (articleUrl) => {
      const missingSupplementary = [];
      const noSupplementary = [];
      cy.get("body").then(($body) => {
        if ($body.find("#supplementary-materials").length > 0) {
          cy.get("#supplementary-materials").click();
          cy.get('[data-testid="supplementary-link-container"] a').each(
            ($anchor) => {
              const url = $anchor.prop("href");
              cy.request({ url: url, failOnStatusCode: false }).then(
                (response) => {
                  if (response.status !== 200) {
                    missingSupplementary.push(articleUrl);
                    cy.writeFile(
                      `cypress/inspection/SmokeTest/${journal}/missingSupply.csv`,
                      missingSupplementary
                    );
                  }
                }
              );
            }
          );
        } else {
          cy.log("No Supplementary link found on this page.");
          noSupplementary.push(articleUrl);
          cy.writeFile(
            `cypress/inspection/SmokeTest/${journal}/supply.csv`,
            noSupplementary
          );
        }
      });
    };

    const validateRapidResponses = (articleUrl) => {
      const missingRR = [];
      cy.get("body").then(($body) => {
        if ($body.find("#rapid-responses").length > 0) {
          cy.get("#rapid-responses").click();
          cy.get('[data-testid="compose-rapid-response"] a').each(($anchor) => {
            const url = $anchor.prop("href");
            cy.request(url).its("status").should("eq", 200);
          });
        } else {
          cy.log("No RR found on this page.");
          missingRR.push(articleUrl);
          cy.writeFile(
            `cypress/inspection/SmokeTest/${journal}/RResponse.csv`,
            missingRR
          );
        }
      });
    };

    const validateImages = (articleUrl) => {
      const brokenImages = [];
      const nonBrokenImages = [];
      cy.get("main")
        .find("img")
        .each(($img, i) => {
          const src = $img.attr("src");
          const alt = $img.attr("alt");
          const width = $img.prop("naturalWidth");

          if (width === 0) {
            brokenImages.push(`${articleUrl} ==> ${src} ==> ${alt}`);
          } else {
            nonBrokenImages.push(`${src} ==> ${alt}`);
          }
        })
        .then(() => {
          if (brokenImages.length > 0) {
            const brokenCsvContent =
              "Broken Image URL\n" + brokenImages.join("\n");
            cy.writeFile(
              `cypress/inspection/SmokeTest/${journal}/BrokenImage.csv`,
              brokenCsvContent
            );
          } else {
            cy.log("No broken images found on this page.");
          }
        });
    };

    it("Validate article pages", () => {
      cy.fixture(`${journal}.json`).then((data) => {
        data.forEach((articleUrl) => {
          validateArticlePage(articleUrl);
          cy.writeFile(
            `cypress/inspection/SmokeTest/${journal}/lastVisitedUrl.csv`,
            articleUrl
          );
        });
      });
    });
  }
);
