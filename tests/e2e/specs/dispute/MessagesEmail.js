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

    it('Envio de Email: Parte não selecionada', function () {
        // Entra na primeira disputa da lista
        cy.wait(2000)
        cy.get('[data-testid=dispute-index]').eq(0)
            .click()
        // Caixa de texto deve estar desabilitada, mensagem deve aparecer no lugar.
        cy.get('[data-testid=unselected-party]')
            .contains('Escolha um destinatário ao lado')
    })


    it('Envia de Email: Sucesso', function () {
        // Entra na primeira disputa da lista
        cy.wait(2000)
        cy.get('[data-testid=dispute-index]').eq(0)
            .click()
        // Seleciona primeira parte do caso
        cy.get('[data-testid=party]').eq(0)
            .click()
        // Digita mensagem
        cy.get('[data-testid=input-message]')
            .type('Teste email 11')
            .should('have.text', 'Teste email 11')
        // Envia mensagem
        cy.get('[data-testid=submit-email]')
            .click()
        // Aguarda atualização
        cy.wait(5000)
        // Clica para visualizar ultima mensagem
        cy.get('[data-testid=show-email]')
            .last()
            .click()
        // Mensagem deve ser a enviada
        cy.get('[data-testid=email-dialog]')
            .contains('Teste email 11')
            .should('be.visible')
        // Fecha modal da mensagem
        cy.get('[data-testid=close-button]')
            .click()
        // Modal deve desaparecer
        cy.get('[data-testid=email-dialog]')
            .should('not.be.visible')
    })
})
