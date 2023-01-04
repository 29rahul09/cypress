
describe('Locators Test Suite', () => {

    it('CSS locators Test case', () => {

        cy.visit('https://www.ajio.com/')
        cy.get('[name="searchVal"]').type('T-shirts')
        cy.get('.rilrtl-button').click()

    });

    it('Xpath locators Test case', () => {
        cy.visit('https://www.ajio.com/')
        cy.xpath('//input[@name="searchVal"]').type('t-shirts')
        cy.xpath('//button[@class="rilrtl-button"]').click()

    });

    // it(' Cahin Xpath locators Test case', () => {
    //     cy.xpath('//div[@class="todo-list"]').xpath('./li').should('have.length', 3);
    // });


})