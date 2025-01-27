// npx cypress run --headless --browser chrome --spec "cypress/e2e/find404articles.cy.js"
describe("Check all href links for status codes between 400 and 500", () => {
  const journal = "BMJRespRes";
  const domain = "https://bmjopenrespres.bmj.com";
  const brokenLinks = [];
  const batchSize = 1; // Define the batch size for incremental writes
  // Function to check links for a specific page
  const checkArticleLinks = (page) => {
    // Use cy.request to check if the link is valid
    cy.request({
      url: `${domain}${page}`,
      failOnStatusCode: false, // Don't fail the test on non-2xx responses
    })
      .then((response) => {
        if (response.status >= 200 && response.status < 400) {
          console.log(`${response.status}`);
        } else {
          brokenLinks.push({
            href: `${domain}${page}`,
          });
        }
      })
      .then(() => {
        if (brokenLinks.length >= batchSize) {
          const csvContent = brokenLinks
            .map((result) => `${result.href}`)
            .join("\n");
          cy.writeFile(
            `cypress/fixtures/${journal}_404Links.json`,
            csvContent + "\n",
            { flag: "a+" }
          );
          // Clear the brokenLinks array after writing to the file
          brokenLinks.length = 0; // Clear array to prevent memory overload
        }
      });
  };

  it("should check links for 404 and 500 status codes", () => {
    // Assuming a fixture or hardcoded list of URLs to check
    cy.fixture(`${journal}_AricleUrls.json`).then((data) => {
      data.forEach((page) => {
        checkArticleLinks(page);
      });
    });
  });
});
// Compare this snippet from cypress/functions/getArchivePage.js:
