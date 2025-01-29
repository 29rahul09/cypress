/// <reference types="cypress-downloadfile"/>
describe("Download file", () => {
  it("Demo test", () => {
    cy.downloadFile(
      "https://upload.wikimedia.org/wikipedia/en/a/a9/Example.jpg",
      "mydownloads",
      "example.jpg"
    );
  });
});
