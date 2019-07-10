describe('Justto.App - Disputa: Menssagens', function () {

    it('Login', function () {
        // Acessa a página inicial do Justto.App
        // cy.visit('http://homol.justto.com.br')
        cy.visit('localhost:8080')

        // Redireciona para 'Login'
        cy.url().should('include', '/#/login')

        // Preenche o campo 'Email'
        cy.get('[data-testid=login-email]')
            .type('lucas@justto.com.br')
            .should('have.value', 'lucas@justto.com.br')

        // Preenche o campo 'Senha'
        cy.get('[data-testid=login-password]')
            .type('123456')
            .should('have.value', '123456')

        // Clica no botão "Entrar"
        cy.get('[data-testid=submit]')
            .click()

        // Verifica se tela acessada é a de "Gerenciamento"
        cy.url().should('include', '/#/management')
    })

    it('Entra na disputa', function () {
      cy.contains('#5045').click()
    })
