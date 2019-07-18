const login = Cypress.env('email6')
const password = Cypress.env('password6')

describe('Justto.App - Disputa: Edição do Caso', function () {
  it('Login', function () {
    // Acessa a página inicial do Justto.App
    cy.visit('/#/login')

    // Redireciona para 'Login'
    cy.url().should('include', '/#/login')

    // Preenche o campo 'Email'
    cy.get('[data-testid=login-email]')
      .type(login)
      .should('have.value', login)

    // Preenche o campo 'Senha'
    cy.get('[data-testid=login-password]')
      .type(password)
      .should('have.value', password)

    // Clica no botão "Entrar"
    cy.get('[data-testid=submit]')
      .click()

    // Verifica se tela acessada é a de "Gerenciamento"
    cy.url().should('include', '/#/management')
  })

  it('Entra na disputa', function () {
    // clica no primeiro caso: index 0
    cy.get('tbody>tr').eq(0).click()

    // Verifica se entrou na tela de Disputa
    cy.contains('Resumo da disputa')
      .should('be.visible')
  })

  it('Clica no botão Editar de Dados da disputa', function () {
    // Clica no botão "Editar"
    cy.get('[data-testid=edit-dispute]')
      .click()

    // Verifica se todos os 'spans' aparecem
    cy.get('span').should('be.visible')
  })

  it('Altera dados e confirma a edição', function () {
    // Preenche o Campo de 'Descrição'
    cy.get('[data-testid=description]')
      .type(' Descrição de testes')

    // Verifica se o botão 'Editar dados' é visível e clica
    cy.get('[data-testid=confirm-edit-data]')
      .should('be.visible')
      .click()

    // Verifica se mensagem de confirmação aparece
    cy.contains('Os dados foram alterados com sucesso.')
      .should('be.visible')
  })
})
