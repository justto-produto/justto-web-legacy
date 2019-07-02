describe('Justto.App - Gerenciamento', function () {
    beforeEach(function () {
        // Acessa a página inicial do Justto.App
        // cy.visit('http://homol.justto.com.br')
        cy.visit('localhost:8080')

        // Sistema deve redirecionar para a página de Login
        cy.url().should('include', '/#/login')

        // Preenche o campo 'Email'
        cy.get('[data-testid=login-email]')
            .type('dake@emailay.com')
            .should('have.value', 'dake@emailay.com')

        // Preenche o campo 'Senha'
        cy.get('[data-testid=login-password]')
            .type('password')
            .should('have.value', 'password')

        // Clica no botão "Entrar"
        cy.get('[data-testid=submit]')
            .click()

        // Valida se primeira página acessada é a do Onboarding
        cy.url().should('include', '/#/onboarding')
    }
})
