const login = Cypress.env('main-email')
const password = Cypress.env('main-password')
const workspace = Cypress.env('main-workspace')

describe('Visualização de Gerenciamento', function () {
  before('Cena', function () {
    // Requisição para Preparar ambiente
    cy.prepair_testes('PUT', 'prepare-management-test-e2e')
  })

  beforeEach(function () {
    // Acessa a página inicial do Justto.App
    cy.access('/')

    // Faz login com 'acordo@justto.app'
    cy.login(login, password, workspace)
  })

  it('Exibição de Casos - Com casos', function () {
    // Verifica numero dos badges
    cy.get('[data-testid=badge-tab0]')
      .contains('5')
    cy.get('[data-testid=badge-tab1]')
      .contains('10')
    cy.get('[data-testid=badge-tab2]')
      .contains('5')

    // Seleciona a aba "Sem resposta"
    cy.get('.el-tabs__nav > #tab-0')
      .contains('Sem resposta')
      .click({ force: true })

    // Valida total de disputas na aba "Sem resposta"
    cy.get('[data-testid=pagination]')
      .contains('Total de disputas: 10')

    // Valida Número de casos com notificação
    cy.get('[data-testid=expiration-notify]')
      .should('have.length', 5)

    // Seleciona a aba "Em negociação"
    cy.get('.el-tabs__nav > #tab-1')
      .contains('Em negociação')
      .click({ force: true })

    // Valida total de disputas na aba "Sem resposta"
    cy.get('[data-testid=pagination]')
      .contains('Total de disputas: 25')

    // Valida Número de casos com notificação
    cy.get('.el-table__row--visualized-row')
      .should('have.length', 10)

    // Seleciona a aba "Proposta aceita"
    cy.get('.el-tabs__nav > #tab-2')
      .contains('Proposta aceita')
      .click({ force: true })

    // Valida total de disputas na aba "Sem resposta"
    cy.get('[data-testid=pagination]')
      .contains('Total de disputas: 14')

    // Valida Número de casos com notificação
    cy.get('.el-table__row--visualized-row')
      .should('have.length', 5)

    // Seleciona a aba "Todos"
    cy.get('.el-tabs__nav > #tab-3')
      .contains('Todos')
      .click({ force: true })

    // Valida total de disputas na aba "Sem resposta"
    cy.get('[data-testid=pagination]')
      .contains('Total de disputas: 50')
  })
})
