describe('Upload file', () => {

    it('Demo test', () => {

      cy.visit('https://www.aconvert.com/pdf/json-to-pdf/')
      cy.get('#file').selectFile('cypress/fixtures/example.json')
      cy.get('#submitbtn').click()
      
    })
  })