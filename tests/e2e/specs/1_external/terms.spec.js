describe('Justto.App - Termos', function () {
  it('Termos Gerais de contratação', function () {
    cy.visit('/')

    cy.get('[data-testid=contract-terms]')
      .click()

    cy.visit('https://justto.com.br/termos-de-contratacao/')

    cy.url().should('include', '/termos-de-contratacao/')

    cy.contains('CONTRATO DE PRESTAÇÃO DE SERVIÇOS')
  })
  it('Termos de Uso', function () {
    cy.visit('/')

    cy.get('[data-testid=use-terms]')
      .click()

    cy.visit('https://justto.com.br/termos-de-uso/')

    cy.url().should('include', '/termos-de-uso/')

    cy.contains('Termos Gerais e Condições de Uso')
  })
})
