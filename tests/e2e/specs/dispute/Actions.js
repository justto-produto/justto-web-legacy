describe('Justto.App - Disputa: Ações', function () {

    it('Login', function () {
        // Acessa a página inicial do Justto.App
        // cy.visit('http://homol.justto.com.br')
        cy.visit('localhost:8080')

        // Redireciona para 'Login'
        cy.url().should('include', '/#/login')

        // Preenche o campo 'Email'
        cy.get('[data-testid=login-email]')
            .type('dubu@voemail.com')
            .should('have.value', 'dubu@voemail.com')

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

    it('Ação: Ganhar', function () {

        // Clica em Ganhar
        cy.get('[data-testid=settled]')
            .click()

    })

    it('Ação: Perder', function () {

        // Clica em Perder
        cy.get('[data-testid=unsettled]')
            .click()

    })


    it('Ação: Pausar', function () {

        // Clica em Pausar
        cy.get('[data-testid=paused]')
            .click()

    })

    it('Ação: Pausar', function () {

        // Clica em Retomar
        cy.get('[data-testid=resume')
            .click()

    })

    it('Ação: Reiniciar Engajamento', function () {

        // VClica em Reiniciar Engajamento
        cy.get('[data-testid=restart-engagement]')
            .click()

    })

    it('Ação: Favoritar', function () {

        // Favorita/disfavorita caso
        cy.get('[data-testid=favorite]')
            .click()

    })
    
    it('Ação: Remover', function () {

        // Clica em Remover
        cy.get('[data-testid=remove]')
            .click()

    })
})
