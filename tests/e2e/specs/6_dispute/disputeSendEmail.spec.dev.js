const login = Cypress.env('main-email')
const password = Cypress.env('main-password')
const workspace = Cypress.env('main-workspace')
const dispute = Cypress.env('main-dispute')
// const user = Cypress.env('main-user')

describe('Disputa', function() {
  before(function() {
    cy.prepair_testes('DELETE', 'delete-occorrences-dispute-update-test-e2e')
  })

  beforeEach(function() {
    cy.access('/')
    cy.login(login, password, workspace)
  })

  it('Envio de Email', function() {
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

    // Verifica se inicio das disputas aparecem
    // cy.get('[data-testid=occurences-start]')
    //   .contains('Início das ocorrências')

    // 'Enviar' deve estar desabilitado
    cy.get('[data-testid=submit-message]')
      .should('be.disabled')

    // Seleciona primeira parte do caso
    cy.get('[data-testid=expand-party]').first()
      .click()

    // 'Enviar' deve estar desabilitado
    cy.get('[data-testid=submit-message]')
      .should('be.disabled')

    function randomText(size) {
      const caracters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'
      let result = ''
      for (let i = 0; i < size; i++) {
        const n = Math.floor(Math.random() * caracters.length)
        result += caracters.substring(n, n + 1)
      }
      return 'TST' + result
    }
    const message = randomText(12)

    // Seleciona um email     // Digita mensagem
    cy.get('[data-testid=checkbox-email]').first()
      .click()

    // 'Enviar' deve estar desabilitado
    cy.get('[data-testid=submit-message]')
      .should('not.be.disabled')

    // Digita mensagem
    cy.get('[data-testid=email-editor]')
      .click()
      .type(message)

    // Verifia se mensagem foi digitada
    cy.get('[data-testid=email-editor]')
      .contains(message)

    // Envia mensagem
    cy.get('[data-testid=submit-message]')
      .click()

    // Notificação de sucesso deve aparecer
    cy.get('.el-notification.success', { timeout: 60000 })
    cy.contains('email enviado com sucesso.')
      .should('be.visible')

    // Caixas de nota devem aparecer
    cy.get('[data-testid=message-box]', { timeout: 60000 }).last()
      .should('be.visible')
      .should('have.css', 'background-color', 'rgb(209, 219, 226)')

    // Clica em 'vusualizar email'
    // cy.get('[data-testid=show-email]').last()
      // .click({ force: true })

    // Mensagem deve ser a enviada
    cy.get('[data-testid=message-box]')
      .contains(message)
      .should('be.visible')
  })
})
