describe('Justto.app - Esqueci a Senha', function () {
  const email = Cypress.env('emailonboarding')

  beforeEach('Acesso', function () {
    // Acessa a página inicial do Justto.App
    cy.visit('https://kubernetes.justto.com.br')
    // cy.visit('localhost:8080')

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
    cy.get('[data-testid=forgot-password-success]')
      .contains('Requisição de recuperação enviada com sucesso! Acesse seu email para prosseguir.')
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

  it('Esqueci minha senha: Email Inexistente', function () {
    // Digita um email inválido
    cy.get('[data-testid=forgot-password-email]')
      .type('email@inexistente.com')
      .should('have.value', 'email@inexistente.com')

    // Clica no botão Recuperar
    cy.get('[data-testid=submit]')
      .click()

    // Mensagme de email inválido deve desaparecer
    cy.contains('Houve uma falha de conexão com o servidor. Tente novamente ou entre em contato com o administrador do sistema.')
      .should('be.visible')
  })
})
