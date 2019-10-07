// const login = Cypress.env('empty-account-email')
// const password = Cypress.env('default-password')
const login = 'guilherme@justto.com.br'
const password = '@bundanc1A'

describe('Justto.App - Login', function () {
  beforeEach('Login', function () {
    // Acessa a página inicial do Justto.App
    cy.visit('/')

    // Sistema deve redirecionar para a página de Login
    cy.url().should('include', '/#/login')
  })

  it('Login: Sucesso', function () {
    // Preenche o campo 'Email'
    cy.get('[data-testid=login-email]')
      .type(login)
      .should('have.value', login)

    // Preenche o campo 'Senha'
    cy.get('[data-testid=login-password]')
      .type(password)
      .should('have.value', password)

    // Clica no botão "Entrar"
    cy.get('[data-testid=submit-login]')
      .click()

    // Verifica se entrou na seleção de workspace
    cy.contains('Selecione uma de suas equipes de trabalho para entrar')

    // Seleciona um workspace
    cy.get('[data-testid=select-werkspace]')
      .click()
      .trigger('keydown', { keyCode: 40, Which: 40 }) // Pressiona seta para baixo
      .trigger('keydown', { keyCode: 13, Which: 13 }) // Pressiona Enter


    // Clica no botão "Selecionar e Entrar"
    cy.get('[data-testid=submit-workspace]')
      .click()

    // Valida se acesso foi feito
    cy.url().should('include', '/#/management')
  })

  it('Login: Email Inválido', function () {
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

  it('Login: Email ou senha incorretos', function () {
    // Preenche campo 'Email' com email não existente
    cy.get('[data-testid=login-email]')
      .type(login)
      .should('have.value', login)

    // Preenche o campo 'Senha'
    cy.get('[data-testid=login-password]')
      .type('123456')
      .should('have.value', '123456')

    // Clica no botão "Entrar"
    cy.get('[data-testid=submit-login]')
      .click()

    // Valida se login falhou
    cy.url().should('include', '/#/login')

    // Verifica de menssagem de erro foi exibida
    cy.contains('E-mail não cadastrado ou senha incorreta.')
      .should('be.visible')
  })
})
