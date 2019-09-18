describe('Justto.App - Termos', function () {
  it('Termos Gerais de contratação', function () {
    cy.visit('/')

    cy.get('[data-testid=contract-terms]')
      .contains('Termos Gerais de Contratação')
      .should('have.attr', 'href', 'https://justto.com.br/termos-de-contratacao/')

    cy.request('https://justto.com.br/termos-de-contratacao/')
  })
  it('Termos de Uso', function () {
    cy.visit('/')

    cy.get('[data-testid=use-terms]')
      .contains('Termos de Uso')
      .should('have.attr', 'href', 'https://justto.com.br/termos-de-uso/')

    cy.request('https://justto.com.br/termos-de-uso/')
  })
})
