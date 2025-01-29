describe("Testing-links-with-cypress", () => {
  //
  it("click all links with loop", () => {
    const pages = ["blog", "about", "contact"];

    cy.visit("/");

    pages.forEach((page) => {
      cy.contains(page).click();
      cy.location("pathname").should("eq", `/${page}`);
      cy.go("back");
    });
  });

  it("use requests to navigation bar links", () => {
    const pages = ["blog", "about", "contact"];

    cy.visit("/");

    pages.forEach((page) => {
      cy.contains(page).then((link) => {
        cy.request(link.prop("href"));
      });
    });
  });

  it("check all links on page", () => {
    cy.visit("/");
    cy.get("a").each((page) => {
      cy.request(page.prop("href"));
    });
  });

  it("check all links to sites", () => {
    cy.visit("/");
    cy.get("a:not([href*='mailto:'])").each((page) => {
      cy.request(page.prop("href"));
    });
  });

  it("get all hrefs and visit them", () => {
    cy.visit("https://www.rydeu.com/");
    var links = [];
    cy.get("a")
      .each(($ele) => {
        links.push($ele.attr("href"));
      })
      .then(() => {
        links.forEach((link) => {
          cy.visit({
            url: `https://www.rydeu.com${link}`,
            failOnStatusCode: false,
          });
          //Add some test here
          // cy.get('selector').should('be.visible').and('have.text', text)
        });
      });
  });
});
