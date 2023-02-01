describe("Assertions Demo", () => {
  it("Implicit Assertions Demo", () => {
    cy.visit("https://www.doubtnut.com/")
    cy.get(".HomeCarouselStyles__topHeader-bcUNXV")
      .find("a")
      .eq(1)
      .should("have.attr", "href")
      .should("not.be.empty")
      .and("contain", "/")
      .then((href) => {
        cy.visit(`https://www.doubtnut.com${href}`);
      });

    // cy.get('Selector for the anchor tag')      // sets <a> as the subject
    //     .should('have.attr', 'href')             // changes subject to href attribute
    //     .should('not.be.empty')                  // now test the href
    //     .and('contain', 'foo');                  // also test another criteria here
  });

  it("Implicit Assertions Demo", () => {
    cy.visit("https://opensource-demo.orangehrmlive.com/");
    cy.get("input[placeholder='Username']").type("Admin");
    cy.get("input[placeholder='Username']").should("have.value", "Admin");
    cy.get("input[placeholder='Password']").type("admin123");
    cy.get("button[type='submit']").click();
  });

  it("Implicit Assertions Demo", () => {
    cy.visit("https://opensource-demo.orangehrmlive.com/");

    cy.url()
      .should("include", "orangehrmlive.com")
      .should("contain", "orange")
      .and("not.contain", "green");

    cy.title()
      .should("include", "Orange")
      .and("eq", "OrangeHRM")
      .and("contain", "HRM");
  });

  it.only("Explicit Assertions Demo", () => {
    // cy.visit('https://www.doubtnut.com')
    // cy.get(".HomeCarouselStyles__topHeader-bcUNXV")
    // .find('.HomeCarouselStyles__Title-fEDioy')
    // .eq(0)
    // .invoke('text')
    // .then((text) => {
    //     expect(text.trim()).equal('NCERT')
    // })

    cy.visit("https://opensource-demo.orangehrmlive.com/");
    cy.get("input[placeholder='Username']").type("Admin");
    cy.log("enter username");
    cy.get("input[placeholder='Password']").type("admin123");
    cy.log("enter password");
    cy.get("button[type='submit']").click();
    cy.log("click login button");
    cy.log("display dashboard");
    let expName = "anu PV";
    cy.get(".oxd-userdropdown-name").then((e) => {
      cy.log("compare profile names");
      let actName = e.text();
      // BDD assertion
      // expect(actName).to.equal(expName);

      //TDD assertion
      assert.notEqual(actName, expName);
    });
  });
});
