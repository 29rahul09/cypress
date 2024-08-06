const journals = ["https://wjps.bmj.com"];

describe("Collection Page Inspect", () => {
  it("Have Correct Canonical URL", () => {
    journals.forEach((journal) => {
      cy.visit({
        url: `${journal}/pages/browse-by-collection`,
        failOnStatusCode: false,
      });
      cy.get('[data-testid="topic-0"]')
        .first()
        .find("a")
        .invoke("attr", "href")
        .then((href) => {
          cy.visit({
            url: `${journal}${href}`,
            failOnStatusCode: false,
          });
          cy.get('head link[rel="canonical"]')
            .should("have.attr", "href")
            .should("include", "/pages/collection/");
        });
    });
  });
});
