const issueAandVol = [
  "https://lupus.bmj.com/content/9/1",
  "https://lupus.bmj.com/content/9/Suppl_3",
  "https://lupus.bmj.com/content/9/Suppl_2",
  "https://lupus.bmj.com/content/9/Suppl_1",
  
];

const journal = "lupus";
const domain = "https://lupus.bmj.com";
describe("Article Urls Collection", () => {
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


  it("Visit Issue And Volume Page", () => {
  
    issueAandVol.forEach((page) => {
      cy.visit(page, { failOnStatusCode: false });
      cy.get(".issue-toc a")
      .each(($link) => {
        const href = $link.attr("href");
        if(href.includes("content")){
          articleUrls.push(href);
        }
        if(href.includes("search")){
          cy.visit(`${domain}${href}`, { failOnStatusCode: false });
          getOnPageArticles();
          navigateToNextPage();
        }
      
      })
       
      .then(() => {
        cy.writeFile(`cypress/fixtures/${journal}.json`, articleUrls);
      });
    })
    

  });
});

