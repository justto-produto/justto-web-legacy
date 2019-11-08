const email = Cypress.env('main-email')
const password = Cypress.env('main-password')
const workspace = Cypress.env('main-workspace')

describe('Login', function () {
  beforeEach(function () {
    cy.access('/')
  })

  it('Multiplos Workspaces', function () {
    cy.login(email, password, workspace)
  })

  it('Single Workspace', function () {
    // Preenche o campo 'Email'
    cy.get('[data-testid=login-email]')
      .type('guilherme@justto.com.br')
      .should('have.value', 'guilherme@justto.com.br')

    // Preenche o campo 'Senha'
    cy.get('[data-testid=login-password]')
      .type('123456')
      .should('have.value', '123456')

    // Clica no botão "Entrar"
    cy.get('[data-testid=submit-login]')
      .click()

    // Valida se acesso foi feito
    cy.url().should('include', '/#/management')
  })

  it('Email Inválido', function () {
    // Preenche campo 'Email' com email não existente
    cy.get('[data-testid=login-email]')
      .type('email@invalido')
      .should('have.value', 'email@invalido')

    // Preenche o campo 'Senha'
    cy.get('[data-testid=login-password]')
      .type('password')
      .should('have.value', 'password')

    // Clica no botão "Entrar"
    cy.get('[data-testid=submit-login]')
      .click()

    // Valida se login falhou
    cy.contains('Insira um e-mail válido')
      .should('be.visible')
  })

  it('Email ou senha incorretos', function () {
    // Preenche campo 'Email' com email não existente
    cy.get('[data-testid=login-email]')
      .type(email)
      .should('have.value', email)

    // Preenche o campo 'Senha'
    cy.get('[data-testid=login-password]')
      .type('123456')
      .should('have.value', '123456')

    // Clica no botão "Entrar"
    cy.get('[data-testid=submit-login]')
      .click()

    // Verifica de menssagem de erro foi exibida
    cy.contains('E-mail não cadastrado ou senha incorreta.')
      .should('be.visible')
  })
})
