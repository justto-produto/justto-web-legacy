describe('Justto.App - Nova Senha', function () {
  it('Nova Senha: Sucesso', function () {
    // Acessa a página inicial do Justto.App
    // cy.visit('http://homol.justto.com.br')
    cy.visit('localhost:8080/#/new-password/sLmqSo')

    // Preenche o campo 'Senha'
    cy.get('[data-testid=new-password]')
      .type('123456')
      .should('have.value', '123456')

    // Preenche o campo 'Confirme senha'
    cy.get('[data-testid=confirm-password]')
      .type('123456')
      .should('have.value', '123456')

    // Clica no botão 'Alterar'
    cy.get('[data-testid=submit]')
      .click()

    // Valida de senha foi alterada
    cy.get('[data-testid=new-password-success]')
      .should('be.visible')
    cy.get('[data-testid=new-password-success]')
      .contains('Senha alterada com sucesso!')
      .should('be.visible')

    // Clica em 'Clique aqui para acessar.'
    cy.get('[data-testid=go-login]').click()

    // Sistema deve redirecionar para a página de Login
    cy.url().should('include', '/#/login')
  })

  it('Nova Senha: Falha', function () {
    // Acessa a página inicial do Justto.App
    // cy.visit('http://homol.justto.com.br')
    cy.visit('localhost:8080/#/new-password/failep')

    // Preenche o campo 'Senha'
    cy.get('[data-testid=new-password]')
      .type('123456')
      .should('have.value', '123456')

    // Preenche o campo 'Confirme senha'
    cy.get('[data-testid=confirm-password]')
      .type('123456')
      .should('have.value', '123456')

    // Clica no botão 'Alterar'
    cy.get('[data-testid=submit]').click()

    // Valida de senha foi alterada
    cy.get('[data-testid=new-password-failure]')
      .should('be.visible')
    cy.get('[data-testid=new-password-failure]')
      .contains('Não foi possível identificar sua requisição de alteração de senha.')
      .should('be.visible')

    // Clica em 'Clique aqui para acessar.'
    cy.get('[data-testid=try-again]').click()

    // Sistema deve redirecionar para a página de Login
    cy.url().should('include', '/#/forgot-password')
  })
})
