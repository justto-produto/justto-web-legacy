const loginEmptyHistorical = Cypress.env('empty-account-email')
const loginHasHistorical = Cypress.env('not-editable-cases-email')
const password = Cypress.env('default-password')
var loop = 0

describe('Justto.App - Planilha Modelo', function () {
  // Verifica em Qual repetição está
  beforeEach(function () {
    loop++
    switch (loop) {
      case 1:
        var login = loginEmptyHistorical
        break;
      case 2:
        var login = loginHasHistorical
        break;
      default:
    }

    // Acessa a página inicial do Justto.App
    // cy.visit('http://homol.justto.com.br')
    cy.visit('/')

    // Sistema deve redirecionar para a página de Login
    cy.url().should('include', '/#/login')

    // Preenche o campo 'Email'
    cy.get('[data-testid="login-email"]')
      .type(login)
      .should('have.value', login)

    // Preenche o campo 'Senha'
    cy.get('[data-testid="login-password"]')
      .type(password)
      .should('have.value', password)

    // Clica no botão "Entrar"
    cy.get('[data-testid="submit"]')
      .click()

    // Valida se acesso foi feito - Primeira tela de login
    cy.url().should('include', '/#/management')
  })

  it('Historico de Importações: Vazio', function () {
    // Acessa a tela de gerenciamento
    cy.get('[data-testid=menu-import]')
      .click()

    // Sistema deve redirecionar para a página de Importação
    cy.url().should('include', '/#/import')

    // Verifica se Histórico de Importações esta vazio
    cy.get('[data-testid=empty-history]')
      .contains('Aqui você encontra o registro de importações no sistema. Por enquanto, você não possui importações.')
      .should('be.visible')
  })

  it('Histórico de Importações: Com casos', function () {
    // Acessa a tela de importação
    cy.get('[data-testid=menu-import]')
      .click()

    // Sistema deve redirecionar para a página de Importação
    cy.url().should('include', '/#/import')

    // Verifica se há Casos no Histórico de Importação
    cy.get('[data-testid=spreadsheet-card]')
      .should('be.visible')
  })
})
