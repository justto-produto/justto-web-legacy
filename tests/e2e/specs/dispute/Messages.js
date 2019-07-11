describe('Justto.App - Disputa: Menssagens', function () {
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
  })

  it('Acessa uma Disputa na tela de Gerenciamento', function () {
    // Acessa uma disputa na tela de Gerenciamento
    cy.get('[data-testid=dispute-index]').eq(0)
      .click()
  })

  it('Valida tentativa de envio sem Destinatário selecionado', function () {
    // Valida se mensagem de erro é exibida ao tentar envio sem Destinatário
    cy.get('[data-testid=unselected-party]')
      .contains('Escolha um destinatário ao lado')
  })

  it('Envia mensagem', function () {
    // Seleciona destinatário
    cy.get('[data-testid=party]').eq(0)
      .click()
    // Digita mensagem
    cy.get('[data-testid=input-message]')
      .type('Teste email 11')
    // Aciona o botão de envio
    cy.get('[data-testid=submit-email]')
      .click()
  })

  it('Verifica se Email está visivel no histórico', function () {
    cy.get('[data-testid=show-email]')
      .last()
      .click()
    cy.get('[data-testid=email-dialog]')
      .contains('Teste email 11')
      .should('be.visible')
    cy.get('[data-testid=close-button]')
      .click()
    cy.get('[data-testid=email-dialog]')
      .should('not.be.visible')
  })
})
