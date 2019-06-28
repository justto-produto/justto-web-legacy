/// <reference types="Cypress" />

context('Actions', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/login')
  })

  // Acessando página de Login do justto-web
  it('Primeiro Acesso - Onboarding', () => {
    // https://on.cypress.io/type
    cy.get('[name=login-email]')
      .type('jodupeda@nando1.com')
    cy.get('[name=login-password]')
      .type('password')
    // Press 'Enter' buttom
    cy.contains('Entrar').click()

    // Welcome - Onboarding
    cy.contains('Vamos começar').click()
    // Team Name
    cy.get('[name=name]').type('Nome Equipe')
    cy.contains('Próximo').then($els => $els.get(0))
      .click()
    // Workspace Name
    cy.get('[name=subdomain]').type('subdomain')
    cy.get('.onboarding-step-content.onboarding-subdomain-step > .el-button.el-button--primary')
      .click()
    // OAB
    cy.contains('Pular').then($els => $els.get(1))
      .click()
    // Adicionar Pessoas
    cy.get('[name=teamMember]').type('justice@forall.com')
    cy.get('[class=el-icon-plus]').click()
    cy.contains('Convidar').then($els => $els.get(1))
      .click()
    // Sinc E-mail
    cy.contains('Pular').then($els => $els.get(3))
      .click()
    // Sinc WhatsApp
    cy.contains('Pular').then($els => $els.get(4))
      .click()
    // Concluir
    cy.contains('Inserir primeiras disputas').click()
  })
})
