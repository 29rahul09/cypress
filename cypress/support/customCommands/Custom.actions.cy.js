import { link } from "fs";

Cypress.Commands.add("loginApp", () => {
  cy.visit("https://opensource-demo.orangehrmlive.com/");
  cy.get("input[placeholder='Username']").type("Admin");
  cy.get("input[placeholder='Username']").should("have.value", "Admin");
  cy.get("input[placeholder='Password']").type("admin123");
  cy.get("button[type='submit']").click();
});

Cypress.Commands.add("blogPage", () => {
  cy.get('[data-testid="74"]')
    .should("have.text", "Blog")
    .then(($el) => {
      cy.visit($el.prop("href"));
    });
});

Cypress.Commands.add("getHref", () => {
  cy.get("a").each((page) => {
    const href = page.prop("href");
    const title = page.text();
    cy.log(title);
    cy.request(href).then((response) => {
      expect(response.status).to.eq(200);
    });
  });
});

Cypress.Commands.add("pageHref", () => {
  cy.get(".right-wrapper > .panel-panel > .inside")
    .find("a")
    .each((el) => {
      const href = el.prop("href");
      cy.request(href).then((response) => {
        expect(response.status).to.eq(200);
      });
    });
});

Cypress.Commands.add("findBoxedText", (page) => {
  var article = [];
  const boxedFile = "cypress/downloads/boxedText.json";
  cy.get("body").then(($body) => {
    if ($body.find(".boxed-text").length > 0) {
      //element exists do something
      cy.log("BOXED TEXT EXISTED");
      article.push(page);
    }
  });
  cy.writeFile(boxedFile, article);
});
