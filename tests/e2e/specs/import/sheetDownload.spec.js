const login = Cypress.env('email2')
const password = Cypress.env('password2')

describe('Justto.App - Planilha Modelo', function () {
  beforeEach(function () {
      // Acessa a página inicial do Justto.App
      // cy.visit('http://homol.justto.com.br')
      cy.visit('localhost:8080')

      // Sistema deve redirecionar para a página de Login
      cy.url().should('include', '/#/login')

      // Preenche o campo 'Email'
      cy.get('[data-testid="login-email"]')
        .type(login)
        .should('have.value', login)

      // Preenche o campo 'Senha'
      cy.get('[data-testid="login-password"]')
        .type(password)
        .should('have.value', password)

      // Clica no botão "Entrar"
      cy.get('[data-testid="submit"]').click()

      // Valida se acesso foi feito - Primeira tela de login
      cy.url().should('include', '/#/management')
  })

  it('Planilha modelo Disponível: Sucesso', function () {
    // Verifica se link está disponível
    cy.request('localhost:8080/Planilha-Modelo-Justto.xlsx')
  })

  it('Baixa Planilha Modelo: Sucesso', function () {
    // Acessa a tela de gerenciamento
    cy.get('[data-testid=menu-import]').click()
    // Sistema deve redirecionar para a página de Importação
    cy.url().should('include', '/#/import')
    // verifica se o botão está visível
    cy.get('[data-testid=download-model]')
      .should('be.visible')
      .click()
  })
})
