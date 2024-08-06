const issuePages = ["https://neurologyopen.bmj.com/content/3/Suppl_1"];
const journal = "neurologyopen";
const domain = "https://neurologyopen.bmj.com";
const articleUrlId = `cypress/fixtures/${journal}.json`;

describe("Pagination Test", () => {
  it("should navigate through all pages", () => {
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
              getOnPageArticles();
              navigateToNextPage();
            }
          });
        }
      });
    };

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
