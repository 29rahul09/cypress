// npx cypress run --headless --browser chrome --spec "cypress/e2e/Daily_404_run.cy.js"
describe("Check all links are reachable", () => {
  const brokenLinks = [];
  const batchSize = 1; // Define the batch size for incremental writes
  const checkArticleLinks = (page) => {
    cy.visit(page); // Visit the page
    // Find all anchor tags on the page
    cy.get("a").each(($link) => {
      const href = $link.prop("href"); // Get the href attribute of the link

      // Ensure the href is not empty or a javascript link
      if (href && href.match(/\/content\/\d+/)) {
        // Use cy.request to check if the link is valid
        cy.request({
          url: href,
          failOnStatusCode: false, // Don't fail the test on non-2xx responses
        })
          .then((response) => {
            if (response.status >= 200 && response.status < 400) {
              console.log(`${response.status}`);
            } else {
              brokenLinks.push({
                page: page,
                href: href,
                status: response.status,
              });
            }
          })
          .then(() => {
            if (brokenLinks.length >= batchSize) {
              const csvContent = brokenLinks
                .map((result) => `${result.href}`)
                .join("\n");
              cy.writeFile(
                `cypress/downloads/Daily/brokenLinks.csv`,
                csvContent + "\n",
                { flag: "a+" }
              );
              // Clear the brokenLinks array after writing to the file
              brokenLinks.length = 0; // Clear array to prevent memory overload
            }
          });
      }
    });
  };

  it("should check that all links return a 2xx status code", () => {
    cy.fixture("homePage.json").then((data) => {
      data.forEach((page) => {
        checkArticleLinks(page);
        checkArticleLinks(`${page}/content/current`);
      });
    });
  });
});
