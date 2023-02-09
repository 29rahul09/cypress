describe("unstop signup", () => {
  const gender = "Male";
  const country = "India";
  it("sign-up", () => {
    cy.visit("https://unstop.com/");
    cy.get(".login_btn").click();
    cy.get(".other_link > span").click();
    cy.get("#first_name").type("rahul");
    cy.get("#last_name").type("singh");
    cy.get(".desk").click();
    cy.get("#your_username").type("rahul2909871");
    cy.get(".mat-select-placeholder").click();
    cy.get("#mat-select-0-panel > mat-option >  .mat-option-text ").each(
      ($ele, index) => {
        if ($ele.text().includes(gender)) {
          // cy.log(index) //logs the index
          cy.wrap($ele).click();
        }
      }
    );
    //   .eq(0)
    //   .then(($el) => {
    //     const gender = $el.text();
    //     cy.log(gender);
    //     expect(gender).to.equal(" Male ");
    //     cy.wrap($el).click();
    //   });
    //   cy.get('#mat-option-0 > .mat-option-text').click()

    cy.get("#email_address").type("sirohirahul29@gmail.com");
    cy.get(".ngx-mat-tel-input-container > button").click();
    cy.get(".country-search").type(country);
    cy.get(".mat-menu-content > button").last().click();
    //   .each(($ele, index) => {
    //     if ($ele.text().includes(country)) {
    //       // cy.log(index) //logs the index
    //       cy.wrap($ele).click();
    //     }
    //   });
    cy.get("#mat-input-0").type("8077326271");
    cy.get("#organisation-organisation_select_input").type("Doubtnut");
    cy.get("#organisation-organisation_select_list > li ").first().click();
    cy.get("#choose_password").type("Rahul@12345");
    cy.get("#confirm_password").type("Rahul@12345");
    cy.get(".checkbox_type > label").click();
    cy.get(".btn").click();
  });
});
