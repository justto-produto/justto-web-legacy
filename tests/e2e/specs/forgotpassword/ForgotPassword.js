describe('Justto.app - Esqueci a Senha', function () {
  it('Esqueci minha Senha: Sucesso', function () {
    // Acessa a página inicial do Justto.App
    cy.visit('http://homol.justto.com.br')
    // cy.visit('localhost:8080')

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
})
