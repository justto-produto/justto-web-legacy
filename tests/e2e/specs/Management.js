describe('Management', function () {
    it('Engajamento: Exibição dos Casos Importados', function () {
        cy.visit('localhost:8080')

        cy.url().should('include', '/#/login')

        cy.get('[data-testid="login-email"]')
            .type('zozuyakip@royalhost.info')
            .should('have.value', 'zozuyakip@royalhost.info')

        cy.get('[data-testid="login-password"]')
            .type('password')
            .should('have.value', 'password')

        cy.get('[data-testid="submit"]')
            .click()

        cy.url().should('include', '#/management')

        cy.get('[id=tab-0]')
            .click()
    })
})