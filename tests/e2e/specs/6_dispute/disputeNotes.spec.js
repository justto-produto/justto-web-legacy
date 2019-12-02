const login = Cypress.env('main-email')
const password = Cypress.env('main-password')
const workspace = Cypress.env('main-workspace')
const dispute = Cypress.env('main-dispute')
const user = Cypress.env('main-user')

describe('Disputa', function () {
  before(function () {
    cy.prepair_testes('DELETE', 'delete-occorrences-dispute-update-test-e2e')
  })

  beforeEach(function () {
    cy.access('/')
    cy.login(login, password, workspace)
  })

  it('Salvar Nota', function () {
    // Entra na aba 'Todos'
    cy.get('.el-tabs__nav > #tab-3')
      .contains('Todos')
      .click({ force: true })

    // Entra na disputa
    // cy.get('[data-testid=dispute-index] tbody > tr.el-table__row', { timeout: 60000 }).first()
    cy.get('[data-testid=dispute-index] tbody > tr.el-table__row', { timeout: 60000 })
      .contains('Teste e2e 021')
      .click()

    // Verifica se entrou na disputa 10908
    cy.get('[data-testid=dispute-id]')
      .contains('Disputa #' + dispute)

    // Sistema deve redirecionar para a página de Registro
    cy.url().should('include', '/#/management/dispute/')

    cy.wait(1000)

    // Entra na aba 'Notas'
    cy.get('.el-tabs__nav > #tab-3')
      .contains('Nota')
      .click({ force: true })

    // Valida notas vazias
    cy.get('[data-testid=note-empty]')
      .contains('Não foram encontradas notas.')

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

    // Digita uma nota
    cy.get('[data-testid=input-note]')
      .type(message, { force: true })
      // .should('have.value', message)

    // Salva a nota
    cy.get('[data-testid=submit-note]')
      .click()

    // Notificação de sucesso deve desaparecer
    cy.get('.el-notification.success', { timeout: 60000 })
      .contains('Nota gravada com sucesso.')
      .should('be.visible')

    cy.wait(1000)

    // Nota deve aparecer entre as mensagens
    cy.contains(message, { timeout: 60000 })
      .should('be.visible')

    // Caixa de nota deve estar visivel e amarela
    cy.get('[data-testid=message-box] > .dispute-view-occurrences__card-box > .dispute-view-occurrences__card > .el-card__body')
      .should('be.visible')
      .should('have.css', 'background-color', 'rgb(246, 241, 255)')
  })
})
