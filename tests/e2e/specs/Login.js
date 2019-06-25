describe('Justto.App - Login', function() {
    it('Login: Sucesso', function() {
        // Acessa a página inicial do Justto.App
        //cy.visit('http://homol.justto.com.br')
        cy.visit('localhost:8080')

        // Sistema deve redirecionar para a página de Login
        cy.url().should('include', '/#/login')

        // Preenche o campo 'Email'
        cy.get('[data-testid=login-email]')
            .type('gugo@eyeemail.com')
            .should('have.value', 'gugo@eyeemail.com')

        // Preenche o campo 'Senha'
        cy.get('[data-testid=login-password]')
            .type('password')
            .should('have.value', 'password')

        // Clica no botão "Entrar"
        cy.get('[data-testid=submit]')
            .click()

        cy.wait(5000)

        // Valida se acesso foi feito
        cy.url().should('include', '/#/management')
    })

    it('Login: Falha', function() {
        // Acessa a página de login
        cy.visit('localhost:8080')

        // Sistema deve redirecionar para a página de Login
        cy.url().should('include', '/#/login')

        // Preenche campo 'Email' com email não existente
        cy.get('[data-testid=login-email]')
            .type('email@invalido.com')
            .should('have.value', 'email@invalido.com')

        // Preenche o campo 'Senha'
        cy.get('[data-testid=login-password')
            .type('password')
            .should('have.value', 'password')

        // Clica no botão "Entrar"
        cy.get('[data-testid=submit]')
            .click()

        cy.wait(5000)

        // Valida se login falhou
        cy.url().should('include', '/#/login')

        // Verifica de menssagem de erro foi exibida
        cy.get('[data-testid=login-failure]').should('exist')
    })
  })
