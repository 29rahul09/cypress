const issueAandVol = ["https://neurologyopen.bmj.com/content/4/Suppl_1"];
const journal = "neurologyopen";
const domain = "https://neurologyopen.bmj.com";
const articleUrlId = `cypress/fixtures/${journal}.json`;
const pdfImageId = `cypress/downloads/${journal}/pdfImage.csv`;

describe("Search and Find PDF Only Article Page ", () => {
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

  // Test to find articles with specific image pdfImage
  it("Find the article have image with source info", () => {
    const pdfImage = [];

    // Read article URLs from JSON file
    cy.fixture(`${journal}.json`).then((data) => {
      // Visit each article page and check for specific image pdfImage
      data.forEach((page) => {
        cy.visit(`${domain}${page}`, { failOnStatusCode: false });

        cy.get("body").then(($body) => {
          if ($body.find("#cboxLoadedContent").length > 0) {
            pdfImage.push(page);
          }
        });
      });

      // Write results to CSV file
      cy.writeFile(pdfImageId, pdfImage);
    });
  });
});
