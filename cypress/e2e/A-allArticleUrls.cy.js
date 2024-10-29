const issueAandVol = [
  "https://lupus.bmj.com/content/4/1",
  "https://lupus.bmj.com/content/3/1",
  "https://lupus.bmj.com/content/2/1",
  "https://lupus.bmj.com/content/1/1",
];

const journal = "lupus";
const domain = "https://lupus.bmj.com";

describe("Article Urls Collection", () => {
  before(() => {
    cy.visit(domain, { failOnStatusCode: false });
  });

  const articleUrls = [];
  let reloadCount = 0;

  const getOnPageArticles = () => {
    cy.get('body').then(($body) => {
      if ($body.find(".highwire-search-results-list").length > 0) {
        cy.get(".highwire-search-results-list a").each(($articleLink) => {
          articleUrls.push($articleLink.attr("href"));
        });
      }else{
        searchFailedOnPage();
      }
    }
    );
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

  it("Visit Issue And Volume Page", () => {
    issueAandVol.forEach((page) => {
      cy.request(page)
        .then((response) => {
          const $html = Cypress.$(response.body);
          $html.find(".issue-toc a").each((_, link) => {
            const href = link.href;
            if (href.includes("content")) {
              articleUrls.push(href);
            }
            if (href.includes("search")) {
              cy.visit(`${href}`, { failOnStatusCode: false });
              getOnPageArticles();
              navigateToNextPage();
            }
          });
        })
        .then(() => {
          if (articleUrls.length > 0) {
            cy.writeFile(
              `cypress/inspection/${journal}/HW/articleUrls.csv`,
              articleUrls
            );
          }
        });
    });
  });
});
