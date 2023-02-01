describe("Automate Youshd-Instagram Linkage", () => {
  
  const countryName = "India";
  const phoneNo = "1111111113";
  const otp = "123456";
  const userName = "rahul290987";
  const passWord = "rahul@123";

  it("Start Automation", () => {
    cy.visit("https://app-staging.youshd.com/");

    cy.xpath("//button[normalize-space()='Login/ Sign up']").click();

    cy.xpath("//div[@title='United States: + 1']").click();

    cy.xpath("//input[@placeholder='search']").type(countryName);

    cy.get("li[class='country'] span[class='country-name']").then(($el) => {
      if ($el.text() == countryName) {
        cy.wrap($el).click();
      }
    });

    cy.xpath("//input[@placeholder='1 (702) 123-4567']").type(phoneNo);

    // cy.xpath("//input[@placeholder='1 (702) 123-4567']").type(phoneNo);

    cy.xpath("//button[normalize-space()='Continue']").click();

    cy.xpath("//input[@aria-label='Please enter verification code. Digit 1']")
      .focus()
      .type(otp);

    cy.xpath("//button[normalize-space()='Continue']")
      .should("exist")
      .click()
      .click()
      .click()
      .click();

    cy.xpath("//div[@class='insta-icon']").click();

    cy.get('.authorize-btn').click()

    cy.xpath("//input[contains(@name,'username')]").type(userName);

    cy.xpath("//input[@name='password']").type(passWord);

    cy.xpath("//div[contains(text(),'Log in')]").click();

    cy.xpath("//button[normalize-space()='Save information']").click();

    cy.xpath("//button[normalize-space()='Allow']").click();

    cy.xpath("//button[normalize-space()='Skip for now']").click();
  });
});
