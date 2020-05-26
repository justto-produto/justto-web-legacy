const login = Cypress.env('default-email')
const password = Cypress.env('default-password')
const workspace = Cypress.env('default-workspace')
const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
const fileInput = 'input[type=file]'

describe('Justto.App - Importação de planilha: Erros', function() {
  beforeEach(function() {
    // Acessa a página inicial do Justto.App
    cy.visit('/')
    cy.login(login, password, workspace)

    // Espera carregamento
    cy.wait(1000)

    // Abre a página de importação
    cy.get('[data-testid=menu-import]')
      .click()

    // Abre modal de upload
    cy.get('[data-testid=upload-button]')
      .click()

    // Valida se acesso foi feito
    cy.url().should('include', '/#/import')
  })

  it('Importa planilha modelo: Planilha inválida', function() {
    // Importa planilha
    cy.upload_file('PLANINHA_EMPTY_FILE_TEST.xlsx', fileType, fileInput)

    // Valida se mensagem de erro aparece
    cy.contains('Arquivo vazio ou fora do formato padrão. Verifique o seu conteúdo e tente novamente.')
  })

  it('Importa planilha modelo: Arquivo pesado', function() {
    // Importa planilha
    cy.upload_file('ss20mb.xlsx', fileType, fileInput)

    // Valida se mensagem de erro aparece
    cy.contains('Arquivo não pode ultrapassar 20MB.')
  })

  it('Importa planilha modelo: Formato inválido', function() {
    // Importa planilha
    cy.upload_file('CERTAMENTE_NAO_E_UMA_PLANILHA.jpeg', fileType, fileInput)

    // Valida se mensagem de erro aparece
    cy.contains('Arquivo em formato inválido.')
  })
})
