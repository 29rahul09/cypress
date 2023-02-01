describe("empty spec", () => {
  it("downloads and read a simple PDF file", () => {
    // cy.visit("/");

    // cy.contains("simple.pdf").click();

    cy.task('readPdf', "cypress/downloads/simple.pdf")
    .should('contain', 'Sumit Mehta')
  });
});
