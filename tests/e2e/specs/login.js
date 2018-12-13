/// <reference types="Cypress" />

context('Actions', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/login')
  })

  it('Cadastrar usuário', () => {
  // https://on.cypress.io/type
    cy.contains('Cadastre').click()
  
    // Fills 'Nome' field
      cy.get('[name=register-name]')
        .type('nome')
    // Fills 'Email' field
      cy.get('[name=register-email]')
        .type('e@mail.com')
    // Fills 'Senha' field
      cy.get('[name=register-password')
        .type('password')
    // Press 'Cadastrar' buttom
      //cy.contains('Cadastrar').click()  
  })

  // Acessando página de Login do justto-web

  it('Acessando Página de Login ', () => {
    // https://on.cypress.io/type
    cy.get('[name=login-email]')
      .type('sesum@zdfpost.net')

    cy.get('[name=login-password]')
      .type('password')
    // Press 'Enter' buttom
    cy.contains('Entrar').click()

    // Welcome
    cy.wait(5)
    cy.get('.onboarding-welcome-step > button').click()
    cy.wait(5)
    // Team Name
    cy.get('[name=name]').type('Team Name')
    cy.wait(5)
    cy.get('.onboarding-step-content > .el-button el-button--primary').click()
    cy.wait(5)
    // Workspace Name
    
  })
  
})
