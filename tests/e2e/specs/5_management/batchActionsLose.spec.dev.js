const login = Cypress.env('main-email')
const password = Cypress.env('main-password')
const workspace = Cypress.env('main-workspace')

describe('Justto.App - Gerenciamento: Ação em Lote', function() {
  beforeEach(function() {
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

  afterEach(function() {
    // Notificação de sucesso deve aparecer
    cy.get('.el-notification.success', { timeout: 60000 })
      .should('be.visible')
      .contains('Ação perder realizada com sucesso')

    // Aviso de envio de mensagem deve aparecer
    cy.get('.el-notification.info', { timeout: 60000 })
      .should('be.visible')
      .contains('Enviaremos para às contrapartes uma mensagem de encerramento de negociação')

    // Modal de confirmação deve desaparecer
    cy.get('[data-testid=choose-unsettled-dialog]')
      .should('not.be.visible')
  })

  const motives = [
    'Ausência de interação',
    'Arquivado/Baixa definitiva',
    'Cliente solicitou encerrar negociação',
    'Alçada insuficiente',
    'Sem interesse no acordo',
    'Encaminhado para arbitragem',
    'Não foi possível realizar contato',
    'Acordo fechado por terceiros'
  ]

  motives.forEach((motive) => {
    it('Ação em Lote: Perder - ' + motive, function() {
      // Clica na ação
      cy.get('[data-testid=batch-unsettled]')
        .click()

      // Mensagem de confirmação deve aparecer
      cy.get('[data-testid=unsettled-dialog]')
        .should('be.visible')

      // Abre o select
      cy.get('[data-testid=select-unsettled]')
        .click()

      // Seleciona motivo da perda
      cy.contains(motive)
        .click()

      // Confirma a ação
      cy.get('.confirm-action-unsettled')
        .click()
    })
  })
})
