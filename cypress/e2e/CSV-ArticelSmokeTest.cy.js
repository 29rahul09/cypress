const journal = "bmjopensem";
const domain = "https://bmjopensem-stage-next.bmj.com";

describe(
  "Run Smoke Test on Stage-site",
  {
    viewportHeight: 800,
    viewportWidth: 1280,
  },
  () => {
    const brokenImages = [];
    const nonBrokenImages = [];
    const missingSupplementary = [];
    const noSupplementary = [];
    const missingRR = [];

    const validateArticlePage = (articleUrl) => {
      cy.visit({
        url: `${domain}${articleUrl}`,
        failOnStatusCode: false,
      });

      cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });

      validateTopBoxSection();
      validateImages(articleUrl);
      validateSupplementaryMaterials(articleUrl);
      validateRapidResponses(articleUrl);
    };

    const validateTopBoxSection = () => {
      cy.get("h1#article-title-1").should("be.visible");
      cy.get(
        '[data-testid="request-permissions"] [data-testid="request-permissions-text"]'
      )
        .should("exist")
        .contains("Request permission");
      cy.get('[data-testid="citation"]')
        .should("exist")
        .contains("Cite this article");
      cy.get('[data-testid="share"]').should("exist").contains("Share");
      cy.get('[data-testid="pdf"] a')
        .should("have.attr", "href")
        .then((href) => {
          cy.request(href).its("status").should("eq", 200);
        });
    };

    const validateSupplementaryMaterials = (articleUrl) => {
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
