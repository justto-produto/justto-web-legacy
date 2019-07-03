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
                .type('guilherme@justto.com.br')
                .should('have.value', 'guilherme@justto.com.br')

            // Preenche o campo 'Senha'
            cy.get('[data-testid="login-password"]')
                .type('tOOr13@$')
                .should('have.value', 'tOOr13@$')

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
        cy.wait(2000)

        // Deve mostrar erro de arquivo inválido
        cy.contains('Arquivo vazio ou fora do formato padrão. Verifique o seu conteúdo e tente novamente.')
    })

    it('Importa planilha modelo: Arquivo pesado', function() {
        // Acessa a tela de gerenciamento
        cy.get('[data-testid=menu-import]').click()
        // Sistema deve redirecionar para a página de Importação
        cy.url().should('include', '/#/import')

        // Importa arquivo
        cy.wait(5000)

        // Deve mostrar erro de arquivo inválido
        cy.contains('Arquivo não pode ultrapassar 20MB.')
    })

    it('Importa planilha modelo: Formato inválid', function() {

        // Acessa a tela de gerenciamento
        cy.get('[data-testid=menu-import]').click()
        // Sistema deve redirecionar para a página de Importação
        cy.url().should('include', '/#/import')

        // Importa arquivo
        cy.wait(5000)

        // Deve mostrar erro de arquivo inválido
        cy.contains('Arquivo em formato inválido.')
    })
})
