describe('Nova Senha', function () {
  beforeEach(function () {
    cy.access('/#/new-password/TSTAUTO')
  })

  it('Senha Alterada', function () {
    // Preenche o campo 'Senha'
    cy.get('[data-testid=new-password]')
      .type('password')
      .should('have.value', 'password')

    // Preenche o campo 'Confirme senha'
    cy.get('[data-testid=confirm-password]')
      .type('password')
      .should('have.value', 'password')

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

  it('Senhas não Correspondem', function () {
    // Preenche o campo 'Senha'
    cy.get('[data-testid=new-password]')
      .type('password')
      .should('have.value', 'password')

    // Preenche o campo 'Confirme senha'
    cy.get('[data-testid=confirm-password]')
      .type('123456')
      .should('have.value', '123456')

    // Clica no botão 'Alterar'
    cy.get('[data-testid=submit]')
      .click()

    // Menssagem de Campos não correspondentes
    cy.contains('Campos não correspondem')
      .should('be.visible')
  })
})
