export const runPageNotFoundTest = (journal, domain) => {
    describe("Check all href links for status codes between 400 and 500", () => {
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
                brokenLinks.push(`${domain}${page}`);
              }
            })
            .then(() => {
                if (brokenLinks.length >= batchSize) {
                    // Write brokenLinks as valid JSON
                    cy.writeFile(
                      `cypress/fixtures/${journal}_404Links.json`,
                      JSON.stringify(brokenLinks, null, 2), // Pretty-print with 2 spaces indentation
                      { flag: "a+" }
                    );
                    // Clear the brokenLinks array after writing to the file
                    brokenLinks.length = 0;
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
  };
  
  export default runPageNotFoundTest;
  