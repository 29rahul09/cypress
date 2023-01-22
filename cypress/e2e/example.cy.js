describe('empty spec', () => {
  it('passes', () => {
    cy.visit('https://www.google.com')
    cy.get('.gLFyf').type('doubtnut.com{enter}')
    cy.wait(2000)
    cy.contains('Videos').click()
    cy.wait(1000)
    cy.contains('Question Bank').click()

  })
})