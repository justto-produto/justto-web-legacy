const login = Cypress.env('import-actions-email')
const password = Cypress.env('default-password')

describe('Justto.App - Gerenciamento: Ação em Lote', function () {
  beforeEach(function () {
    // Acessa a página inicial do Justto.App
    // cy.visit('http://homol.justto.com.br')
    cy.visit('/')

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

    // Entra na aba 'Todos'
    cy.get('.el-tabs__nav > #tab-3')
      .contains('Todos')
      .click({ force: true })

    /// / TODO: Tivemos que adiciocar um delay por causa da lentidão do sistema
    cy.log('Aguarde carregar disputas')
    cy.wait(10000)

    // Seleciona primeira disputa
    cy.get('tbody label[role=checkbox]', { timeout: 60000 }).first()
      .click()

    // Menu de ações deve estar visivel
    cy.get('.management-actions')
      .should('have.class', 'active')
      .should('be.visible')
  })

  afterEach('Notificação de Sucesso', function () {
    // Notificação de sucesso deve aparecer
    cy.get('.el-notification.success', { timeout: 60000 })
      .contains('Yay!')
      .should('be.visible')

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

    // Desseleciona disputa
    cy.get('tbody label[role=checkbox]').first()
      .click()

    // Menu de ações deve estar visivel
    cy.get('.management-actions')
      .should('not.have.class', 'active')
      .should('not.be.visible')
  })
})
