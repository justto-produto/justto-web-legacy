const login = Cypress.env('default-email')
const password = Cypress.env('default-password')
const workspace = Cypress.env('default-workspace')

describe('Justto.App - Planilha Modelo', function() {
  it('Planilha modelo Disponível: Sucesso', function() {
    // Acessa a página inicial do Justto.App
    cy.visit('/')
    cy.login(login, password, workspace)

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
      .contains('Baixar planilha modelo')

    // Verifica se link está disponível
    cy.request('/Planilha-Modelo-Justto.xlsx')
  })
})
