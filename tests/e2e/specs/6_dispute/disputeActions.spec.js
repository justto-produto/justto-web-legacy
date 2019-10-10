// const login = Cypress.env('import-actions-email')
// const password = Cypress.env('default-password')
const login = 'lucas@justto.com.br'
const password = '123456'

describe('Justto.App - Disputa: Ações', function () {
  beforeEach('Login', function () {
    // Acessa a página inicial do Justto.App
    cy.visit('/')

    // Redireciona para 'Login'
    cy.url().should('include', '/#/login')

    // Preenche o campo 'Email'
    cy.get('[data-testid=login-email]')
      .type(login)
      .should('have.value', login)

    // Preenche o campo 'Senha'
    cy.get('[data-testid=login-password]')
      .type(password)
      .should('have.value', password)

    // Clica no botão "Entrar"
    cy.get('[data-testid=submit-login]')
      .click()

    // Verifica se tela acessada é a de "Gerenciamento"
    cy.url().should('include', '/#/management')
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
  })
})
