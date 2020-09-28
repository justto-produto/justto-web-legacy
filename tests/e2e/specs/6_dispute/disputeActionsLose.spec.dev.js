const login = Cypress.env('main-email')
const password = Cypress.env('main-password')
const workspace = Cypress.env('main-workspace')
// const dispute = Cypress.env('main-dispute')
// const name = Cypress.env('main-name')

describe('Justto.App - Disputa: Ação Perder', function() {
  beforeEach(function() {
    cy.prepair_testes('PUT', '/prepare-dispute-update-test-e2e')
    cy.access('/')
    cy.login(login, password, workspace)

    // Entra na aba 'Todos'
    cy.get('.el-tabs__nav > #tab-3')
      .contains('Todos')
      .click({ force: true })

    // Entra na disputa
    cy.get('[data-testid=dispute-index] tbody > tr.el-table__row', { timeout: 60000 }).first()
      .click({ force: true })

    // Sistema deve redirecionar para a página de Registro
    cy.url().should('include', '/#/management/dispute/')
  })

  afterEach('Remove a Conta', function() {
    // Clica em Remover
    cy.get('[data-testid=remove]')
      .click()

    // Modal de confirmação deve aparecer
    cy.get('.el-message-box')
      .should('be.visible')

    // Confirma a ação
    cy.get('.confirm-remove-btn')
      .click()

    cy.wait(1000)
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
    it('Ação: Perder - ' + motive, function() {
      // Clica em Perder
      cy.get('[data-testid=unsettled]')
        .click()

      // Modal de confirmação deve aparecer
      cy.get('[data-testid=choose-unsettled-dialog]')
        .should('be.visible')

      // Abre o select
      cy.get('[data-testid=select-unsettled]')
        .click()

      // Seleciona motivo da perda
      cy.contains(motive)
        .click()
      // .trigger('keydown', { keyCode: 40, Which: 40 }) // Pressiona seta para baixo (3x)
      // .trigger('keydown', { keyCode: 13, Which: 13 }) // Pressiona Enter

      // Confirma a ação
      cy.get('.confirm-action-unsettled')
        .click()

      cy.wait(4000)
      // Notificação de sucesso deve aparecer
      cy.get('.el-notification.success')
        .contains('Ação realizada com sucesso.')
        .should('be.visible')

      // Modal de confirmação deve desaparecer
      cy.get('[data-testid=choose-unsettled-dialog]')
        .should('not.be.visible')

      cy.get('[data-testid=unsettled]')
        .should('be.disabled')
    })
  })
})
