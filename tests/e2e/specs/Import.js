describe('Justto.App - Planilha Modelo', function() {

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

    it('Historico de Importações: Vazio', function() {
        // Acessa a tela de gerenciamento
        cy.get('[data-testid=menu-import]').click()

        // Sistema deve redirecionar para a página de Importação
        cy.url().should('include', '/#/import')

        // Verifica se Histórico de Importações esta vazio
        cy.get('[data-testid=empty-history]')
            .contains('Aqui você encontra o registro de importações no sistema. Por enquanto, você não possui importações.')
            .should('be.visible')
    })

    it('Baixa Planilha Modelo: Sucesso', function() {
        // verifica se o botão está visível
        cy.get('[data-testid=download-model]')
            .should('be.visible')
            .click()
    })

    it('Planilha modelo Disponível: Sucesso', function() {
        // Verifica se link está disponível
        cy.request('localhost:8080/Planilha-Modelo-Justto.xlsx')
    })

    it('Importa planilha modelo: Sucesso', function() {
        const fileName = 'Planilha-Modelo-Justto.xlsx'
        // const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        // const fileInput = 'input[type=file]'

        cy.fixture(fileName).then(fileContent => {
          cy.get('input[type=file]').upload(
            { fileContent, fileName, mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
            { subjectType: 'input' }
          )
        })

    })
    // it('Historico de Importações: Sucesso', function() {
    //     // Verifica se card de planilha importada está visivel
    //     cy.get('[data-testid=imported-download]')
    //         .should('be.visible')
    //
    //     cy.get('[data-testid=imported-download]')
    //         .click()
    // })
})
