const login = Cypress.env('email1')
const password = Cypress.env('password1')

describe('Justto.App - Com Interação: Visualização Com Interação', function () {
  it('Gerenciamento: Com Interação - Exibição dos Casos - Vazio', function () {
    // Acessa a página inicial do Justto.App
    cy.visit('/')

    // Sistema deve redirecionar para a página de Login
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

    // Seleciona a aba "Com Interação"
    cy.contains('Com Interação')
      .click({force: true})

    // Verifica se mensagem "Não foram encontradas disputas" é exibida
    cy.contains('Não foram encontradas disputas')
      .should('be.visible')
  })

  it('Gerenciamento: Com Interação - Exibição de Casos - Com casos', function () {
    // Acessa a página inicial do Justto.App
    cy.visit('/')

    // Sistema deve redirecionar para a página de Login
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

    // Seleciona a aba "Com Interação"
    cy.contains('Com Interação')
      .click({force: true})

    // Verifica se existem casos exibidos
    cy.get('tbody>tr').first()
      .should('be.visible')
  })
})
