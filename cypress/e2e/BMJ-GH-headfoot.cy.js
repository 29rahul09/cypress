describe("Global Health Journals WebPage", () => {
  beforeEach("Visit global health homepage", () => {
    cy.visit("https://gh.bmj.com/");
  });

  it("Header Links Response Check", () => {
    cy.get('[data-testid="top-menu-container"]')
      .find("a")
      .each((page) => {
        const href = page.prop("href");
        const title = page.text();
        cy.log(title);
        cy.request(href).then((response) => {
          expect(response.status).to.eq(200);
        });
        // cy.get(".highwire-cite-title").should("have.text", title);
        // cy.request(href);
      });
  });

  it("CONTENT Footer Links Response Check", () => {
    cy.get('[data-testid="footer-content"]')
      .find("a")
      .each((page) => {
        const href = page.prop("href");
        const title = page.text();
        cy.log(title);
        cy.request(href);
        // cy.get(".highwire-cite-title").should("have.text", title);
        // cy.request(href);
      });
  });

  it("JOURNAL Footer Links Response Check", () => {
    cy.get('[data-testid="footer-journal"]')
      .find("a")
      .each((page) => {
        const href = page.prop("href");
        const title = page.text();
        cy.log(title);
        cy.request(href);
        // cy.get(".highwire-cite-title").should("have.text", title);
        // cy.request(href);
      });
  });

  it("AUTHORS Footer Links Response Check", () => {
    cy.get('[data-testid="footer-authors"]')
      .find("a")
      .each((page) => {
        const href = page.prop("href");
        const title = page.text();
        cy.log(title);
        cy.request(href);
        // cy.get(".highwire-cite-title").should("have.text", title);
        // cy.request(href);
      });
  });

  it("HELP Footer Links Response Check", () => {
    cy.get('[data-testid="footer-help"]')
      .find("a")
      .each((page) => {
        const href = page.prop("href");
        const title = page.text();
        cy.log(title);
        cy.request(href);
        // cy.get(".highwire-cite-title").should("have.text", title);
        // cy.request(href);
      });
  });
});
