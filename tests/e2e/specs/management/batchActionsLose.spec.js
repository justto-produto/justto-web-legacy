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
    it('Ação em Lote: Perder - ' + motive, function () {
      // Seleciona primeira disputa
      cy.get('[role=checkbox]').eq(1)
        .click()

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
      // .trigger('keydown', { keyCode: 40, Which: 40 }) // Pressiona seta para baixo (3x)
      // .trigger('keydown', { keyCode: 13, Which: 13 }) // Pressiona Enter

      // Confirma a ação
      cy.get('.confirm-action-unsettled')
        .click()

      cy.wait(4000)
      // Notificação de sucesso deve aparecer
      cy.get('.el-notification.success')
        .contains('Yay!')

      // Modal de confirmação deve desaparecer
      cy.get('[data-testid=choose-unsettled-dialog]')
        .should('not.be.visible')
    })
  })
})
