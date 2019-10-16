describe('Register', function () {
  it('Cadastro Ativado', function () {
    // Acessa link de validação (Link do email)
    cy.visit('/#/login?token=TSTAUTO')

    // Sistema deve direcionar para página de login com token
    cy.url('include', '/#/login?token=TSTAUTO')

    // Mensagem deSucesso deve aparecer
    cy.get('[data-testid=register-success]')
      .contains('Cadastro ativado com sucesso!')
      .should('be.visible')
  })
})
