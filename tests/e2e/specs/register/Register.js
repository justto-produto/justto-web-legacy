describe('Justto.App - Register', function () {
    it('Registro: Sucesso', function () {
        // Acessa a página inicial do Justto.App
        // cy.visit('http://homol.justto.com.br')
        cy.visit('localhost:8080')

        // Acessa a página de registro
        cy.get('[data-testid=register]').click()

        // Sistema deve redirecionar para a página de Registro
        cy.url().should('include', '/#/register')

        // Preenche o campo 'Nome'
        cy.get('[data-testid=register-name]')
            .type('Conta Teste')
            .should('have.value', 'Conta Teste')

        function randomEmail () {
            var randomEmail = new Date().getTime() + '@teste2e.com'
            return randomEmail
        }

        // Preenche o campo 'Email'
        cy.get('[data-testid=register-email]')
            .type(randomEmail())
            // .type('teste.onboarding@justto.com.br')
            // .should('have.value', 'teste.onboarding@justto.com.br')

        // Preenche o campo 'Senha'
        cy.get('[data-testid=register-password]')
            .type('password')
            .should('have.value', 'password')

        // Clica no botão "Entrar"
        cy.get('[data-testid=submit]')
            .click()

        // Valida se registro funcionou
        cy.get('[data-testid=register-success]')
            .should('be.visible')
        cy.get('[data-testid=register-success]')
            .contains('Cadastro realizado com sucesso! Acesse seu email para prosseguir.')
            .should('be.visible')
    })

    it('Registro: Sucesso', function () {
        // Acessa a página inicial do Justto.App
        // cy.visit('http://homol.justto.com.br')
        cy.visit('localhost:8080')

        // Acessa a página de registro
        cy.get('[data-testid=register]').click()

        // Sistema deve redirecionar para a página de Registro
        cy.url().should('include', '/#/register')

        // Preenche o campo 'Nome'
        cy.get('[data-testid=register-name]')
            .type('Conta Teste')
            .should('have.value', 'Conta Teste')

        function randomEmail () {
            var randomEmail = new Date().getTime() + '@teste2e.com'
            return randomEmail
        }

        // Preenche o campo 'Email'
        cy.get('[data-testid=register-email]')
            .type('email invalido')
            .should('have.value', 'email invalido')

        // Preenche o campo 'Senha'
        cy.get('[data-testid=register-password]')
            .type('password')
            .should('have.value', 'password')

        // Clica no botão "Entrar"
        cy.get('[data-testid=submit]')
            .click()

        // Valida se registro funcionou
        cy.contains('Insira um e-mail válido')
            .should('be.visible')
    })

    it('Registro: Email já Existente', function () {
        // Acessa a página de login
        cy.visit('localhost:8080')

        // Acessa a página de registro
        cy.get('[data-testid=register]').click()

        // Sistema deve redirecionar para a página de Registro
        cy.url().should('include', '/#/register')

        // Preenche o campo 'Nome'
        cy.get('[data-testid=register-name]')
          .type('Bruno Gatão')
          .should('have.value', 'Bruno Gatão')

        // Preenche   campo 'Email' com email não existente
        cy.get('[data-testid=register-email]')
          .type('bruno@justto.com.br.wks')
          .should('have.value', 'bruno@justto.com.br.wks')

        // Preenche o campo 'Senha'
        cy.get('[data-testid=register-password')
          .type('password')
          .should('have.value', 'password')

        // Clica no botão "Entrar"
        cy.get('[data-testid=submit]').click()

        // Valida se login falhou
        cy.url().should('include', '/#/register')

        // Verifica de menssagem de erro foi exibida
        cy.get('[data-testid=register-failure]')
          .should('be.visible')
    })
})
