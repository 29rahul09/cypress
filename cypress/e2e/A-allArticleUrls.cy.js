const issueAandVol =[
 
  "https://gh.bmj.com/content/6/9",
  "https://gh.bmj.com/content/6/8",
  "https://gh.bmj.com/content/6/Suppl_5",
  "https://gh.bmj.com/content/6/Suppl_4",
  "https://gh.bmj.com/content/6/7",
  "https://gh.bmj.com/content/6/6",
  "https://gh.bmj.com/content/6/Suppl_3",
  "https://gh.bmj.com/content/6/Suppl_2",
  "https://gh.bmj.com/content/6/5",
  "https://gh.bmj.com/content/6/Suppl_1",
  "https://gh.bmj.com/content/6/4",
  "https://gh.bmj.com/content/6/3",
  "https://gh.bmj.com/content/6/2",
  "https://gh.bmj.com/content/6/1",
  "https://gh.bmj.com/content/5/12",
  "https://gh.bmj.com/content/5/11",
  "https://gh.bmj.com/content/5/10",
  "https://gh.bmj.com/content/5/9",
  "https://gh.bmj.com/content/5/8",
  "https://gh.bmj.com/content/4/Suppl_7",
  "https://gh.bmj.com/content/5/7",
  "https://gh.bmj.com/content/5/6",
  "https://gh.bmj.com/content/5/5",
  "https://gh.bmj.com/content/5/Suppl_1",
  "https://gh.bmj.com/content/5/4",
  "https://gh.bmj.com/content/5/3",
  "https://gh.bmj.com/content/5/2",
  "https://gh.bmj.com/content/5/1",
  "https://gh.bmj.com/content/4/6",
  "https://gh.bmj.com/content/4/Suppl_10",
  "https://gh.bmj.com/content/4/Suppl_9",
  "https://gh.bmj.com/content/4/5",
  "https://gh.bmj.com/content/4/Suppl_8",
  "https://gh.bmj.com/content/4/Suppl_6",
  "https://gh.bmj.com/content/4/4",
  "https://gh.bmj.com/content/4/Suppl_4",
  "https://gh.bmj.com/content/4/Suppl_5",
  "https://gh.bmj.com/content/4/3",
  "https://gh.bmj.com/content/4/Suppl_3",
  "https://gh.bmj.com/content/4/2",
  "https://gh.bmj.com/content/4/Suppl_2",
  "https://gh.bmj.com/content/4/Suppl_1",
  "https://gh.bmj.com/content/4/1",
  "https://gh.bmj.com/content/3/6",
  "https://gh.bmj.com/content/3/5",
  "https://gh.bmj.com/content/3/3",
  "https://gh.bmj.com/content/3/Suppl_5",
  "https://gh.bmj.com/content/3/Suppl_4",
  "https://gh.bmj.com/content/3/4",
  "https://gh.bmj.com/content/3/Suppl_3",
  "https://gh.bmj.com/content/2/Suppl_4",
  "https://gh.bmj.com/content/3/Suppl_2",
  "https://gh.bmj.com/content/3/2",
  "https://gh.bmj.com/content/3/Suppl_1",
  "https://gh.bmj.com/content/3/1",
  "https://gh.bmj.com/content/2/Suppl_3",
  "https://gh.bmj.com/content/2/4",
  "https://gh.bmj.com/content/2/3",
  "https://gh.bmj.com/content/2/2",
  "https://gh.bmj.com/content/2/Suppl_2",
  "https://gh.bmj.com/content/2/Suppl_1",
  "https://gh.bmj.com/content/2/1",
  "https://gh.bmj.com/content/1/4",
  "https://gh.bmj.com/content/1/Suppl_2",
  "https://gh.bmj.com/content/1/3",
  "https://gh.bmj.com/content/1/2",
  "https://gh.bmj.com/content/1/1",
  "https://gh.bmj.com/content/1/Suppl_1"
];

const journal = "Global Health";
const domain = "https://gh.bmj.com";

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
