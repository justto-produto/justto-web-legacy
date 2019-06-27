describe('Justto.App - PlanilhaModelo', function () {

    it('Login: Sucesso', function () {
        // Acessa a página inicial do Justto.App
        cy.visit('http://homol.justto.com.br')
        // cy.visit('localhost:8080')

        // Sistema deve redirecionar para a página de Login
        cy.url().should('include', '/#/login')

        // Preenche o campo 'Email'
        cy.get('[name="login-email"]')
            .type('gugo@eyeemail.com')
            .should('have.value', 'gugo@eyeemail.com')

        // Preenche o campo 'Senha'
        cy.get('[name="login-password"]')
            .type('password')
            .should('have.value', 'password')

        // Clica no botão "Entrar"
        cy.get('[type="submit"]').click()

        cy.wait(5000)

        // Valida se acesso foi feito
        cy.url().should('include', '/#/management')
    })

    it('PlanilhaModelo: Sucesso', function () {

        // cy.visit('http://homol.justto.com.br')
        cy.visit('localhost:8080')

        // Sistema deve redirecionar para a página de Importação
        cy.url().should('include', '/#/import')

        //verifica se existe e se está visível
        // expect(spreadsheet).to.exist
        // expect($el).to.be.visible
        // expect($nonexistent).not.to.exist

        // verifica se o botão está visível
        cy.get('[data-testid=spreadsheet]').should('be.visible')

        // Clica no botão "Download da planilha"
        cy.get('[data-testid=spreadsheet]').click()

        // Valida se acesso foi feito
        cy.url().should('include', '/#/management')
    })
})