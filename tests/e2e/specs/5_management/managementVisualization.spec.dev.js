const login = Cypress.env('import-actions-email')
const password = Cypress.env('default-password')

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

  it('Exibição de Casos - Com casos', function () {
    // Seleciona a aba "Todos"
    cy.get('.el-tabs__nav > #tab-3')
      .contains('Todos')
      .click({ force: true })

    // Verifica se existem casos exibidos
    cy.get('[data-testid=dispute-index] tbody > tr.el-table__row')
      .should('be.visible', { timeout: 60000 })

    cy.get('.el-table__expand-icon').first()
      .click()

      // Verifica se existem casos exibidos
    cy.get('tbody>tr').first()
      .should('be.visible')
  })
})
