const login = Cypress.env('email2')
const password = Cypress.env('password2')
const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const fileInput = 'input[type=file]'

describe('Justto.App - Importação de planilha: Erros', function() {
  beforeEach(function () {
    cy.visit('localhost:8080')
    cy.url().should('include', '/#/login')
    cy.get('[data-testid="login-email"]')
        .type(login)
        .should('have.value', login)
    cy.get('[data-testid="login-password"]')
        .type(password)
        .should('have.value', password)
    cy.get('[data-testid="submit"]').click()
    cy.url().should('include', '/#/management')
    cy.get('[data-testid=menu-import]').click()
    cy.url().should('include', '/#/import')
  })
  it('Importa planilha modelo: Planilha inválida', function() {
    cy.upload_file('PLANINHA_EMPTY_FILE_TEST.xlsx', fileType, fileInput)
    cy.contains('Arquivo vazio ou fora do formato padrão. Verifique o seu conteúdo e tente novamente.').should('be.visible')
  })

  it('Importa planilha modelo: Arquivo pesado', function() {
    cy.upload_file('ss20mb.xlsx', fileType, fileInput)
    cy.contains('Arquivo não pode ultrapassar 20MB.').should('be.visible')
  })
  it('Importa planilha modelo: Formato inválido', function() {
    cy.upload_file('CERTAMENTE_NAO_E_UMA_PLANILHA.jpeg', fileType, fileInput)
    cy.contains('Arquivo em formato inválido.').should('be.visible')
  })
})
