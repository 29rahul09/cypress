describe("global health journals checkup", () => {
  it("Check Homepage Links Response", () => {
    cy.visit("https://gh.bmj.com/");
    // cy.get("#onetrust-accept-btn-handler").click();
    var links = [];
    const wFile = "cypress/downloads/gh.json";
    cy.get("a").each(($ele) => {
      links.push($ele.attr("href"));
      cy.writeFile(wFile, links);
    });
    const rFile = "cypress/downloads/gh.json";
    cy.readFile(rFile)
      .then((data) => {
        //process data
        cy.log(data.length);
        for (let i = 0; i < data.length; i++) {
          const text = data[i];
          if (text.startsWith("//")) {
            cy.request({
              url: `https:${text}`,
              failOnStatusCode: false,
            });
          } else if (text.startsWith("http:") || text.startsWith("https:")) {
            cy.request({
              url: `${text}`,
              failOnStatusCode: false,
            });
          } else {
            cy.request({
              url: `https://gh.bmj.com/${text}`,
              failOnStatusCode: false,
            });
          }
        }
      })
      .then((response) => {
        cy.log(response.status);
      });
  });

  it.only("Check Lastest Content", () => {
    cy.visit("https://gh.bmj.com/");
    cy.get(".css-19k0qsp> a").first().click();
    //cy.get('.panel-row-wrapper').first().should('have.text','Current Issue')
    cy.get("#page-title").should("have.text", "Current Issue");
    cy.get(".right-wrapper")
      .find("a")
      .each((page) => {
        const href = page.prop("href");
        const title = page.text();
        cy.log(title);
        cy.visit(href);
        cy.get(".highwire-cite-title").should("have.text", title);
        // cy.request(href);
      });

    //   cy.get('.highwire-article-citation > .highwire-cite > .highwire-cite-linked-title > .highwire-cite-title')
    //   .each((page) => {
    //     const title = page.text();
    //    // const title = href.text();
    //     cy.log(title)
    //    // cy.request(href);
    //   });

    //   cy.get('.highwire-article-citation > .highwire-cite > .highwire-cite-linked-title > .highwire-cite-title')
    //   .first().should('have.text','Use of indirect evidence from HIV self-testing to inform the WHO hepatitis C self-testing recommendation')
  });


  
});
