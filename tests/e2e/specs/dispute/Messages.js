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
        cy.wait(2000)
        cy.get('[data-testid=dispute-index]').eq(0)
            .click()
    })

    it('Input inativo', function () {
      cy.get('[data-testid=unselected-party]')
          .contains('Escolha um destinatário ao lado')
    })

    it('Envia mensagem', function () {
        cy.get('[data-testid=party]').eq(0)
            .click()
        cy.get('[data-testid=input-message]')
            .type('Teste email 11')
        cy.get('[data-testid=submit-email]')
            .click()
    })

    it('Email está visivel', function () {
      cy.wait(5000)
      cy.get('[data-testid=show-email]')
          .last()
          .click()
      cy.get('[data-testid=email-dialog]')
          .contains('Teste email 11')
          .should('be.visible')
      cy.get('[data-testid=close-button]')
          .click()
      cy.get('[data-testid=email-dialog]')
          .should('not.be.visible')
    })
})
