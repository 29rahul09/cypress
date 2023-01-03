describe('Read and Write Methods', () => {

    it('Read file using fixture()', () => {
        cy.fixture('example.json').then((data) => {
            cy.log(data.name)
        })
    });

    it('Read file using readFile() ', () => {
        cy.readFile('./cypress/fixtures/example.json').then((data) => {
            cy.log(data.email)
        })

    });

    it('Write file using writeFile()', () => {
        cy.writeFile('./cypress/sample.txt', 'My name is Rahul\n')
        cy.writeFile('./cypress/sample.txt', 'I live in Bareilly\n')
        cy.writeFile('./cypress/sample.txt', 'I m learning cypress', { flag: 'a+' })
    });

})