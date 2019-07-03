describe('Justto.App - Gerenciamento: Visualização Todos', function () {
  it('Gerenciamento: Todos - Exibição dos Casos - Vazio', function () {
    // Acessa a página inicial do Justto.App
    // cy.visit('http://homol.justto.com.br')
    cy.visit('localhost:8080')

    // Sistema deve redirecionar para a página de Login
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
    cy.contains('Todos').should('be.visible').click()

    // Verifica se mensagem "Não foram encontradas disputas" é exibida
    cy.contains('Não foram encontradas disputas')
      .should('be.visible')
  })

  it('Gerenciamento: Todos - Exibição de Casos - Com casos', function () {
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

    // Seleciona a aba "Todos"
    cy.contains('Todos').should('be.visible')
      .click()

      // Verifica se existem casos exibidos
    cy.get('[class=el-table__body]').should('be.visible')

    cy.wait(5000)
  })
})



