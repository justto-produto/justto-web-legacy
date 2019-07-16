const login = Cypress.env('email1')
const password = Cypress.env('password1')

describe('Justto.App - Disputa: Ação Perder', function () {
  beforeEach('Login', function () {
    // Acessa a página inicial do Justto.App
    // cy.visit('http://homol.justto.com.br')
    cy.visit('localhost:8080')

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
    cy.get('[data-testid=submit]')
      .click()

    // Verifica se tela acessada é a de "Gerenciamento"
    cy.url().should('include', '/#/management')

    // Entra na disputa
    cy.wait(2000)
    cy.get('[data-testid=dispute-index]').eq(0)
      .click()

    // Sistema deve redirecionar para a página de Registro
    cy.url().should('include', '/#/management/dispute/')
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
    it('Ação: Perder - ' + motive, function () {
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
