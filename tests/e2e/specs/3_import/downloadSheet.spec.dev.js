const login = Cypress.env('empty-account-email')
const password = Cypress.env('default-password')

describe('Justto.App - Planilha Modelo', function() {
  it('Planilha modelo Disponível: Sucesso', function() {
    // Acessa a página inicial do Justto.App
    // cy.visit('http://homol.justto.com.br')
    cy.visit('/')

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
    cy.get('[data-testid="submit"]')
      .click()

    // Valida se acesso foi feito - Primeira tela de login
    cy.url().should('include', '/#/management')

    // Espera carregamento
    cy.wait(1000)

    // Acessa a tela de gerenciamento
    cy.get('[data-testid=menu-import]')
      .click({ force: true })
    // Sistema deve redirecionar para a página de Importação
    cy.url().should('include', '/#/import')

    // verifica se o botão está visível
    cy.get('[data-testid=download-model]')
      .should('be.visible')
      .contains('Baixe a planilha modelo clicando aqui')

    // Verifica se link está disponível
    cy.request('/Planilha-Modelo-Justto.xlsx')
  })
})
