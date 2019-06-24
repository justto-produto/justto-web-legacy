describe('Account - Justto.App', function () {
    it('[C21] Cadastro realizado com sucesso', function () {
        cy.visit('localhost:8080')

        cy.url().should('include', '/#/login')

        cy.get('[data-testid="register"]')
            .click()

        cy.url().should('include', '/#/register')

        cy.get('[data-testid="register-name"]')
            .type('Teste')
            .should('have.value', 'Teste')

        cy.get('[data-testid="register-email"]')
            .type('email@teste.com')
            .should('have.value', 'email@teste.com')

        cy.get('[data-testid="register-password"]')
            .type('password')
            .should('have.value', 'password')

        cy.get('[data-testid="submit"]')
            //.should('have.value', 'Cadastrar')
            .click()

        cy.get('data-testid="showSucess')
    })

    it('[C23] Login: Esqueci a senha', function () {
        cy.visit('localhost:8080')

        cy.url().should('include', '/#/login')

        cy.get('[data-testid="forgot-password"]')
            .click()
        cy.url().should('include', '/#/forgot-password')

        cy.get('[data-testid="forgot-email"]')
            .type('email@teste.com')
            .should('have.value', 'email@teste.com')

        cy.get('[data-testid="submit"]')
            .click()

        cy.get('data-testid="showSucess')
    })

    it('[C18] Login realizado com sucesso', function() {
        cy.visit('localhost:8080')

        cy.url().should('include', '/#/login')

        cy.get('[data-testid="login-email"]')
            .type('vezoyelal@royalgifts.info')
            .should('have.value', 'vezoyelal@royalgifts.info')
        
        cy.get('[data-testid="login-password"]')
            .type('password')
            .should('have.value', 'password')
        
        cy.get('[data-testid="submit"]')
            .click()

        cy.url().should('include', '#/management')
    })

    it('[C19] Login: E-mail Invalido', function(){
        cy.visit('localhost:8080')

        cy.url().should('include', '/#/login')

        cy.get('[data-testid="login-email"]')
            .type("wrongmail@mail.com")
            .should('have.value', 'wrongmail@mail.com')
        
        cy.get('[data-testid="login-password"]')
            .type("wrongpassword")
            .should('have.value', 'wrongpassword')

        cy.get('[data-testid="submit"]')
            .click()

        cy.contains('E-mail não cadastrado ou senha incorreta.')
    })
})