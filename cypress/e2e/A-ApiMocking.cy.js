describe("Intercept with Cypress", () => {
  it("Test Api with simple Intercept Stubbing", () => {
    cy.visit("https://jsonplaceholder.typicode.com/");
    cy.intercept({
      path: "/posts",
    }).as("posts");
    cy.get("tbody > :nth-child(1) > :nth-child(1) > a").click();

    cy.wait("@posts").then((data) => {
      cy.log(JSON.stringify(data));
      expect(data.response.body).to.have.length(100);
    });
  });

  it("Api Mocking with Test Intercept with STATIC RESPONSE ", () => {
    cy.visit("https://jsonplaceholder.typicode.com/");
    cy.intercept("GET", "/posts", {
      name: "Rahul",
      city: "Bareilly",
    }).as("posts");
    cy.get("tbody > :nth-child(1) > :nth-child(1) > a").click();

    cy.wait("@posts").then((data) => {
      cy.log(JSON.stringify(data));
      expect(data.response.body).to.have.property("name", "Rahul");
    });
  });

  it.only("Api Mocking with Test Intercept with DYNAMIC RESPONSE ", () => {
    cy.visit("https://jsonplaceholder.typicode.com/");
    cy.intercept("GET", "/posts", { fixture: "example.json" }).as("posts");
    cy.get("tbody > :nth-child(1) > :nth-child(1) > a").click();

    cy.wait("@posts").then((data) => {
      cy.log(JSON.stringify(data));
      console.log(data);
      expect(data.response.body).to.have.property("name", "Rahul");
    });
  });
});
