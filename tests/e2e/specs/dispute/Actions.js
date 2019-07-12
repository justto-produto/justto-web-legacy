describe('Justto.App - Disputa: Ações', function () {
  beforeEach('Login', function () {
    // Acessa a página inicial do Justto.App
    // cy.visit('http://homol.justto.com.br')
    cy.visit('localhost:8080')

    // Redireciona para 'Login'
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

    // Entra na disputa
    cy.wait(1000)
    cy.get('[data-testid=dispute-index]').eq(0)
      .click()

    // Sistema deve redirecionar para a página de Registro
    cy.url().should('include', '/#/management/dispute/')
  })

  afterEach('Notificação de Sucesso', function () {
    cy.wait(2000)
    // Notificação de sucesso deve aparecer
    cy.get('.el-notification.success')
      .contains('Ação realizada com sucesso.')
      .should('be.visible')

    // Modal de confirmação deve adesaparecer
    cy.get('.el-message-box')
      .should('not.be.visible')

    // Modal de confirmação deve desaparecer
    cy.get('[data-testid=choose-unsettled-dialog]')
      .should('not.be.visible')
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
  })

  it('Ação: Perder', function () {
    // Clica em Perder
    cy.get('[data-testid=unsettled]')
      .click()

    // Modal de confirmação deve aparecer
    cy.get('[data-testid=choose-unsettled-dialog]')
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

  it('Ação: Favoritar', function () {
    // Favorita/disfavorita caso
    cy.get('[data-testid=favorite]')
      .click()

    // Modal de confirmação deve aparecer
    cy.get('.el-message-box')
      .should('be.visible')

    // Confirma a ação
    cy.get('.confirm-action-btn')
      .click()
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
  })

  it('Ação: Remover', function () {
    // Clica em Remover
    cy.get('[data-testid=remove]')
      .click()

    // Modal de confirmação deve aparecer
    cy.get('.el-message-box')
      .should('be.visible')

    // Confirma a ação
    cy.get('.confirm-remove-btn')
      .click()
  })
})
