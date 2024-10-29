const issuePages = [ 
  "https://lupus.bmj.com/content/4/Suppl_1",];
const journal = "lupus";
const domain = "https://lupus.bmj.com";
const articleUrlId = `cypress/fixtures/${journal}.json`;

describe("Pagination Test", () => {
  const articleUrls = [];

  const getOnPageArticles = () => {
    cy.get(".highwire-search-results-list a").each(($articleLink) => {
      articleUrls.push($articleLink.attr("href"));
    });
  };

  const navigateToNextPage = () => {
    cy.get("body").then(($body) => {
      if ($body.find(".pager-next").length > 0) {
        cy.get(".pager-next").then(($button) => {
          if ($button.is(":visible") && !$button.is(":disabled")) {
            cy.wrap($button).click();
            cy.wait(500);
            searchFailedOnPage();
            getOnPageArticles();
            navigateToNextPage();
          }
        });
      }
    });
  };

  const searchFailedOnPage = () => {
    cy.get("body").then(($body) => {
      if ($body.find("#search-summary-wrapper").length > 0) {
        cy.get("#search-summary-wrapper").then(($searchSummary) => {
          if ($searchSummary.is(":visible") && $searchSummary.text().includes("No Results")) {
            cy.wait(500);
            cy.reload().then(() => {
              getOnPageArticles();
              navigateToNextPage();
            });
          }
        });
      }
    });
  };
  // Cypress.on('fail', (error, runnable) => {
  //   cy.writeFile(articleUrlId, articleUrls);
  //   throw error; // still fail the test
  // });

  it("should navigate through all Supply pages", () => {
    issuePages.forEach((page) => {
      cy.visit(page, { failOnStatusCode: false });

      cy.get(".issue-toc a")
        .each(($link) => {
          const href = $link.attr("href");

          // Start navigation from the first page
          cy.visit(`${domain}${href}`, { failOnStatusCode: false });
          getOnPageArticles();
          navigateToNextPage();
        })
        .then(() => {
          cy.writeFile(articleUrlId, articleUrls);
        });
    });
  });
});
