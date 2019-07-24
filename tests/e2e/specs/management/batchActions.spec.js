const login = Cypress.env('email1')
const password = Cypress.env('password1')

describe('Justto.App - Gerenciamento: Ação em Lote', function () {
  beforeEach(function () {
    // Acessa a página inicial do Justto.App
    // cy.visit('http://homol.justto.com.br')
    cy.visit('localhost:8080')

    // Valida se o endereço redirecionado é o 'Login'
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
    cy.get('[data-testid=submit]')
      .click()

    // Verifica se tela acessada é a de "Gerenciamento"
    cy.url().should('include', '/#/management')

    cy.wait(2000)
  })

  afterEach('Notificação de Sucesso', function () {
    // Notificação de sucesso deve aparecer
    cy.get('.el-notification.success')
      .contains('Yay!')
      .should('be.visible')

    // Modal de confirmação deve adesaparecer
    cy.get('.el-message-box')
      .should('not.be.visible')
  })

  it('Ação em Lote: Pausar', function () {
    // Seleciona primeira disputa
    cy.get('[role=checkbox]').eq(1)
      .click()

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
    // Seleciona primeira disputa
    cy.get('[role=checkbox]').eq(1)
      .click()

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
    // Seleciona primeira disputa
    cy.get('[role=checkbox]').eq(1)
      .click()

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
    // Seleciona primeira disputa
    cy.get('[role=checkbox]').eq(1)
      .click()

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
    // Seleciona primeira disputa
    cy.get('[role=checkbox]').eq(1)
      .click()

    // Clica em Remover
    cy.get('[data-testid=batch-delete]')
      .click()

    // Modal de confirmação deve aparecer
    cy.get('.el-message-box')
      .should('be.visible')

    // Confirma a ação
    cy.get('.confirm-remove-btn')
      .click()
    cy.wait(4500)
  })
})
