// npx cypress run --headless --browser chrome --spec "cypress/e2e/articlePageValidation.cy.js"
describe("Check all href links for status codes between 400 and 500", () => {
  const journal = "BMJRespRes";
  const domain = "https://bmjopenrespres.bmj.com";
  // Function to check links for a specific page
  const reValidatePage = (page) => {
    cy.fixture(`reValidationUrl.json`).then((data) => {
      data.forEach((url) => {
        if (url.id === `${domain}`) {
          cy.request({
            url: `${url.script}${page}`,
            failOnStatusCode: false, // Don't fail the test on non-2xx responses
          });
        }
      });
    });
  };

  it("should check links for 404 and 500 status codes", () => {
    // Assuming a fixture or hardcoded list of URLs to check
    cy.fixture(`${journal}_404Links.json`).then((data) => {
      data.forEach((page) => {
        const url = page.replace(`${domain}`, "");
        reValidatePage(url);
      });
    });
  });
});
// Compare this snippet from cypress/functions/getArchivePage.js:
