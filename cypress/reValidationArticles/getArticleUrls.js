export const runGetArticleUrls = (journal, domain) => {
  describe(`Get All ArticlePage Urls`, () => {
    const articleUrls = [];
    const supplyPageUrls = [];
    let reloadCount = 0;

    const getOnPageArticles = () => {
      cy.get("body").then(($body) => {
        if ($body.find(".highwire-search-results-list").length > 0) {
          cy.get(".highwire-search-results-list a").each(($articleLink) => {
            articleUrls.push($articleLink.attr("href"));
          });
        } else {
          searchFailedOnPage();
        }
      });
    };

    const navigateToNextPage = () => {
      cy.get("body").then(($body) => {
        if ($body.find(".pager-next").length > 0) {
          cy.get(".pager-next").then(($button) => {
            if ($button.is(":visible") && !$button.is(":disabled")) {
              cy.wrap($button).click();
              cy.wait(1000);
              searchFailedOnPage();
            }
          });
        }
      });
    };

    const searchFailedOnPage = () => {
      cy.get("body").then(($body) => {
        if ($body.find("#search-summary-wrapper").length > 0) {
          cy.get("#search-summary-wrapper").then(($searchSummary) => {
            if ($searchSummary.text().includes("No Results")) {
              if (reloadCount < 1) {
                reloadCount++;
                cy.wait(500);
                cy.reload().then(() => {
                  searchFailedOnPage();
                  cy.log("Page Reloaded");
                });
              } else {
                cy.log("No Results found after reload");
              }
            } else {
              getOnPageArticles();
              navigateToNextPage();
            }
          });
        } else {
          getOnPageArticles();
          navigateToNextPage();
        }
      });
    };

    const getSupplyPageArticle = () => {
      cy.fixture(`${journal}_SupplyPageUrls.json`).then((data) => {
        data.forEach((page) => {
       cy.visit(`${domain}${href}`, { failOnStatusCode: false });
                  getOnPageArticles();
                  navigateToNextPage();

        });
      }
      );
    }



    it("Collects all the article Urls", () => {
      cy.fixture(`${journal}_Vol&Issue.json`).then((data) => {
        data.forEach((page) => {
          cy.visit({
            url: `${domain}${page}`,
            failOnStatusCode: false,
            auth: {
              username: "BMJStaging",
              password: "bmj2410",
            },
          });

          cy.get("body")
          .then(($body) => {
            if ($body.find(".issue-toc".length > 0)) {
              cy.get(".issue-toc a").each(($el) => {
                const href = $el.attr("href");
                if (href.includes("content")) {
                  articleUrls.push(href);
                }
                if (href.includes("search")) {
                  supplyPageUrls.push(`${domain}${href}`);
                  cy.writeFile(`cypress/fixtures/${journal}_SupplyPageUrls.json`, supplyPageUrls);
                  cy.visit(`${domain}${href}`, { failOnStatusCode: false });
                  getOnPageArticles();
                  navigateToNextPage();
                }
              });
            }
          })
            .then(() => {
              if (articleUrls.length > 0) {
                var newUrls = articleUrls.map(function (url) {
                  // return url.split("/content")[1]; // Remove everything before "/content"
                  return url;

                });
                cy.writeFile(`cypress/fixtures/${journal}_AricleUrls.json`, newUrls);
              }
            });
        });
      });
    });
  });
};

export default runGetArticleUrls;
