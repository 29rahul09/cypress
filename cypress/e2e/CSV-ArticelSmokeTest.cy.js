// npx cypress run --headless --browser chrome --spec "cypress/e2e/CSV-ArticelSmokeTest.cy.js"
const journal = "GlobalHealth";
const domain = "https://gh-stage-next.bmj.com";

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
        auth: {
          username: "BMJStaging",
          password: "bmj2410",
        },
      });

      cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });

      validateTopBoxSection(articleUrl);
      validateImages(articleUrl);
      validateSupplementaryMaterials(articleUrl);
      validateRapidResponses(articleUrl);
    };

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

    const validateTopBoxSection = (articleUrl) => {
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
                              `cypress/inspection/SmokeTest/${journal}/TopBoxError.csv`,
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
                        `cypress/inspection/SmokeTest/${journal}/TopBoxError.csv`,
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

    const validateSupplementaryMaterials = (articleUrl) => {
      const missingSupplementary = [];
      const nonSupplementary = [];
      cy.get("body").then(($body) => {
        if ($body.find("#supplementary-materials").length > 0) {
          cy.get('[data-testid="overview-list"] a').then(($anchor) => {
            const urls = [];
            $anchor.each((index, element) => {
              urls.push(element.href);
            });
            if (urls.some((url) => url.includes("supplementary-materials"))) {
              cy.get("#supplementary-materials").click();
              cy.get('[data-testid="supplementary-link-container"] a').each(
                ($anchor) => {
                  const url = $anchor.prop("href");
                  cy.request({
                    url: url,
                    failOnStatusCode: false,
                    timeout: 6000,
                  })
                    .then((response) => {
                      if (response.status !== 200) {
                        missingSupplementary.push(
                          `Error in Supplementary Files ==> ${articleUrl} ==> ${url}`
                        );
                      }
                    })
                    .then(() => {
                      if (missingSupplementary.length > 0) {
                        writeUniqueEntriesToFile(
                          `cypress/inspection/SmokeTest/${journal}/missingSupply.csv`,
                          missingSupplementary
                        );
                      }
                    });
                }
              );
            } else {
              missingSupplementary.push(
                `NO Supplementary in Overview ==> ${articleUrl}`
              );

              writeUniqueEntriesToFile(
                `cypress/inspection/SmokeTest/${journal}/missingSupply.csv`,
                missingSupplementary
              );
            }
          });
        } else {
          nonSupplementary.push(`NO Supplementary Files ==> ${articleUrl}`);

          writeUniqueEntriesToFile(
            `cypress/inspection/SmokeTest/${journal}/NonSupplymentary.csv`,
            nonSupplementary
          );
        }
      });
    };

    const validateRapidResponses = (articleUrl) => {
      const missingRR = [];
      const noOverview = [];
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="overview-list"]').length > 0) {
          cy.get('[data-testid="overview-list"] a')
            .last()
            .then(($anchor) => {
              const url = $anchor.prop("href");
              const text = $anchor.text();
              if (
                text === "Rapid Responses" &&
                url.includes("rapid-responses")
              ) {
                cy.get("#rapid-responses").click();
                cy.get('[data-testid="compose-rapid-response"] a').each(
                  ($anchor) => {
                    const url = $anchor.prop("href");
                    cy.request({
                      url: url,
                      failOnStatusCode: false,
                      timeout: 6000,
                    })
                      .then((response) => {
                        if (response.status !== 200) {
                          missingRR.push(
                            `No Submission Page ==> ${articleUrl} ==> ${url}`
                          );
                        }
                      })
                      .then(() => {
                        if (missingRR.length > 0) {
                          writeUniqueEntriesToFile(
                            `cypress/inspection/SmokeTest/${journal}/missingRR.csv`,
                            missingRR
                          );
                        }
                      });
                  }
                );
              } else {
                missingRR.push(
                  `NO Rapid response in Overview ==> ${articleUrl}`
                );

                writeUniqueEntriesToFile(
                  `cypress/inspection/SmokeTest/${journal}/missingRR.csv`,
                  missingRR
                );
              }
            });
        } else {
          noOverview.push(`NO Overview ==> ${articleUrl}`);

          writeUniqueEntriesToFile(
            `cypress/inspection/SmokeTest/${journal}/noOverview.csv`,
            noOverview
          );
        }
      });
    };

    const validateImages = (articleUrl) => {
      const brokenImages = [];
      cy.get("main")
        .find("img")
        .each(($img) => {
          const src = $img.attr("src");
          const alt = $img.attr("alt");
          const width = $img.prop("naturalWidth");

          if (width === 0) {
            brokenImages.push(`${articleUrl} ==> ${src} ==> ${alt}`);
          }
        })
        .then(() => {
          if (brokenImages.length > 0) {
            writeUniqueEntriesToFile(
              `cypress/inspection/SmokeTest/${journal}/BrokenImage.csv`,
              brokenImages
            );
          }
        });
    };

    it("Validate article pages", () => {
      cy.fixture(`GH.json`).then((data) => {
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
