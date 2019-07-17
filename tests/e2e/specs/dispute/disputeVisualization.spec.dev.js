const login = Cypress.env('email1')
const password = Cypress.env('password1')

describe('Justto.App - Disputa: Visualização', function () {
  beforeEach('Login', function () {
    // Acessa a página inicial do Justto.App
    cy.visit('https://' + Cypress.env('BASE_URL'))

    // Verifica se link redirecionado é o 'Login'
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

    // Seleciona a aba "Todos"
    cy.contains('Todos').click({force: true})

    // Entra na disputa
    cy.get('[data-testid=dispute-index]').eq(0)
      .click()

    // Sistema deve redirecionar para a página de Registro
    cy.url().should('include', '/#/management/dispute/')
  })

  it('Visualização da Disputa: Sucesso', function () {
    // Resumo da disputa deve estar visivel
    cy.get('[data-testid=dispute-summary]')
      .should('be.visible')

    // Dados da disputa devem estar visiveis
    cy.get('[data-testid=dispute-overview]')
      .should('be.visible')

    // Dados da disputa devem estar visiveis
    cy.get('[data-testid=dispute-messages]')
      .should('be.visible')

    // Loadings devem desaparecer
    cy.get('.el-loading-mask')
      .should('not.be.visible')

    // Expande uma parte da disputa
    cy.get('[data-testid=expand-party]').eq(0)
      .click()

    // Informações da disputa devem estar visiveis
    cy.get('.dispute-overview-view__info-line')
      .should('be.visible')

    // Informações do sumario devem estar visiveis
    cy.contains('CPF:').should('be.visible')
    cy.contains('Função:').should('be.visible')
  })
})
