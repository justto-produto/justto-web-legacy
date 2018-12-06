/// <reference types="Cypress" />

context('Actions', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/login')
  })

  // Acessando página de Login do justto-web

  it('Acessando Página de Login ', () => {
    // https://on.cypress.io/type
    cy.get('[class=el-input__inner]').then($els => $els.get(0))
      .type('fake@email.com')

    cy.get('[class=el-input__inner]').then($els => $els.get(1))
      .type('password')
    // Press 'Enter' buttom
    // cy.contains('Entrar').click()
  })

  it('Cadastrar usuário', () => {
  // https://on.cypress.io/type
    cy.contains('Cadastre').click()

    // Fills 'Nome' field
<<<<<<< Updated upstream
    cy.get('[class=el-input__inner]').then($els => $els.get(2))
      .type('nome')
=======
      cy.get('[class=el-input__inner]').then($els => $els.get(0))
        .type('nome')
>>>>>>> Stashed changes
    // Fills 'Email' field
    cy.get('[class=el-input__inner]').then($els => $els.get(1))
      .type('e@mail.com')
    // Fills 'Senha' field
    cy.get('[class=el-input__inner]').then($els => $els.get(2))
      .type('password')

    cy.contains('Cadastrar').click()
  })
})
