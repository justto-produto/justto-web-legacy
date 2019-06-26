describe('Justto.App - PlanilhaModelo', function() {

  it('Login: Sucesso', function() {
    // Acessa a página inicial do Justto.App
    // cy.visit('http://homol.justto.com.br')
    cy.visit('localhost:8080')

    // Sistema deve redirecionar para a página de Login
    cy.url().should('include', '/#/login')

    // Preenche o campo 'Email'
    cy.get('[data-testid="login-email"]')
      .type('gugo@eyeemail.com')
      .should('have.value', 'gugo@eyeemail.com')

    // Preenche o campo 'Senha'
    cy.get('[data-testid="login-password"]')
      .type('password')
      .should('have.value', 'password')

    // Clica no botão "Entrar"
    cy.get('[data-testid="submit"]').click()

    // Valida se acesso foi feito
    cy.url().should('include', '/#/management')
 })

  it('PlanilhaModelo: Sucesso', function() {

      // Acessa a tela de gerenciamento
      cy.get('[data-testid=menu-import]').click()

      // Sistema deve redirecionar para a página de Importação
      cy.url().should('include', '/#/import')

      // verifica se o botão está visível
      cy.get('[data-testid=download_model]')
        .should('be.visible')
        .click()

      // Valida se acesso foi feito
      // cy.url().should('include', '/#/management')
    })
  })
