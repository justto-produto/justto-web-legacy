const login_unconected = Cypress.env('not-editable-cases-email')
const login_unsynced = Cypress.env('not-configured-account-email')
const password = Cypress.env('default-password  ')

describe('Justto.App - Disputa: Menssagens', function () {

  it('Envio de Whatsapp: Desconectado', function () {
    // Acessa a página inicial do Justto.App
    cy.visit('/')

    // Redireciona para 'Login'
    cy.url().should('include', '/#/login')

    // Preenche o campo 'Email'
    cy.get('[data-testid=login-email]')
    .type(login_unconected)
    .should('have.value', login_unconected)

    // Preenche o campo 'Senha'
    cy.get('[data-testid=login-password]')
    .type(password)
    .should('have.value', password)

    // Clica no botão "Entrar"
    cy.get('[data-testid=submit]')
    .click()

    // Verifica se tela acessada é a de "Gerenciamento"
    cy.url().should('include', '/#/management')


    // Entra na primeira disputa da lista
    cy.get('[data-testid=dispute-index] tbody > tr.el-table__row').first()
      .click()

    // Seleciona primeira parte do caso
    cy.get('[data-testid=party]').first()
      .click()

    // Seleciona Whatsapp
    cy.get('[data-testid=select-whatsapp]')
      .click()

    // Input deve estar desabilitado
    cy.get('[data-testid=submit-whats-disable]')
      .should('be.disabled')
  })

  it('Envio de Whatsapp: Não Sincronizado', function () {
    // Acessa a página inicial do Justto.App
    cy.visit('/')

    // Redireciona para 'Login'
    cy.url().should('include', '/#/login')

    // Preenche o campo 'Email'
    cy.get('[data-testid=login-email]')
    .type(login_unsynced)
    .should('have.value', login_unsynced)

    // Preenche o campo 'Senha'
    cy.get('[data-testid=login-password]')
    .type(password)
    .should('have.value', password)

    // Clica no botão "Entrar"
    cy.get('[data-testid=submit]')
    .click()

    // Verifica se tela acessada é a de "Gerenciamento"
    cy.url().should('include', '/#/management')



    // Entra na primeira disputa da lista
    cy.get('[data-testid=dispute-index] tbody > tr.el-table__row').first()
      .click()

    // Seleciona primeira parte do caso
    cy.get('[data-testid=party]').first()
      .click()

    // Seleciona Whatsapp
    cy.get('[data-testid=select-whatsapp]')
      .click()
  })
})
