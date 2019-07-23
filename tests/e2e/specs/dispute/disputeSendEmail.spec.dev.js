const login = Cypress.env('email1')
const password = Cypress.env('password1')

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

    // Mensagem deve ser a enviada
    cy.contains(message)
      .should('be.visible')
      .get('[data-testid=message-box]')
      .should('be.visible')
  })
})
