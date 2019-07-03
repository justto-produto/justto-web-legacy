describe('Justto.App - Gerenciamento: Engajamento', function() {
  it('Gerenciamento: Engajamento - Exibição do Resumo da Disputa, Chat e Dados', function() {

    cy.visit('http://homol.justto.com.br')
    // cy.visit('localhost:8080')

    // Redireciona para 'Login'
    cy.url().should('include', '/#/login')

    // Preenche o campo 'Email'
    cy.get('[data-testid=login-email]')
      .type('dubu@voemail.com')
      .should('have.value', 'dubu@voemail.com')

    // Preenche o campo 'Senha'
    cy.get('[data-testid=login-password]')
      .type('password')
      .should('have.value', 'password')

    // Clica no botão "Entrar"
    cy.get('[data-testid=submit]')
      .click()

    // Verifica se tela acessada é a de "Gerenciamento"
    cy.url().should('include', '/#/management')

    // Seleciona a aba "Todos"
    cy.contains('Todos').should('be.visible')
      .click()

    // Seleciona e clica na Disputa
    cy.contains('#12705').should('be.visible')
      .click()

    // Verifica se tela acessada é a da "Disputa"
    cy.url().should('include', '/#/management/dispute/12705')

    // Verifica se carrega os dados em "Resumo da disputa"
    cy.contains('Enriquecimento')
      .should('be.visible')
    cy.contains('Engajamento')
      .should('be.visible')
    cy.contains('Interação')
      .should('be.visible')
    cy.contains('Última valor proposto')
      .should('be.visible')

    // Verifica se carregou os dados em "Dados da disputa"
    cy.contains('Informações gerais')
      .should('be.visible')
    cy.contains('Nº do Processo:')
      .should('be.visible')
    cy.contains('Campanha:')
      .should('be.visible')

    // Verifica se carrega os dados em "Dados da disputa"
    cy.contains('Código da Disputa')
      .should('be.visible')
    cy.contains('contatos da Pessoa:')
      .should('be.visible')

  })
})
