describe("Check all links are reachable", () => {
  it("should check that all links return a 2xx status code", () => {
    cy.fixture("homePage.json").then((data) => {
      data.forEach((page) => {
        cy.visit(page);
        // Find all anchor tags on the page
        cy.get("a").each(($link) => {
          const href = $link.prop("href"); // Get the href attribute of the link

          // Ensure the href is not empty or a javascript link
          if (href && href.includes("content")) {
            // Use cy.request to check if the link is valid
            cy.request({
              url: href,
              failOnStatusCode: false, // Don't fail the test on non-2xx responses
            }).then((response) => {
              // Ensure the link returns a 2xx status code (success)
              expect(response.status).to.be.within(200, 299);
            });
          }
        });
      });
    });
  });
});
