const login = Cypress.env('main-email')
const password = Cypress.env('main-password')
const workspace = Cypress.env('main-workspace')
const dispute = Cypress.env('main-dispute')
const user = Cypress.env('main-user')

describe('Justto.App - Disputa: Edição do Caso', function () {
  before(function () {
    cy.prepair_testes('PUT', 'prepare-dispute-update-test-e2e')
  })
  beforeEach(function () {
    cy.access('/')
    cy.login(login, password, workspace)
  })

  it('Editação de Partes', function () {

    // Entra na aba 'Todos'
    cy.get('.el-tabs__nav > #tab-3')
    .contains('Todos')
    .click({ force: true })

    // clica no primeiro caso: index 0
    cy.get('[data-testid=dispute-index] tbody > tr.el-table__row', { timeout: 60000 })
    .contains('Teste e2e 021')
    .click()

    // Verifica se entrou na disputa 10908
    cy.get('[data-testid=dispute-id]')
      .contains('Disputa #' + dispute)

    // Loading deve desaparecer
    cy.get('.el-loading-mask')
      .should('not.be.visible')

    cy.wait(1000)

    // Clica no nome para expandir o card
    cy.get('[data-testid=expand-party]').eq(0)
      .click()

    cy.contains('CPF').should('be.visible')
    cy.contains('Função').should('be.visible')
    cy.contains('Parte contrária').should('be.visible')

    // Clica no botão de 'Editar'
    cy.get('[data-testid=edit-part]').first()
      .click()

    // Preenche o Campo de 'E-mail'
    cy.get('[data-testid=input-email]')
      .type('testes@testes.com')

    // Clica no botão de '+'
    cy.get('[data-testid=add-email]')
      .click()

    // Verifica se o email inserido aparece
    cy.contains('testes@testes.com')
      .should('to.exist')

    // Tenta adicionar novamente o mesmo email
    cy.get('[data-testid=input-email]')
      .type('testes@testes.com')
    cy.get('[data-testid=add-email]')
      .click()

    // Verifica se aparece somente um email
    cy.get('.cell:contains("testes@testes.com")').should('length', 2)

  })

})
