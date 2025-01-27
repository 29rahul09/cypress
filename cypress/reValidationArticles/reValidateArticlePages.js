export const runArticlePageReValidation = (journal, domain) => {
  describe("Re Validate all article links with 404 Error ", () => {
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

    it("should re validate all the article links", () => {
      // Assuming a fixture or hardcoded list of URLs to check
      cy.fixture(`${journal}_404Links.json`).then((data) => {
        data.forEach((page) => {
          const url = page.replace(`${domain}`, "");
          reValidatePage(url);
        });
      });
    });
  });
};

export default runArticlePageReValidation;
