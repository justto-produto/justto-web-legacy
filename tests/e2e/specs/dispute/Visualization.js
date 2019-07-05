describe('Justto.App - Disputa: Visualização', function () {
    // Acessa a página inicial do Justto.App
    // cy.visit('http://homol.justto.com.br')
    it('Login: Sucesso', function () {
        cy.visit('localhost:8080')

        // Redireciona para 'Login'
        cy.url().should('include', '/#/login')

        // Preenche o campo 'Email'
        cy.get('[data-testid=login-email]')
            .type('dubu@voemail.com')
            .should('have.value', '
            ')

        // Preenche o campo 'Senha'
        cy.get('[data-testid=login-password]')
            .type('password')
            .should('have.value', 'password')

        // Clica no botão "Entrar"
        cy.get('[data-testid=submit]')
            .click()

        // Verifica se tela acessada é a de "Gerenciamento"
        cy.url().should('include', '/#/management')
    })
    it('Disputa: Visualização', function () {
        // Seleciona e clica na Disputa
        cy.contains('#12705').click()

        // Sistema deve redirecionar para a página de Registro
        cy.url().should('include', '/#/management/dispute/')
    })

    it('Disputa: Resumo do Caso', function () {
        // Resumo da disputa deve estar visivel
        cy.get('[data-testid=dispute-summary]')
            .should('be.visible')
        cy.get('.el-loading-mask')
            .should('not.be.visible')
    })

    it('Disputa: Dados da Disputa', function () {
        // Dados da disputa devem estar visiveis
        cy.get('[data-testid=dispute-overview]')
            .should('be.visible')
        cy.get('.el-loading-mask')
            .should('not.be.visible')
    })

    it('Disputa: Mensagens', function () {
        // Dados da disputa devem estar visiveis
        cy.get('[data-testid=dispute-messages]')
            .should('be.visible')
        cy.get('.el-loading-mask')
            .should('not.be.visible')

    })
})
