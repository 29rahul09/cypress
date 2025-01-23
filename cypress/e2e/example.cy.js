describe("JUST TEST THE TUTES", () => {
  it("CUSTOMIZE LOG MESSAGE", () => {
    cy.log("normal");
    cy.log("**Rahul-In-Bold**");
    cy.log("_Rahul-In-Italic_");
    cy.log("[link](<https://www.google.com/>)");
  });

  it("CUSTOMIZE ERROR MESSAGE", () => {
    cy.visit("https://gh.bmj.com/")
      .get('[data-testid="top-menu-logo"]')
      .then((logo) => {
        expect(logo, "Logo Not Found").to.contain.text("BMJ logo");
      });
  });

  it("Login By Custom Commands", () => {
    cy.loginApp();
  });

  it.only("TEST THE PAGE", () => {
    // cy.visit('https://jitc.bmj.com/content/12/11/e008898')
    // cy.get('#abstract-1> .subsection > #T1').should('exist')
    // cy.get('#abstract-1> .subsection > #F1').should('exist')
    const url = "https://jitc-stage-next.bmj.com/content/5/1/30";
    cy.visit({
      url: `${url}`,
      failOnStatusCode: false,
      auth: {
        username: "BMJStaging",
        password: "bmj2410",
      },
    });
    cy.get("#supplementary-materials").should("exist");
  });
});
