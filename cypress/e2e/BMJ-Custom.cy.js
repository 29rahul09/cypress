describe("Test BMJ Journals ", () => {
  beforeEach("Visit BMJ Homepage", () => {
    cy.visit("https://gh.bmj.com/");
  });

  it("Test Blog Page", () => {
    cy.blogPage();
  });

  it("Test Highlighted collection", () => {
    cy.get('[data-testid="homepage-section-1"]').within(() => {
      cy.contains("h2", "Highlighted Collections");
      cy.getHref();
    });
  });

  it("Test Each Article", () => {
    cy.get('[data-testid="homepage-section-1"]')
      .find("a")
      .each((page) => {
        const links = page.prop("href");
        cy.visit(links).then(() => {
          cy.pageHref();
        });
      });
  });

  it.only("Custom Commands Test", () => {});
  
});
