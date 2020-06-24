const login = Cypress.env('main-email')
const password = Cypress.env('main-password')
const workspace = Cypress.env('main-workspace')

describe('Justto.App - Visualização de Gerenciamento', function() {
  // before('Cena', function () {
  //   cy.prepair_testes('prepare-test-e2e')
  // })
  beforeEach(function() {
    // Acessa a página inicial do Justto.App
    cy.access('/')

    // Faz login com 'acordo@justto.app'
    cy.login(login, password, workspace)
  })

  it('Exibição de Casos - Com casos', function() {
    // Seleciona a aba "Todos"
    cy.get('.el-tabs__nav > #tab-3')
      .contains('Todos')
      .click({ force: true })

    // Verifica se existem casos exibidos
    cy.get('[data-testid=dispute-index] tbody > tr.el-table__row')
      .should('be.visible', { timeout: 60000 })

    cy.get('.el-table__expand-icon').first()
      .click({ force: true })

    // Verifica se existem casos exibidos
    cy.get('tbody>tr').first()
      .should('be.visible')
  })
})
