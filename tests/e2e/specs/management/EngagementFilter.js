describe('Justto.App - Gerenciamento: Filtro Engajamento', function () {
  it('Gerenciamento: Engajamento - Exibição dos Casos - Vazio', function () {
    // Acessa a página inicial do Justto.App
    // cy.visit('http://homol.justto.com.br')
    cy.visit('localhost:8080')

    // Sistema deve redirecionar para a página de Login
    cy.url().should('include', '/#/login')

    // Preenche o campo 'Email'
    cy.get('[data-testid=login-email]')
      .type('zozuyakip@royalhost.info')
      .should('have.value', 'zozuyakip@royalhost.info')

    // Preenche o campo 'Senha'
    cy.get('[data-testid=login-password]')
      .type('password')
      .should('have.value', 'password')

      // Clica no botão "Entrar"
    cy.get('[data-testid=submit]')
      .click()

      // Verifica se tela acessada é a de "Gerenciamento"
    cy.url().should('include', '/#/management')

    // Seleciona a aba "Engajamento"
    cy.contains('Engajamento').should('be.visible').click()

    // Seleciona botão 'Filtrar'
    cy.get('[data-testid=management-filterbtn]').click()

    // Seleciona Campanha
    cy.get('[data-testid=filter-campaign]').click()

    cy.wait(5000)

    // cy.contains('Toy Story').should('be.visible').click()

    cy.contains('Toy').click()

    cy.wait(5000)
  })
})
