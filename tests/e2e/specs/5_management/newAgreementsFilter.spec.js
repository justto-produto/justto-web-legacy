const login = Cypress.env('import-actions-email')
const password = Cypress.env('default-password')

describe('Justto.App - Com Interação: Filtro Novos Acordos', function () {
  beforeEach(function () {
    // Acessa a página inicial do Justto.App
    // cy.visit('http://homol.justto.com.br')
    cy.visit('localhost:8080')

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

  it('Gerenciamento: Novos Acordos - Exibição dos Casos', function () {
    // Seleciona a aba "Proposta aceita"
    cy.get('.el-tabs__nav > #tab-2')
      .click({ force: true })
    // Verifica se existem casos exibidos
    cy.get('[class=el-table__body]').should('be.visible')
  })

  it('Gerenciamento: Novos Acordos - Exibição dos Casos - Vazio', function () {
    // Seleciona a aba "Proposta aceita"
    cy.get('.el-tabs__nav > #tab-2')
      .click({ force: true })
    // Verifica se mensagem "Não foram encontradas disputas" é exibida
    cy.contains('Não foram encontradas disputas')
      .should('be.visible')
  })
})
