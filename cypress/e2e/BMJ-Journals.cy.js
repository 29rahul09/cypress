describe("Journals spec", () => {
  it.only("check content", () => {
    cy.visit("https://jnnp.bmj.com/");
    cy.get("#onetrust-accept-btn-handler").click();
    var links = [];
    cy.get("a")
      .each(($ele) => {
        links.push($ele.attr("href"));
      })
      .then(() => {
        links.forEach((link) => {
          cy.visit({
            url: `${link}`,
            failOnStatusCode: false,
          });
          //Add some test here
         // cy.get(".widget > h2 ")
         cy.get('#box-3 > :nth-child(1) > .widget > :nth-child(1) > :nth-child(1) > h2')
         .should('be.visible').and('have.text', 'Latest Articles')
        });
      });
  });

  it("check content", () => {
    cy.visit("https://jnnp.bmj.com/");
    cy.get("#onetrust-accept-btn-handler").click();
    var links = [];
    const filename = "cypress/downloads/hrefs.json";
    cy.get("a").each(($ele) => {
      links.push($ele.attr("href"));
      cy.writeFile(filename, links);
    });
  });

  it("check content", () => {
    cy.visit("https://jnnp.bmj.com/");
    cy.get("#onetrust-accept-btn-handler").click();
    var links = [];
    const filename = "cypress/downloads/hrefs.csv";
    cy.get("a")
      .each(($ele) => {
        links.push($ele.attr("href"));
      })
      .then(() => {
        links.forEach((link) => {
          cy.request({
            url: `${link}`,
            failOnStatusCode: false,
          }).then((response) => {
            cy.log(response.status);
            // expect(response.status).to.eq(200);
          });
        });
      });
  });

  it("check content", () => {
    const filename = "cypress/downloads/hrefs.csv";
    cy.readFile(filename).then((data) => {
      cy.task("csvToJson", data).then((data) => {
        data.forEach(($el) => {
          cy.get($el);
        });
      });
      //  .then((data) => {
      //         //process data
      //         cy.get(data)
      //     })
    });
  });

  it("check content", () => {
    const filename = "cypress/downloads/hrefs.json";
    cy.readFile(filename).then((data) => {
      //process data
      cy.log(data.length);
      for (let i = 0; i < data.length; i++) {
        const text = data[i];
        cy.log(text);
        if (text.startsWith("//")) {
          cy.visit({
            url: `https:${text}`,
            failOnStatusCode: false,
          });
        } else if (text.startsWith("http:") || text.startsWith("https:")) {
          cy.visit({
            url: `${text}`,
            failOnStatusCode: false,
          });
        } else {
          cy.visit({
            url: `https://jnnp.bmj.com/${text}`,
            failOnStatusCode: false,
          });
        }
      }
    });
  });

  it("check content", () => {
    const filename = "cypress/downloads/hrefs.json";
    cy.readFile(filename)
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
          } else if (text.startsWith("http:") || text.startsWith("https:") ) {
            cy.request({
              url: `${text}`,
              failOnStatusCode: false,
            });
          } else {
            cy.request({
              url: `https://jnnp.bmj.com/${text}`,
              failOnStatusCode: false,
            });
          }
        }
      })
      .then((response) => {
        cy.log(response.status);
      });
  });

  it('check response',()=>{
    // cy.visit('http://dx.doi.org/10.1136/jnnp-2022-329136')
    cy.request({
        url: `http://dx.doi.org/10.1136/jnnp-2022-329136`,
        failOnStatusCode: false,
      }).then((response) => {
        cy.log(response.status);
      });
  })
});
