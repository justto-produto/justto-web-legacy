describe('Justto.App - Register', function () {
  const emailtoken = Cypress.env('emailtoken')
  beforeEach('Acesso Registro', function () {
    // Acessa a página inicial do Justto.App
    cy.visit('/')

    // Acessa a página de registro
    cy.get('[data-testid=register]').click()

    // Sistema deve redirecionar para a página de Registro
    cy.url().should('include', '/#/register')
  })

  const randomEmail = new Date().getTime() + '@teste2e.com'

  it('Registro: Sucesso', function () {
    // Preenche o campo 'Nome'
    cy.get('[data-testid=register-name]')
      .type('Conta Teste')
      .should('have.value', 'Conta Teste')

    // Preenche o campo 'Email'
    cy.get('[data-testid=register-email]')
      .type(randomEmail)
      // .type('teste.onboarding@justto.com.br')
      // .should('have.value', 'teste.onboarding@justto.com.br')

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

  it('Registro: Email Inválido', function () {
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

  it('Registro: Email já Existente', function () {
    // Preenche o campo 'Nome'
    cy.get('[data-testid=register-name]')
      .type('Bruno Gatão')
      .should('have.value', 'Bruno Gatão')

    // Preenche   campo 'Email' com email não existente
    cy.get('[data-testid=register-email]')
      .type('graziele@justto.com.br')
      .should('have.value', 'graziele@justto.com.br')

    // Preenche o campo 'Senha'
    cy.get('[data-testid=register-password')
      .type('password')
      .should('have.value', 'password')

    // Clica no botão "Entrar"
    cy.get('[data-testid=submit]').click()

    // Valida se login falhou
    cy.url().should('include', '/#/register')

    // Verifica de menssagem de erro foi exibida
    cy.contains('Já existe um usuário cadastrado com este e-mail.')
      .should('be.visible')
  })
})
