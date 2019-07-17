const login = Cypress.env('email6')
const password = Cypress.env('password6')

describe('Justto.App - Disputa: Menssagens', function () {
  beforeEach('Login', function () {
    // Acessa a página inicial do Justto.App
    cy.visit('https://' + Cypress.env('BASE_URL'))

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
    cy.wait(2000)
    cy.get('[data-testid=dispute-index]').eq(0)
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
    cy.wait(2000)
    cy.get('[data-testid=dispute-index]').eq(0)
      .click()

    // Seleciona primeira parte do caso
    cy.get('[data-testid=expand-party]').eq(0)
      .click()

    // Digita mensagem
    cy.get('[data-testid=input-message]')
      .type('Teste email 11')
      .should('have.value', 'Teste email 11')

    // Envia mensagem
    cy.get('[data-testid=submit-email]')
      .click()

    // Aguarda atualização
    cy.wait(5000)

    // Clica para visualizar ultima mensagem
    cy.get('[data-testid=show-email]')
      .last()
      .click()

    // Mensagem deve ser a enviada
    cy.get('[data-testid=email-dialog]')
      .contains('Teste email 11')
      .should('be.visible')

    // Fecha modal da mensagem
    cy.get('[data-testid=close-button]')
      .click()

    // Modal deve desaparecer
    cy.get('[data-testid=email-dialog]')
      .should('not.be.visible')
  })
})
