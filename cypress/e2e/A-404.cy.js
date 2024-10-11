const pages = ["https://adc.bmj.com/", "https://adc.bmj.com/pages/about"];
describe("FIND & FIX 404 LINKS", () => {
  it("Navigate through the links on ${pages}", () => {
    pages.forEach((page) => {
      cy.visit(page);
      var links = [];
      cy.get("a:not([href*='https://soundcloud.com/bmjpodcasts/sets/adc-podcast'])")
        .each(($ele) => {
          links.push($ele.attr("href"));
        })
        .then(() => {
          links.forEach((link) => {
            cy.request({ url:link,failOnStatusCode: false }).then((response) => {
            //  expect(response.status).to.eq(200);
            if (response.status !== 200) {
              cy.log(`The link ${link} is broken`);
              cy.writeFile("cypress/downloads/404Links.csv", link);
            }
            });
          });
        });
    });
  });
});
