describe('Upload file', () => {

    it('Demo test', () => {

      cy.visit('https://www.aconvert.com/pdf/json-to-pdf/')
      cy.get('#file').attachFile('example.json')
      cy.get('#submitbtn').click()
      
    })
  })