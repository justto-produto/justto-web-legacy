describe('Termos', function() {
  beforeEach(function() {
    cy.access('/')
  })

  it('Termos Gerais de contratação', function() {
    // Verifica se link para Termos aparece
    cy.get('[data-testid=contract-terms]')
      .contains('Termos Gerais de Contratação')
      .should('have.attr', 'href', 'https://justto.com.br/termos-de-contratacao/')

    // Verifica se link está disponivel
    cy.request('https://justto.com.br/termos-de-contratacao/')
  })

  it('Termos de Uso', function() {
    // Verifica se link para Termos aparece
    cy.get('[data-testid=use-terms]')
      .contains('Termos de Uso')
      .should('have.attr', 'href', 'https://justto.com.br/termos-de-uso/')

    // Verifica se link está disponivel
    cy.request('https://justto.com.br/termos-de-uso/')
  })
})
