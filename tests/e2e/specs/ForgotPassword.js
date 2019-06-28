describe('Justto.app - Esqueci a Senha', function() {
  it('Esqueci minha Senha: Sucesso', function() {
    // Acessa a página inicial do Justto.App
    // cy.visit('http://homol.justto.com.br')
    cy.visit('localhost:8080')

    // Sistema deve redirecionar para a página de Login
    cy.url().should('include', '/#/login')

    // Acessa a página de Equeci minha Senha
    cy.get('[data-testid=forgot-password]').click()

    // Sistema deve redirecionar para a página de Esqueci minha Senha
    cy.url().should('include', '/#/forgot-password')

    // Digita um email válido existente
    cy.get('[data-testid=forgot-password-email]')
      .type('gugo@eyeemail.com')
      .should('have.value', 'gugo@eyeemail.com')

    // Clica no botão Recuperar
    cy.get('[data-testid=submit]').click()

    // Verifica se email foi enviado
    cy.get('[data-testid=forgot-password-success]')
      .should('be.visible')
    cy.get('[data-testid=forgot-password-success]')
      .contains('Requisição de recuperação enviada com sucesso! Acesse seu email para prosseguir.')
      .should('be.visible')
  })

  it('Nova Senha: Sucesso', function() {
    // Acessa a página inicial do Justto.App
    //cy.visit('http://homol.justto.com.br')
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

  it('Nova Senha: Falha', function() {
    // Acessa a página inicial do Justto.App
    //cy.visit('http://homol.justto.com.br')
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
