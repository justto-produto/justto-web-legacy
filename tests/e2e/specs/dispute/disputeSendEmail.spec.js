const login = Cypress.env('editable-cases-email')
const password = Cypress.env('default-password')

describe('Justto.App - Disputa: Menssagens', function () {
  beforeEach('Login', function () {
    // Acessa a página inicial do Justto.App
    cy.visit('/#/login')

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

    // Entra na aba 'Todos'
    cy.get('.el-tabs__nav > #tab-3')
    .contains('Todos')
    .click({force: true})
  })

  it('Envio de Email: Parte não selecionada', function () {
    // Entra na primeira disputa da lista
    cy.get('[data-testid=dispute-index] tbody > tr.el-table__row').first()
      .click()

    // Caixa de texto deve estar desabilitada, mensagem deve aparecer no lugar.
    cy.get('[data-testid=unselected-party]')
      .contains('Escolha um destinatário ao lado')

    // 'Enviar' deve estar desabilitado
    cy.get('[data-testid=submit-email]')
      .should('be.disabled')
  })


  it('Envia de Email: Sucesso', function () {
    // Entra na primeira disputa da lista
    cy.get('[data-testid=dispute-index] tbody > tr.el-table__row').first()
      .click()

    // Seleciona primeira parte do caso
    cy.get('[data-testid=expand-party]').first()
      .click()

    function randomText(size) {
      var caracters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
      var result = '';
      for (var i = 0; i < size; i++) {
        var n = Math.floor(Math.random() * caracters.length);
        result += caracters.substring(n, n + 1);
      }
      return 'TST' + result;
    }
    const message = randomText(12)

    // Digita mensagem
    cy.get('[data-testid=input-message]')
      .type(message)
      .should('have.value', message)

    // Envia mensagem
    cy.get('[data-testid=submit-email]')
      .click()

    // Notificação de sucesso deve aparecer
    cy.get('.el-notification.success', { timeout: 60000 })
    cy.contains('email enviado com sucesso.')
      .should('be.visible')

    cy.wait(12000)
    // Caixas de nota devem aparecer
    cy.get('[data-testid=message-box]')
      .should('be.visible')

    // Clica em 'vusualizar email'
    cy.get('[data-testid=show-email]').last()
      .click({force: true})

    // Dialog de conteudo do email deve aparecer
    cy.get('[data-testid=email-dialog]')
      .should('be.visible')

    // Mensagem deve ser a enviada
    cy.contains(message)
      .should('be.visible')

    // Fecha dialog
    cy.get('[data-testid=close-button]')
      .click()

    // Dialog deve desaparecer
    cy.get('[data-testid=email-dialog]')
      .should('not.be.visible')
  })
})
