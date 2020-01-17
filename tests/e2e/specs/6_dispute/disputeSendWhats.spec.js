const login = Cypress.env('main-email')
const password = Cypress.env('main-password')
const workspace = Cypress.env('main-workspace')
const dispute = Cypress.env('main-dispute')
const name = Cypress.env('main-name')

describe('Envio de WhatsApp', function () {
  before(function () {
    // Requisição para Preparar ambiente
    cy.prepair_testes('DELETE', 'delete-occorrences-dispute-update-test-e2e')
  })

  beforeEach(function () {
    cy.access('/')
    cy.login(login, password, workspace)
  })

  it('Envia de Email: Sucesso', function () {
    // Entra na aba 'Todos'
    cy.get('.el-tabs__nav > #tab-3')
      .contains('Todos')
      .click({ force: true })

    // Entra na primeira disputa da lista
    cy.get('[data-testid=dispute-index] tbody > tr.el-table__row', { timeout: 60000 })
      .contains('Teste e2e 021')
      .click()

    // Verifica se entrou na disputa 10908
    cy.get('[data-testid=dispute-id]')
      .contains('Disputa #' + dispute)

    // // Seleciona Whatsapp
    // cy.get('[data-testid=select-whatsapp]')
    // .click({ force: true })
    //
    // // 'Enviar' deve estar desabilitado
    // cy.get('[data-testid=submit-message]')
    // .should('be.disabled')
    //
    // // Volta para email
    // cy.get('[data-testid=select-email]')
    // .click({ force: true })

    // Seleciona primeira parte do caso
    cy.get('[data-testid=expand-party]').first()
      .click()

    function randomText (size) {
      var caracters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'
      var result = ''
      for (var i = 0; i < size; i++) {
        var n = Math.floor(Math.random() * caracters.length)
        result += caracters.substring(n, n + 1)
      }
      return 'TST' + result
    }
    const message = randomText(12)

    // Seleciona um email
    cy.get('[data-testid=radio-whatsapp]').first()
      .click()

    // 'Enviar' não deve estar desabilitado
    cy.get('[data-testid=submit-message]')
      .should('not.be.disabled')

    // Digita mensagem
    cy.get('[data-testid=input-message]')
      .type(message)
      .should('have.value', message)

    // Envia mensagem
    cy.get('[data-testid=submit-message]')
      .click()

    // Notificação de sucesso deve aparecer
    cy.get('.el-notification.success', { timeout: 60000 })
    cy.contains('whatsapp enviado com sucesso.')
      .should('be.visible')

    // Caixas de nota devem aparecer
    cy.get('[data-testid=message-box]', { timeout: 60000 }).last()
      .should('be.visible')
      .should('have.css', 'background-color', 'rgb(163, 244, 195)')

    // Mensagem deve ser a enviada
    cy.get('[data-testid=message-box]')
      .contains(message)
      .should('be.visible')
  })
})
