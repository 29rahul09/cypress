// npx cypress run --headless --spec "cypress/e2e/pageLoadSuccess.cy.js"
describe("Basic Authentication Test", () => {
  it(
    "should load the page body",
    {
      viewportHeight: 800,
      viewportWidth: 1280,
    },
    () => {
      const journal = "https://sit.bmj.com";
      const domain = journal.split("/")[2].split(".")[0];
      const filePath = `cypress/downloads/sitemaps/${domain}/sitemap.json`;
      // Store failed pages in an array for later reporting
      let failedPages = [];

      cy.readFile(filePath, "utf8").then((data) => {
        // Iterate over the fixture data, testing each page one by one
        cy.wrap(data.Url)
          .each((page) => {
            // Send a request to the page without providing credentials
            cy.visit({
              url: `${page}`,
              failOnStatusCode: false, // Do not fail the test immediately on error
            }).then(() => {
              cy.get("body").then(($body) => {
                if ($body.find("main").length === 0) {
                  // Log the failed page and add it to the failedPages array
                  cy.log(`Failed to load page: ${page}`);
                  failedPages.push(page); // Store the failed page URL for reporting later
                }
              });
            });
          })
          .then(() => {
            // After all pages are tested, log all failed pages if any
            if (failedPages.length > 0) {
              cy.writeFile(
                `cypress/downloads/sitemaps/${domain}/failedPages.json`,
                failedPages,
                {
                  flag: "a+",
                }
              );
              // cy.log(`The following pages failed:`);
              // failedPages.forEach((failedPage) => {
              //   cy.log(failedPage); // Log each failed page
              // });
            } else {
              cy.log("All pages load Successfully.");
            }
          });
      });
    }
  );
});
