describe('Justto.App - Nova Senha', function () {
  it('Nova Senha: Sucesso', function () {
    // Acessa a página inicial do Justto.App
    // cy.visit('http://homol.justto.com.br')
    cy.visit('localhost:8080/#/new-password/TSTAUTO')

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
      .contains('Senha alterada com sucesso!')
      .should('be.visible')

    // Clica em 'Clique aqui para acessar.'
    cy.get('[data-testid=go-login]')
      .click()

    // Sistema deve redirecionar para a página de Login
    cy.url().should('include', '/#/login')
  })

  it('Nova Senha: Senhas não Correspondem', function () {
    // Acessa a página inicial do Justto.App
    // cy.visit('http://homol.justto.com.br')
    cy.visit('localhost:8080/#/new-password/TSTAUTO')

    // Sistema deve redirecionar para a página de Nova Senha
    cy.url().should('include', '/#/new-password/TSTAUTO')

    // Preenche o campo 'Senha'
    cy.get('[data-testid=new-password]')
      .type('123456')
      .should('have.value', '123456')

    // Preenche o campo 'Confirme senha'
    cy.get('[data-testid=confirm-password]')
      .type('password')
      .should('have.value', 'password')

    // Clica no botão 'Alterar'
    cy.get('[data-testid=submit]')
      .click()

    // Menssagem de Campos não correspondentes
    cy.contains('Campos não correspondem')
      .should('be.visible')
  })

  it('Nova Senha: Token Inválido', function () {
    // Acessa a página inicial do Justto.App
    // cy.visit('http://homol.justto.com.br')
    cy.visit('localhost:8080/#/new-password/FAILURE123')

    // Sistema deve redirecionar para a página de Nova Senha
    cy.url().should('include', '/#/new-password/FAILURE123')

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

    // Mensagem de erro deve aparecer
    cy.get('[data-testid=new-password-failure]')
      .contains('Não foi possível identificar sua requisição de alteração de senha.')
      .should('be.visible')

    // Clica em 'Clique aqui e tente novamente.'
    cy.get('[data-testid=try-again]')
      .click()

    // Sistema deve redirecionar para a página de Login
    cy.url().should('include', '/#/forgot-password')
  })
})
