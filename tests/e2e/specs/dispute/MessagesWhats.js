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

    // it('Envio de Whatsapp: Não Sincronizado', function () {
    // })

    it('Envio de Whatsapp: Desconectado', function () {
        // Entra na primeira disputa da lista
        cy.wait(2000)
        cy.get('[data-testid=dispute-index]').eq(0)
            .click()
        // Seleciona primeira parte do caso
        cy.get('[data-testid=party]').eq(0)
            .click()
        // Seleciona Whatsapp
        cy.get('[data-testid=select-whatsapp]')
            .click()
        // Input deve estar desabilitado
        cy.get('[data-testid=submit-whats-disable]')
            .should('be.disabled')
    })

    // it('Envio de Whatsapp: Sucesso', function () {
    // })
})
