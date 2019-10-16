const email = Cypress.env('main-email')

describe('Esqueci a Senha', function () {
  beforeEach('Acesso', function () {
    cy.access('/')

    // Acessa a página de Equeci minha Senha
    cy.get('[data-testid=forgot-password]')
      .click()

    // Sistema deve redirecionar para a página de Esqueci minha Senha
    cy.url().should('include', '/#/forgot-password')
  })

  it('Email Enviado', function () {
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

  it('Email Inválido', function () {
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
