const journal = "gpsych";
const journalSite = "gpsych.bmj.com";
const domain = "https://gpsych.bmj.com";
const issueAandVol = "/37/3";

describe("Investigate Article Page on Stage-site", () => {
  it("Find Article URL", () => {
    const articleUrlId = `cypress/fixtures/${journal}.json`;
    const articleUrls = [];

    cy.visit({
      url: `${journalSite}/content${issueAandVol}`,
      failOnStatusCode: false,
    });

    cy.get(".issue-toc")
      .find("a")
      .each(($ele) => {
        articleUrls.push($ele.attr("href"));
      })
      .then(() => {
        cy.writeFile(articleUrlId, articleUrls);
      });
  });

  it("Find the article have Dual Author bio section", () => {
    const authorBio = [];
    const authorBioId = `cypress/downloads/${journal}/authorBio.csv`;
    cy.fixture(`${journal}.json`).then((data) => {
      data.forEach((page) => {
        cy.visit({
          url: `${domain}${page}`,
          failOnStatusCode: false,
        });

        cy.get("body").then(($body) => {
          if ($body.find("#bio-2").length > 0) {
            authorBio.push(page);
          }
        });
      });
      cy.writeFile(authorBioId, authorBio);
    });
  });

  it.skip(`Check the Article Page response`, () => {
    // Function to check the response of a URL
    const results = [{ url: "URL", status: "STATUS" }]; // Array to store URL and response status
    const responseCheck = (url) => {
      const link = `${domain}${url}`;
      cy.request({ url: link, failOnStatusCode: false }).then((response) => {
        if (response.status !== 200) {
          results.push({ url: url, status: response.status });
          const csvContent = results
            .map((result) => `${result.url},${result.status}`)
            .join("\n");
          cy.writeFile(
            `cypress/inspection/${journal}/RESPONSE/ArticleResponse${issueAandVol}.csv`,
            csvContent
          );
        }
      });
    };
    cy.fixture(`${journal}.json`).then((urls) => {
      urls.forEach((url) => {
        responseCheck(url);
      });
    });
  });

  it.skip("Find the Article with Broken Images ", () => {
    cy.fixture(`${journal}.json`).then((urls) => {
      const brokenImages = [];
      const nonBrokenImages = [];
      urls.forEach((url) => {
        const link = `${domain}${url}`;
        cy.visit({ url: link, failOnStatusCode: false });
        
        cy.get("main")
          .find("img")
          .each(($img, i) => {
            const alt = $img.attr("alt");
            const src = $img.attr("src");
            const width = $img.prop("naturalWidth");
            if (width === 0) {
              brokenImages.push(
                `${url} ==> image ${i + 1} ==> ${src} ==> ${alt}`
              );
            } else {
              nonBrokenImages.push(
                `${url} ==> image ${i + 1} ==> ${src} ==> ${alt}`
              );
            }
          })
          .then(() => {
            if (brokenImages.length > 0) {
              const brokenCsvContent =
                "Broken Image URL\n" + brokenImages.join("\n");
              cy.writeFile(
                `cypress/inspection/${journal}/BROKENIMAGE/brokenImage.csv`,
                brokenCsvContent
              );
            }
            // Write non-broken url to a CSV file
            if (nonBrokenImages.length > 0) {
              const nonBrokenCsvContent =
                "Non-Broken Image URL\n" + nonBrokenImages.join("\n");
              cy.writeFile(
                `cypress/inspection/${journal}/BROKENIMAGE/nonBrokenImage.csv`,
                nonBrokenCsvContent
              );
            }
          });
      });
    });
  });

  it.skip("Find the Article with Broken Table ", () => {
    cy.fixture(`${journal}.json`).then((urls) => {
      const brokenTable = [];
      const nonBrokenTable = [];
      urls.forEach((url) => {
        const link = `${domain}${url}`;
        cy.visit({ url: link, failOnStatusCode: false });
        cy.get("body")
          .then(($body) => {
            const tableContent = $body.find('[data-testid="table-component"]');
            const table = $body.find("#xref-table-wrap-1-1");
            if (tableContent.length === 0 && table.length > 0) {
              brokenTable.push(`${url}`);
            }else{
              nonBrokenTable.push(`${url}`);
            }
          })
          .then(() => {
            if (brokenTable.length > 0) {
              const brokenCsvContent =
                "Broken Image URL\n" + brokenTable.join("\n");
              cy.writeFile(
                `cypress/inspection/${journal}/STAGE/TABLE/brokenTable.csv`,
                brokenCsvContent
              );
            }
            // Write non-broken url to a CSV file
            if (nonBrokenTable.length > 0) {
              const nonBrokenCsvContent =
                "Non-Broken Image URL\n" + nonBrokenTable.join("\n");
              cy.writeFile(
                `cypress/inspection/${journal}/STAGE/TABLE/nonBrokenTable.csv`,
                nonBrokenCsvContent
              );
            }
          });
      });
    });
  });

  it.skip("Should visit URL and find the Article Headings", () => {
    cy.fixture(`${journal}.json`).then((urls) => {
      // Function to visit a URL and process its headings
      const visitUrlAndCollectHeadings = (url, index) => {
        const link = `${domain}${url}`;
        cy.visit({ url: link, failOnStatusCode: false });
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
                  `cypress/inspection/${journal}/STAGE/ArticleHeadings${issueAandVol}.csv`,
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

  it.skip(`Should not have any broken images on the page`, () => {
    // Function to check Broken and Non-Broken images on a given page
    const brokenImages = []; // Array to store URLs of broken images
    const nonBrokenImages = []; // Array to store URLs of non-broken images

    const checkImage = (url) => {
      const link = `${domain}${url}`;
      cy.visit({ url: link, failOnStatusCode: false });
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
});
