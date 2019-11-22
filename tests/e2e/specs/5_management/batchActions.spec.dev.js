const login = Cypress.env('main-email')
const password = Cypress.env('main-password')
const workspace = Cypress.env('main-workspace')

describe('Justto.App - Gerenciamento: Ação em Lote', function () {
  beforeEach(function () {
    // Acessa a página inicial do Justto.App
    cy.access('/')

    // Faz login com 'acordo@justto.app'
    cy.login(login, password, workspace)

    // Entra na aba 'Todos'
    cy.get('.el-tabs__nav > #tab-3')
      .contains('Todos')
      .click({ force: true })

    // Seleciona primeira disputa
    cy.get('tbody label', { timeout: 60000 }).first()
      .click()

    // Menu de ações deve estar visivel
    cy.get('.management-actions')
      .should('have.class', 'active')
      .should('be.visible')
  })

  afterEach('Notificação de Sucesso', function () {
    // Notificação de sucesso deve aparecer
    cy.get('.el-notification.success', { timeout: 60000 })
      .should('be.visible')
      .contains('Yay!')

    // Modal de confirmação deve adesaparecer
    cy.get('.el-message-box')
      .should('not.be.visible')
  })

  it('Ação em Lote: Pausar', function () {
    // Clica na ação
    cy.get('[data-testid=batch-paused]')
      .click()

    // Mensagem de confirmação deve aparecer
    cy.get('.el-message-box')
      .should('be.visible')

    // Confirma a ação
    cy.get('.confirm-action-btn')
      .click()
  })

  it('Ação em Lote: Retomar', function () {
    // Clica na ação
    cy.get('[data-testid=batch-resume]')
      .click()

    // Mensagem de confirmação deve aparecer
    cy.get('.el-message-box')
      .should('be.visible')

    // Confirma a ação
    cy.get('.confirm-action-btn')
      .click()
  })

  it('Ação em Lote: Ganha', function () {
    // Clica na ação
    cy.get('[data-testid=batch-settled]')
      .click()

    // Mensagem de confirmação deve aparecer
    cy.get('.el-message-box')
      .should('be.visible')

    // Confirma a ação
    cy.get('.confirm-action-btn')
      .click()
  })

  it('Ação em Lote: Reiniciar Engajamento', function () {
    // VClica em Reiniciar Engajamento
    cy.get('[data-testid=batch-restartengagement]')
      .click()

    // Modal de confirmação deve aparecer
    cy.get('.el-message-box')
      .should('be.visible')

    // Confirma a ação
    cy.get('.confirm-action-btn')
      .click()
  })

  it('Ação em Lote: Excluir', function () {
    // Clica em Remover
    cy.get('[data-testid=batch-delete]')
      .click()

    // Modal de confirmação deve aparecer
    cy.get('.el-message-box')
      .should('be.visible')

    // Confirma a ação
    cy.get('.confirm-action-btn')
      .click()
  })
})
