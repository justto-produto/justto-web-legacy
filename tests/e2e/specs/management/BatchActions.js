describe('Justto.App - Gerenciamento: Ação em Lote', function () {
  beforeEach(function () {
    // Acessa a página inicial do Justto.App
    // cy.visit('http://homol.justto.com.br')
    cy.visit('localhost:8080')

    // Valida se o endereço redirecionado é o 'Login'
    cy.url().should('include', '/#/login')

    // Preenche o campo 'Email'
    cy.get('[data-testid=login-email]')
      .type('lucas@justto.com.br')
      .should('have.value', 'lucas@justto.com.br')

    // Preenche o campo 'Senha'
    cy.get('[data-testid=login-password]')
      .type('123456')
      .should('have.value', '123456')

    // Clica no botão "Entrar"
    cy.get('[data-testid=submit]')
      .click()

    // Verifica se tela acessada é a de "Gerenciamento"
    cy.url().should('include', '/#/management')

    cy.wait(2000)
  })

  afterEach('Notificação de Sucesso', function () {
    cy.wait(4000)
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

  it('Ação em Lote: Perder', function () {
    // Seleciona primeira disputa
    cy.get('[role=checkbox]').eq(1)
      .click()

    // Clica na ação
    cy.get('[data-testid=batch-unsettled]')
      .click()

    // Mensagem de confirmação deve aparecer
    cy.get('[data-testid=unsettled-dialog]')
      .should('be.visible')

    // Selectiona motivo da perda
    cy.get('[data-testid=select-unsettled]')
      .click()
      .trigger('keydown', { keyCode: 40, Which: 40 }) // Pressiona seta para baixo (3x)
      .trigger('keydown', { keyCode: 13, Which: 13 }) // Pressiona Enter

    // Confirma a ação
    cy.get('.confirm-action-unsettled')
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
  })
})
