describe('Justto.App - Login', function () {
  beforeEach('Login', function () {
    // Acessa a página inicial do Justto.App
    // cy.visit('http://homol.justto.com.br')
    cy.visit('localhost:8080')

    // Sistema deve redirecionar para a página de Login
    cy.url().should('include', '/#/login')
  })

  it('Login: Sucesso', function () {
    // Preenche o campo 'Email'
    cy.get('[data-testid=login-email]')
      .type('lucas@justto.com.br')
      .should('have.value', 'lucas@justto.com.br')

    // Preenche o campo 'Senha'
    cy.get('[data-testid=login-password]')
      .type('123456')
      .should('have.value', '123456')

    // Clica no botão "Entrar"
    cy.get('[data-testid=submit]')
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
    cy.get('[data-testid=submit]')
      .click()

    // Valida se login falhou
    cy.contains('Insira um e-mail válido')
      .should('be.visible')
  })

  it('Login: Email Inexistente', function () {
    // Preenche campo 'Email' com email não existente
    cy.get('[data-testid=login-email]')
      .type('email@inexistente.com')
      .should('have.value', 'email@inexistente.com')

    // Preenche o campo 'Senha'
    cy.get('[data-testid=login-password]')
      .type('password')
      .should('have.value', 'password')

    // Clica no botão "Entrar"
    cy.get('[data-testid=submit]')
      .click()

    // Valida se login falhou
    cy.url().should('include', '/#/login')

    // Verifica de menssagem de erro foi exibida
    cy.get('[data-testid=login-failure]')
      .should('be.visible')
  })
})
