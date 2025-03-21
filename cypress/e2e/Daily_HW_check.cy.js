// npx cypress run --headless --browser chrome --spec "cypress/e2e/Daily_404_run.cy.js"
describe("Check all links are reachable", () => {
  const highWireLinks = [];
  const batchSize = 1; // Define the batch size for incremental writes
  const checkArticleLinks = (page) => {
    cy.visit(page); // Visit the page
    cy.get("body").then(($body) => {
      if (
        $body.find(".pane-highwire-issue-archive > .pane-content").length > 0
      ) {
        cy.get(".pane-highwire-issue-archive > .pane-content")
          .find("a")
          .first()
          .click();
        checkLinks(page, ".issue-toc");
      } else {
        cy.get('[data-testid="article-list-section-0"]')
          .find("a")
          .first()
          .click();
        checkLinks(page, ".prose");
      }
    });
  };

  const checkLinks = (page, id) => {
    cy.get(`${id} a`).each(($link) => {
      const href = $link.prop("href"); // Get the href attribute of the link

      // Ensure the href is not empty or a javascript link
      if (href) {
        // Use cy.request to check if the link is valid
        cy.visit({
          url: href,
          failOnStatusCode: false, // Don't fail the test on non-2xx responses
        });
        cy.get("body")
          .then(($body) => {
            if ($body.find(".highwire-cite-title").length > 0) {
              highWireLinks.push({ page: page, href: href });
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
      }
    });
  };

  it("should check that all links return a 2xx status code", () => {
    cy.fixture("homePage.json").then((data) => {
      data.forEach((page) => {
        checkArticleLinks(`${page}/content/by/volume/`);
      });
    });
  });
});
