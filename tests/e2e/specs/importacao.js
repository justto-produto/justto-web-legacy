/// <reference types="Cypress" />

context('Actions', () => {
    beforeEach(() => {
        cy.visit('http://localhost:8082/')
    })

    it('CT2.1 - Listagem de Histórico de Importação: Possui Importações', () => {
        // Login
        cy.get('[name=login-email]')
            .type('henriquebmx@gmail.com')
        cy.get('[name=login-password]')
            .type('123456')
        cy.contains('Entrar').click()
        cy.wait(2000)
        // Select 'Importação de Casos' on menu
        cy.get('[name=import-menu-icon]')
            .click()
        cy.wait(2000)

        cy.contains('Ver casos')
        cy.screenshot('testevidence/import/CT2-1')
        cy.wait(2000)
    })

    it('CT2.2 - Listagem de Histórico de Importação: Não possui Importações', () => {
        // Login
        cy.get('[name=login-email]')
            .type('henriquebmx@gmail.com')
        cy.get('[name=login-password]')
            .type('123456')
        cy.contains('Entrar').click()
        cy.wait(2000)
        // Select 'Importação de Casos' on menu
        cy.get('[name=import-menu-icon]')
            .click()
        cy.wait(2000)
        // Select 'Importação de Casos' on menu
        cy.get('[name=import-menu-icon]')
            .click()
        cy.wait(2000)

        cy.contains('você não possui importações')
        cy.screenshot('testevidence/import/CT2-2')
        cy.wait(4000)
    })

    it('CT2.3 - Importaçao de Casos: Sucesso', () => {
        // Login
        cy.get('[name=login-email]')
            .type('henriquebmx@gmail.com')
        cy.get('[name=login-password]')
            .type('123456')
        cy.contains('Entrar').click()
        cy.wait(2000)
        // Select 'Importação de Casos' on menu
        cy.get('[name=import-menu-icon]')
            .click()
        cy.wait(2000)
        // Upload
        const fileName = ('planilha.xlsx')
        const fileType = ('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        const fileInput = ('input[type=file]')

        cy.upload_file(fileName, fileType, fileInput);
        cy.get('[class=el-upload el-upload--text]')
            .type('el-upload__input')
        cy.wait(4000)
    })

    it('CT2.4 - Importaçao de Casos: Falha', () => {
        // Login
        cy.get('[name=login-email]')
            .type('henriquebmx@gmail.com')
        cy.get('[name=login-password]')
            .type('123456')
        cy.contains('Entrar').click()
        cy.wait(2000)
        // Upload
        const fileName = ('planilha.xlsx')
        const fileType = ('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        const fileInput = ('input[type=file]')

        cy.upload_file(fileName, fileType, fileInput)
        cy.get('[class=el-upload__input]')
            .type('el-upload__input')
        cy.wait(4000)
    })

    it('CT2.5 - Mapeamento de Colunas', () => {

        cy.wait(4000)
    })

})