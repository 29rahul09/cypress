const journal = "neurologyopen";
const domain = "https://neurologyopen-stage-next.bmj.com";

describe("Investigate Article Page on Stage-site", () => {
  it("should visit URL and find the Article Headings", () => {
    const results = [];

    // Function to collect headings from a page
    const collectHeadings = ($headings) => {
      const headingsText = [];
      $headings.each((index, $el) => {
        const headingText = Cypress.$($el).text();
        if (Cypress.$($el).is(":visible")) {
          headingsText.push(headingText);
        }
      });
      return headingsText.join(" | ");
    };

    // Function to visit a URL and process its headings
    const visitUrlAndCollectHeadings = (url, index) => {
      cy.visit(`${domain}${url}`, { failOnStatusCode: false });
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="overview-list"]').length > 0) {
          cy.get('[data-testid="overview-list"]')
            .find("li")
            .then(($headings) => {
              const headingsText = collectHeadings($headings);
              results.push({ url, headings: headingsText });
            });
        } else {
          results.push({ url, headings: "No headings found" });
        }
        // if all URLs have been processed
        const csvContent = results
          .map((result) => `${result.url},${result.headings}`)
          .join("\n");
        cy.writeFile(
          `cypress/inspection/${journal}/NEW/ArticleHeadings.csv`,
          csvContent
        );
      });
    };

    cy.fixture(`${journal}.json`).then((urls) => {
      urls.forEach((url, index) => {
        visitUrlAndCollectHeadings(url, index);
      });
    });
  });
});
