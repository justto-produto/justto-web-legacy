const email = Cypress.env('token-email')

describe('Justto.app - Esqueci a Senha', function () {
  beforeEach('Acesso', function () {
    // Acessa a página inicial do Justto.App
    cy.visit('/')

    // Sistema deve redirecionar para a página de Login
    cy.url().should('include', '/#/login')

    // Acessa a página de Equeci minha Senha
    cy.get('[data-testid=forgot-password]')
      .click()

    // Sistema deve redirecionar para a página de Esqueci minha Senha
    cy.url().should('include', '/#/forgot-password')
  })

  it('Esqueci minha Senha: Sucesso', function () {
    // Digita um email válido existente
    cy.get('[data-testid=forgot-password-email]')
      .type(email)
      .should('have.value', email)

    // Clica no botão Recuperar
    cy.get('[data-testid=submit]')
      .click()

    // Mensagem de 'Email Enviado' deve aparecer
    cy.contains('Requisição de recuperação enviada com sucesso! Acesse seu email para prosseguir.')
      .should('be.visible')
  })

  it('Esqueci minha senha: Email Inválido', function () {
    // Digita um email inválido
    cy.get('[data-testid=forgot-password-email]')
      .type('email inválido')
      .should('have.value', 'email inválido')

    // Clica no botão Recuperar
    cy.get('[data-testid=submit]')
      .click()

    // Mensagme de email inválido deve desaparecer
    cy.contains('Insira um e-mail válido')
      .should('be.visible')
  })
})
