export const runHighWireDesignFinder = (journal, domain) => {
  describe("Look for article pages with HW Design Format ", () => {
    const highWireLinks = [];
    const batchSize = 1; // Define the batch size for incremental writes
    // Function to check links for a specific page
    const findHighwireDesign = (url) => {
      // Use cy.request to check if the link is valid
      cy.visit({
        url: `${domain}${url}`,
        failOnStatusCode: false, // Don't fail the test on non-2xx responses
      });
      cy.get("body")
        .then(($body) => {
          if ($body.find(".highwire-cite-title").length > 0) {
            highWireLinks.push({href: `${domain}${url}`});
          }
        })
        .then(() => {
          if (highWireLinks.length >= batchSize) {
            const csvContent = highWireLinks
              .map((result) => `${result.href}`)
              .join("\n");
            cy.writeFile(
              `cypress/downloads/Daily/highWireLinks.csv`,
              csvContent + "\n",
              { flag: "a+" }
            );
            // Clear the brokenLinks array after writing to the file
            highWireLinks.length = 0; // Clear array to prevent memory overload
          }
        });
    };

    it("should collect all the articles with HW Design", () => {
      // Assuming a fixture or hardcoded list of URLs to check
      cy.fixture(`${journal}_AricleUrls.json`).then((data) => {
        data.forEach((page) => {
          const url = page.slice(1);
          findHighwireDesign(url);
        });
      });
    });
  });
};

export default runHighWireDesignFinder;
