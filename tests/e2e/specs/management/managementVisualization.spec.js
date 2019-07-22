const login = Cypress.env('email1')
const password = Cypress.env('password1')

describe('Justto.App - Visualização de Gerenciamento', function () {
  beforeEach(function () {
    // Acessa a página inicial do Justto.App
    // cy.visit('http://homol.justto.com.br')
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
  })

  it('Exibição dos Casos - Vazio', function () {
    // Verifica se ícone está visivel
    cy.get('[data-testid=cases-empty-icon]')
      .should('be.visible')

    // Verifica se mensagem "Não foram encontradas disputas" é exibida
    cy.get('[data-testid=cases-empty-text]')
      .contains('Não foram encontradas disputas')
      .should('be.visible')
  })

  it('Exibição de Casos - Com casos', function () {
    // Seleciona a aba "Todos"
    cy.get('.el-tabs__nav > #tab-3')
      .click({force: true})

    // Verifica se existem casos exibidos
    cy.get('[data-testid=dispute-index] tbody > tr.el-table__row')
      .should('be.visible')
  })
})
