describe('Justto.App - Login', function () {
  beforeEach('Login', function () {
    // Acessa a página inicial do Justto.App
    cy.visit(Cypress.env('BASE_URL'))

    // Sistema deve redirecionar para a página de Login
    cy.url().should('include', '/#/login')
  })

  const login = Cypress.env('email1')
  const password = Cypress.env('password1')

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

  it('Login: Email ou senha incorretos', function() {
    // Preenche campo 'Email' com email não existente
    cy.get('[data-testid=login-email]')
      .type('graziele@justto.com.br')
      .should('have.value', 'graziele@justto.com.br')

    // Preenche o campo 'Senha'
    cy.get('[data-testid=login-password]')
      .type('kjdisjdi')
      .should('have.value', 'kjdisjdi')

    // Clica no botão "Entrar"
    cy.get('[data-testid=submit]')
      .click()

    // Valida se login falhou
    cy.url().should('include', '/#/login')

    // Verifica de menssagem de erro foi exibida
    cy.contains('E-mail não cadastrado ou senha incorreta.')
      .should('be.visible')
  })
})
