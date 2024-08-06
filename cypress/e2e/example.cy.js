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

  it.only('Login By Custom Commands', () => {
    cy.loginApp()
  });

});
