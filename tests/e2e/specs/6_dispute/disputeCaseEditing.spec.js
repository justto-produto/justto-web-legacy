const login = Cypress.env('main-email')
const password = Cypress.env('main-password')
const workspace = Cypress.env('main-workspace')
const dispute = Cypress.env('main-dispute')
const user = Cypress.env('main-user')

describe('Disputa', function () {
  before(function () {
    cy.prepair_testes('PUT', 'prepare-dispute-update-test-e2e')
  })

  beforeEach(function () {
    cy.access('/')
    cy.login(login, password, workspace)
  })

  it('Editação de Disputa', function () {
    // Entra na aba 'Todos'
    cy.get('.el-tabs__nav > #tab-3')
      .contains('Todos')
      .click({ force: true })

    // clica no primeiro caso: index 0
    // cy.get('[data-testid=dispute-index] tbody > tr.el-table__row', { timeout: 60000 }).first()
    cy.get('[data-testid=dispute-index] tbody > tr.el-table__row', { timeout: 60000 })
      .contains('10908')
      .click()

    // Verifica se entrou na disputa 10908
    cy.get('[data-testid=dispute-id]')
      .contains('Disputa #' + dispute)

    // Loading deve desaparecer
    cy.get('.el-loading-mask')
      .should('not.be.visible')

    cy.wait(1000)

    // Verifica se valores correspondem
    cy.get('[data-testid=overview-upperrange]')
      .contains('R$ 25.000,00')
    cy.get('[data-testid=overview-counterproposal]')
      .contains('R$ 35.000,00')
    cy.get('[data-testid=overview-proposal]')
      .contains('R$ 16.200,00')
    cy.get('[data-testid=overview-expirationdate]')
      .contains('30/12/98')
    cy.get('[data-testid=overview-description]')
      .contains('Descrição da disputa E2E')

    // Clica no botão "Editar"
    cy.get('[data-testid=edit-dispute]')
    .click()

    // Edita campo Alçada Máxima
    cy.get('[data-testid=bondary-input]')
      // .should('have.value', 'R$ 27.000,00')
      .clear().type('400000')
      .should('have.value', 'R$ 4.000,00')

    // Edita campo Contraproposta
    cy.get('[data-testid=counterproposal-value-input]')
      // .should('have.value', 'R$ 26.000,00')
      .clear().type('350000')
      .should('have.value', 'R$ 3.500,00')

    // Edita autor da Contraproposta
    // cy.get('[data-testid=counterproposal-claimant-input]')
    //   .click()
    //   .trigger('keydown', { keyCode: 40, Which: 40, force: true }) // Pressiona seta direita
    //   .trigger('keydown', { keyCode: 13, Which: 13, force: true }) // Pressiona Enter

    // Edita campo Valor proposto
    cy.get('[data-testid=proposal-value-input]')
      // .should('have.value', 'R$ 15.000,00')
      .clear().type('200000')
      .should('have.value', 'R$ 2.000,00')

    // Edita autor do Valor proposto
    // cy.get('[data-testid=proposal-negotiator-input]')
    //   .click()
    //   .trigger('keydown', { keyCode: 40, Which: 40, force: true }) // Pressiona seta direita
    //   .trigger('keydown', { keyCode: 13, Which: 13, force: true }) // Pressiona Enter

    // Edita data de expiração
    cy.get('[data-testid=expiration-date-input]')
      .click()
      .trigger('keydown', { keyCode: 39, Which: 39, force: true }) // Pressiona seta direita
      .trigger('keydown', { keyCode: 13, Which: 13, force: true }) // Pressiona Enter
      // .should('have.value', '')

    // Edita o Campo de 'Descrição'
    cy.get('[data-testid=description-input]')
      .clear().type('Teste edição descrição')
      .should('have.value', 'Teste edição descrição')

    // Verifica se o botão 'Editar dados' é visível e clica
    cy.get('[data-testid=confirm-edit-data]')
      .should('be.visible')
      .click()

    // Confirma edição de dados
    cy.get('.edit-case-confitm-dialog')
      .contains('As novas informações vão sobrescrever as antigas.')
      .get('.edit-case-confirm-button')
      .click({ force: true })

    // Verifica se mensagem de confirmação aparece
    cy.get('.el-notification.success', { timeout: 60000 })
    .contains('Os dados foram alterados com sucesso.')
    .should('be.visible')

    // Verifica se valores correspondem
    cy.get('[data-testid=overview-upperrange]')
      .contains('R$ 4.000,00')
    cy.get('[data-testid=overview-counterproposal]')
      .contains('R$ 3.500,00')
    cy.get('[data-testid=overview-proposal]')
      .contains('R$ 2.000,00')
    cy.get('[data-testid=overview-expirationdate]')
      .contains('31/12/98')
    cy.get('[data-testid=overview-description]')
      .contains('Teste edição descrição')
  })
})
