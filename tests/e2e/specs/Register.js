describe('Justto.App - Register', function() {
    it('Registro: Sucesso', function() {
        // Acessa a página inicial do Justto.App
        //cy.visit('http://homol.justto.com.br')
        cy.visit('localhost:8080')

        // Acessa a página de registro
        cy.get('[data-testid=register]').click()

        // Sistema deve redirecionar para a página de Registro
        cy.url().should('include', '/#/register')

        // Preenche o campo 'Nome'
        cy.get('[data-testid=register-name]')
            .type('Um Nome')
            .should('have.value', 'Um Nome')

        function randomEmail(range) {
            var allLetters = '0123456789abcdefghiklmnopqrstuvwxyz';
            var randomName = '';
            for (var i = 0; i < range; i++) {
              var randomNumber = Math.floor(Math.random() * allLetters.length);
              randomName += allLetters.substring(randomNumber, randomNumber + 1);
            }
            var randomEmail = randomName + '@teste2e.com'
            return randomEmail;
        }

        // Preenche o campo 'Email'
        cy.get('[data-testid=register-email]')
            .type(randomEmail(20))
            // .should('have.value', 'this.randomEmail')

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

    it('Registro: Email já Existente', function() {
        // Acessa a página de login
        cy.visit('localhost:8080')

        // Acessa a página de registro
        cy.get('[data-testid=register]').click()

        // Sistema deve redirecionar para a página de Registro
        cy.url().should('include', '/#/register')

        // Preenche o campo 'Nome'
        cy.get('[data-testid=register-name]')
            .type('Um Nome')
            .should('have.value', 'Um Nome')

        // Preenche   campo 'Email' com email não existente
        cy.get('[data-testid=register-email]')
            .type('gugo@eyeemail.com')
            .should('have.value', 'gugo@eyeemail.com')

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
