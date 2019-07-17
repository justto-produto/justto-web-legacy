describe('Justto.app - Register', function () {
  it('Confirmação de email: Sucesso', function () {
    // Acessa link de validação (Link do email)
    cy.visit('https://kubernetes.justto.com.br/#/login?token=TSTAUTO')
    // cy.visit('localhost:8080/#/login?token=TSTAUTO')

    // Sistema deve direcionar para página de login com token
    cy.url('include', '/#/login?token=TSTAUTO')

    // Mensagem deSucesso deve aparecer
    cy.get('[data-testid=register-success]')
      .contains('Cadastro ativado com sucesso!')
      .should('be.visible')
  })
})
