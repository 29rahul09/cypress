const issueAandVol = [
    "https://bmjopensem.bmj.com/content/10/4",
    "https://bmjopensem.bmj.com/content/10/3",
    "https://bmjopensem.bmj.com/content/10/2",
    "https://bmjopensem.bmj.com/content/10/1",
  
  ];
  
  const journal = "bmjopensem";
  const articleUrlId = `cypress/fixtures/${journal}.json`;
  
  describe("Article Page Sections", () => {
    // Test to fetch article URLs
    it("Find Article URL", () => {
      const articleUrls = [];
  
      issueAandVol.forEach((page) => {
        cy.visit(page, { failOnStatusCode: false });
  
        cy.get(".issue-toc")
          .find("a")
          .each(($ele) => {
            articleUrls.push($ele.attr("href"));
          })
          .then(() => {
            cy.writeFile(articleUrlId, articleUrls);
          });
      });
    });
  
    
  });
  