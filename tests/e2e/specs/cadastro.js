/// <reference types="Cypress" />

context('Actions', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/login')
  })

  it('Cadastrar usuário - Sucesso', () => {
  // https://on.cypress.io/type
    cy.contains('Cadastre').click()
  
    // Fills 'Nome' field
      cy.get('[name=register-name]')
        .type('name')
    // Fills 'Email' field
      cy.get('[name=register-email]')
        .type('yosuluxx@shayzam.net')
    // Fills 'Senha' field
      cy.get('[name=register-password')
        .type('password')
    // Press 'Cadastrar' buttom
      cy.contains('Cadastrar').click()  
  })

  it('Cadastrar usuário - Falha', () => {
  // https://on.cypress.io/type
    cy.contains('Cadastre').click()
  
    // Fills 'Nome' field
      cy.get('[name=register-name]')
        .type('name')
    // Fills 'Email' field
      cy.get('[name=register-email]')
        .type('yosulux@shayzam.net')
    // Fills 'Senha' field
      cy.get('[name=register-password')
        .type('password')
    // Press 'Cadastrar' buttom
      cy.contains('Cadastrar').click()  
  })
})
