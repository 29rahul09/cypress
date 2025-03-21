describe("Basic Authentication Test", () => {
  it("should not load the page body without authentication credentials", () => {
    // Store failed pages in an array for later reporting
    let failedPages = [];

    cy.fixture("stagenext.json").then((data) => {
      // Iterate over the fixture data, testing each page one by one
      cy.wrap(data).each((page) => {
        // Send a request to the page without providing credentials
        cy.request({
          url: `${page}`,
          failOnStatusCode: false, // Do not fail the test immediately on error
          method: "GET",
        }).then((response) => {
          // Assert that the status code is either 401 Unauthorized or 403 Forbidden
          if (![401, 403].includes(response.status)) {
            // Log the failed page and add it to the failedPages array
            cy.log(`Authentication failed for page: ${page}`);
            failedPages.push(page); // Store the failed page URL for reporting later
          }

          // Assert that the response body contains a message related to authentication
          // Modify this message based on what your application returns
          expect(response.body).to.include("You need to login"); // Adjust this message accordingly

          // Optional: Check if there is a redirect (e.g., to the login page)
          // if (response.status === 401 || response.status === 403) {
          //   expect(response.headers)
          //     .to.have.property("location")
          //     .and.to.include("login"); // Replace with actual login URL or pattern
          // }
        });
      }).then(() => {
        // After all pages are tested, log all failed pages if any
        if (failedPages.length > 0) {
          cy.log(`The following pages failed authentication:`);
          failedPages.forEach((failedPage) => {
            cy.log(failedPage); // Log each failed page
          });
        } else {
          cy.log('All pages passed authentication test.');
        }
      });
    });
  });
});
