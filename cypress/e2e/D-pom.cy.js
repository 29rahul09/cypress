import { loginPage } from "./POM/Page_login";
const pageLogin = new loginPage();

before(() => {
  cy.log("Test are ready to perform");
});

describe("POM Demo", () => {
  beforeEach(() => {
    cy.visit("https://opensource-demo.orangehrmlive.com/");
  });

  it("Login test 1 ", () => {
    pageLogin.username("Admin");
    pageLogin.password("admin123");
    pageLogin.login();
    cy.get(".oxd-input").type("orange");
  });

  it("Login test 2 ", () => {
    cy.get(
      ":nth-child(2) > .oxd-input-group > :nth-child(2) > .oxd-input"
    ).type("Admin");
    cy.get(
      ":nth-child(3) > .oxd-input-group > :nth-child(2) > .oxd-input"
    ).type("admin123");
    cy.get(".oxd-button").click();
    cy.get(".oxd-main-menu-search > .oxd-icon-button").click();
  });
});
