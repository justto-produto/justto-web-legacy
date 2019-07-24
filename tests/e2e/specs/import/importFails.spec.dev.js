const login = Cypress.env('email2')
const password = Cypress.env('password2')
const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const fileInput = 'input[type=file]'

describe('Justto.App - Importação de planilha: Erros', function() {
    // beforeEach(function () {
        it('Login: Sucesso', function() {
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

            // Valida se acesso foi feito
            cy.url().should('include', '/#/management')
        })
    // })
    it('Importa planilha modelo: Planilha inválida', function() {
        // Acessa a tela de gerenciamento
        cy.get('[data-testid=menu-import]').click()
        // Sistema deve redirecionar para a página de Importação
        cy.url().should('include', '/#/import')

        // Importa arquivo
        cy.upload_file('PLANINHA_EMPTY_FILE_TEST.xlsx', fileType, fileInput)

        // Deve mostrar erro de arquivo inválido
        cy.contains('Arquivo vazio ou fora do formato padrão. Verifique o seu conteúdo e tente novamente.').should('be.visible')
    })

    it('Importa planilha modelo: Arquivo pesado', function() {
        // Acessa a tela de gerenciamento
        cy.get('[data-testid=menu-import]').click()
        // Sistema deve redirecionar para a página de Importação
        cy.url().should('include', '/#/import')

        // Importa arquivo
        cy.upload_file('ss20mb.xlsx', fileType, fileInput)

        // Deve mostrar erro de arquivo inválido
        cy.contains('Arquivo não pode ultrapassar 20MB.').should('be.visible')
    })

    it('Importa planilha modelo: Formato inválido', function() {

        // Acessa a tela de gerenciamento
        cy.get('[data-testid=menu-import]').click()
        // Sistema deve redirecionar para a página de Importação
        cy.url().should('include', '/#/import')

        // Importa arquivo
        cy.upload_file('CERTAMENTE_NAO_E_UMA_PLANILHA.jpeg', fileType, fileInput)

        // Deve mostrar erro de arquivo inválido
        cy.contains('Arquivo em formato inválido.').should('be.visible')
    })
})
