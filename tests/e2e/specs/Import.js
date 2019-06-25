describe('Import - Justto.App', function () {
    it('[C34] Listagem do Histórico de Importação: Possui Importações', function () {
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

        cy.get('[data-testid="menu_import"]')
            .click()

        cy.url().should('include', '#/import')

        cy.get('[src="/img/ic-spreadsheet-xlsx.0f4dae2b.svg"]')
            .should('be.visible')
    })

    it('[C35] Listagem do Histórico de Importação: Não Possui Importações', function () {
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

        cy.get('[data-testid="menu_import"]')
            .click()

        cy.url().should('include', '#/import')

        cy.get('[data-testid="download_model"]')
            .should('be.visible')
    })

    // it('[C36] Importação de casos', function () {
    //     cy.visit('localhost:8080')

    //     cy.url().should('include', '/#/login')

    //     cy.get('[data-testid="login-email"]')
    //         .type('vezoyelal@royalgifts.info')
    //         .should('have.value', 'vezoyelal@royalgifts.info')

    //     cy.get('[data-testid="login-password"]')
    //         .type('password')
    //         .should('have.value', 'password')

    //     cy.get('[data-testid="submit"]')
    //         .click()

    //     cy.url().should('include', '#/management')

    //     cy.get('[data-testid="menu_import"]')
    //         .click()

    //     cy.url().should('include', '#/import')

    //     cy.get('[data-idtest="upload_sheet"]')
    //         .type('planilha-modelo.xlsx')
    // })
})