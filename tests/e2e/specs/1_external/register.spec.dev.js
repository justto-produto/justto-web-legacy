const email = Cypress.env('main-email')
const emailRegister = 'register@justto.com.br'

describe('Nova Conta', function() {
  beforeEach(function() {
    cy.access('/')

    // Acessa a página de registro
    cy.get('[data-testid=register]')
      .click()

    // Sistema deve redirecionar para a página de Registro
    cy.url().should('include', '/#/register')
  })

  it('Sucesso', function() {
    // Preenche o campo 'Nome'
    cy.get('[data-testid=register-name]')
      .type('Conta Teste')
      .should('have.value', 'Conta Teste')

    // Preenche o campo 'Email'
    cy.get('[data-testid=register-email]')
      .type(emailRegister)
      .should('have.value', emailRegister)

    // Preenche o campo 'Senha'
    cy.get('[data-testid=register-password]')
      .type('password')
      .should('have.value', 'password')

    // Clica no botão "Entrar"
    cy.get('[data-testid=submit]')
      .click()

    // Valida se registro funcionou
    cy.contains('Cadastro realizado com sucesso! Acesse seu email para prosseguir.')
      .should('be.visible')
  })

  it('Sucesso', function() {
    // Preenche o campo 'Nome'
    cy.get('[data-testid=register-name]')
      .type('Conta Teste')
      .should('have.value', 'Conta Teste')

    // Preenche o campo 'Email'
    cy.get('[data-testid=register-email]')
      .type(email)
      .should('have.value', email)

    // Preenche o campo 'Senha'
    cy.get('[data-testid=register-password]')
      .type('password')
      .should('have.value', 'password')

    // Clica no botão "Entrar"
    cy.get('[data-testid=submit]')
      .click()

    // Valida se registro funcionou
    cy.contains('Já existe um usuário cadastrado com este e-mail.')
      .should('be.visible')
  })

  it('Email Inválido', function() {
    // Preenche o campo 'Nome'
    cy.get('[data-testid=register-name]')
      .type('Conta Teste')
      .should('have.value', 'Conta Teste')

    // Preenche o campo 'Email'
    cy.get('[data-testid=register-email]')
      .type('email invalido')
      .should('have.value', 'email invalido')

    // Preenche o campo 'Senha'
    cy.get('[data-testid=register-password]')
      .type('password')
      .should('have.value', 'password')

    // Clica no botão 'Registrar'
    cy.get('[data-testid=submit]')
      .click()

    // Valida se registro funcionou
    cy.contains('Insira um e-mail válido')
      .should('be.visible')
  })
})
