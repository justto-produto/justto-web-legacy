describe('Justto.App - Disputa: Ações', function () {
  beforeEach('Login', function () {

    // Acessa a página inicial do Justto.App
    cy.visit('http://homol.justto.com.br')
    // cy.visit('localhost:8080')

    // Redireciona para 'Login'
    cy.url().should('include', '/#/login')

    // Preenche o campo 'Email'
    cy.get('[data-testid=login-email]')
      .type('dubu@voemail.com')
      .should('have.value', 'dubu@voemail.com')

    // Preenche o campo 'Senha'
    cy.get('[data-testid=login-password]')
      .type('password')
      .should('have.value', 'password')

    // Clica no botão "Entrar"
    cy.get('[data-testid=submit]')
      .click()

    // Verifica se tela acessada é a de "Gerenciamento"
    cy.url().should('include', '/#/management')

  })

  it('Ação: Ganhar', function () {

    // Seleciona a aba "Todos"
    cy.contains('Todos').should('be.visible')
      .click()

    // Seleciona e clica na Disputa
    cy.contains('#12738').should('be.visible')
      .click()

    // Verifica se tela acessada é a da "Disputa"
    cy.url().should('include', '/#/management/dispute/12738')

    // Verifica se a ação "Ganhar" é visível e clica
    cy.get('[data-testid=win]').should('be.visible')
      .click()
    cy.get('[data-testid=cancel]').should('be.visible')
      .click()

  })

  it('Ação: Perder', function () {

    // Seleciona a aba "Todos"
    cy.contains('Todos').should('be.visible')
      .click()

    // Seleciona e clica na Disputa
    cy.contains('#12738').should('be.visible')
      .click()

    // Verifica se tela acessada é a da "Disputa"
    cy.url().should('include', '/#/management/dispute/12738')

    // Verifica se a ação "Perder" é visível e clica
    cy.get('[data-testid=lose]').should('be.visible')
      .click()
    cy.get('[data-testid=cancel]').should('be.visible')
      .click()

  })

  it('Ação: Retomar', function () {

    // Seleciona a aba "Todos"
    cy.contains('Todos').should('be.visible')
      .click()

    // Seleciona e clica na Disputa
    cy.contains('#12738').should('be.visible')
      .click()

    // Verifica se tela acessada é a da "Disputa"
    cy.url().should('include', '/#/management/dispute/12738')

    // Verifica se a ação "Retomar" é visível e clica
    cy.get('[data-testid=start-again]').should('be.visible')
      .click()
    cy.get('[data-testid=cancel]').should('be.visible')
      .click()

  })

  it('Ação: Pausar', function () {

    // Seleciona a aba "Todos"
    cy.contains('Todos').should('be.visible')
      .click()

    // Seleciona e clica na Disputa
    cy.contains('#12738').should('be.visible')
      .click()

    // Verifica se tela acessada é a da "Disputa"
    cy.url().should('include', '/#/management/dispute/12738')

    // Verifica se a ação "Pausar" é visível e clica
    cy.get('[data-testid=pause]').should('be.visible')
      .click()
    cy.get('[data-testid=cancel]').should('be.visible')
      .click()

  })

  it('Ação: Alterar Negociador', function () {

    // Seleciona a aba "Todos"
    cy.contains('Todos').should('be.visible')
      .click()

    // Seleciona e clica na Disputa
    cy.contains('#12738').should('be.visible')
      .click()

    // Verifica se tela acessada é a da "Disputa"
    cy.url().should('include', '/#/management/dispute/12738')

    // Verifica se a ação "Alterar Negociador" é visível e clica
    cy.get('[data-testid=delegate]').should('be.visible')
      .click()
    cy.get('[data-testid=cancel]').should('be.visible')
      .click()

  })
})
