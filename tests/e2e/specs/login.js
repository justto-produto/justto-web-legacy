/// <reference types="Cypress" />

context('Actions', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/login')
  })

  // Acessando página de Login do justto-web

  it('Acessando Página de Login ', () => {
    // https://on.cypress.io/type
    cy.get('[name=login-email]')
      .type('fakeaaaaaaa@email.com')

    cy.get('[name=login-password]')
      .type('password')
    // Press 'Enter' buttom
    //cy.contains('Entrar').click()
  })

  // it('Cadastrar usuário', () => {
  // // https://on.cypress.io/type
  //   cy.contains('Cadastre').click()
  //
  //   // Fills 'Nome' field
  //     cy.get('[tracker=loginForm] [class=el-input__inner]').then($els => $els.get(2))
  //       .type('nome')
  //   // Fills 'Email' field
  //     cy.get('[class=el-input__inner]').then($els => $els.get(1))
  //       .type('e@mail.com')
  //   // Fills 'Senha' field
  //     cy.get('[class=el-input__inner]').then($els => $els.get(2))
  //       .type('password')
  //
  // cy.contains('Cadastrar').click()
  //
  // })
})
