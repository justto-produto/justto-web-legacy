const login = Cypress.env('main-email')
const password = Cypress.env('main-password')
const workspace = Cypress.env('main-workspace')
const dispute = Cypress.env('main-dispute')
const name = Cypress.env('main-name')

describe('Ações da Disputa', function () {
  before(function () {
    cy.prepair_testes('PUT', 'prepare-dispute-update-test-e2e')
  })

  beforeEach(function () {
    cy.access('/')
    cy.login(login, password, workspace)

    // Entra na aba 'Todos'
    cy.get('.el-tabs__nav > #tab-3')
      .contains('Todos')
      .click({ force: true })

    // Entra na primeira disputa da lista
    // cy.get('[data-testid=dispute-index] tbody > tr.el-table__row', { timeout: 60000 }).first()
    cy.get('[data-testid=dispute-index] tbody > tr.el-table__row', { timeout: 60000 })
      .contains('10908')
      .click()

    // Sistema deve redirecionar para a página de Registro
    cy.url().should('include', '/#/management/dispute/')
  })

  it('Ação: Pausar', function () {
    // Clica em Pausar
    cy.get('[data-testid=paused]')
      .click()

    // Modal de confirmação deve aparecer
    cy.get('.el-message-box')
      .should('be.visible')

    // Confirma a ação
    cy.get('.confirm-action-btn')
      .click()

    // Notificação de sucesso deve aparecer
    cy.get('.el-notification.success', { timeout: 60000 })
      .contains('Ação pausar realizada com sucesso.')
      .should('be.visible')

    // Modal de confirmação deve desaparecer
    cy.get('.el-message-box')
      .should('not.be.visible')

    // Verifica se status da disputa foi alterados
    cy.get('[data-testid=overview-status]')
      .contains('Ganho (pausada)')
  })

  it('Ação: Retomar', function () {
    // Clica em Retomar
    cy.get('[data-testid=resume')
      .click()

    // Modal de confirmação deve aparecer
    cy.get('.el-message-box')
      .should('be.visible')

    // Confirma a ação
    cy.get('.confirm-action-btn')
      .click()

    // Notificação de sucesso deve aparecer
    cy.get('.el-notification.success', { timeout: 60000 })
      .contains('Ação retomar realizada com sucesso.')
      .should('be.visible')

    // Modal de confirmação deve desaparecer
    cy.get('.el-message-box')
      .should('not.be.visible')

    // Verifica se status da disputa foi alterados
    cy.get('[data-testid=overview-status]')
      .contains('Ganho')
  })

  it('Ação: Reiniciar Engajamento', function () {
    // VClica em Reiniciar Engajamento
    cy.get('[data-testid=restart-engagement]')
      .click()

    // Modal de confirmação deve aparecer
    cy.get('.el-message-box')
      .should('be.visible')

    // Confirma a ação
    cy.get('.confirm-action-btn')
      .click()

    // Notificação de sucesso deve aparecer
    cy.get('.el-notification.success', { timeout: 60000 })
      .contains('Ação reiniciar engajamento realizada com sucesso.')
      .should('be.visible')

    // Modal de confirmação deve desaparecer
    cy.get('.el-message-box')
      .should('not.be.visible')

    // Verifica se status da disputa foi alterados
    cy.get('[data-testid=overview-status]')
      .contains('Engajamento')
  })

  it('Ação: Ganhar', function () {
    // Clica em Ganhar
    cy.get('[data-testid=settled]')
      .click()

    // Modal de confirmação deve aparecer
    cy.get('.el-message-box')
      .should('be.visible')

    // Confirma a ação
    cy.get('.confirm-action-btn')
      .click()

    // Notificação de sucesso deve aparecer
    cy.get('.el-notification.success', { timeout: 60000 })
      .contains('Ação ganhar realizada com sucesso.')
      .should('be.visible')

    // Modal de confirmação deve desaparecer
    cy.get('.el-message-box')
      .should('not.be.visible')

    // Botão deve estar desabilitado
    cy.get('[data-testid=settled]')
      .should('be.disabled')

    // Verifica se status da disputa foi alterados
    cy.get('[data-testid=overview-status]')
      .contains('Ganho')
  })

  it('Ação: Favoritar', function () {
    // Favorita/disfavorita caso
    cy.get('[data-testid=favorite]')
      .click()

    // Notificação de sucesso deve aparecer
    cy.get('.el-notification.success', { timeout: 60000 })
      .contains('Ação favoritar realizada com sucesso.')
      .should('be.visible')

    cy.wait(5000)

    // Favorita/disfavorita caso
    cy.get('[data-testid=favorite]')
      .click()

    // Modal de confirmação deve aparecer
    cy.get('.el-message-box')
      .should('be.visible')

    // Confirma a ação
    cy.get('.confirm-action-btn')
      .click()

    // Notificação de sucesso deve aparecer
    cy.get('.el-notification.success', { timeout: 60000 })
      .contains('Ação desfavoritar realizada com sucesso.')
      .should('be.visible')

    // Modal de confirmação deve desaparecer
    cy.get('.el-message-box')
      .should('not.be.visible')
  })
})
