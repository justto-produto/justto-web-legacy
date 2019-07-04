
  // it('Importa planilha modelo: Sucesso', function () {
  //   const fileName = 'Planilha-Modelo-Justto.xlsx'
  //   // const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  //   // const fileInput = 'input[type=file]'
  //
  //   cy.fixture(fileName).then(fileContent => {
  //     cy.get('input[type=file]').upload(
  //       { fileContent, fileName, mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
  //       { subjectType: 'input' }
  //     )
  //   })
  // })

describe('Justto.App - Planilha Modelo', function() {
    // beforeEach(function () {
        it('Login: Sucesso', function() {
            // Acessa a página inicial do Justto.App
            // cy.visit('http://homol.justto.com.br')
            cy.visit('localhost:8080')

            // Sistema deve redirecionar para a página de Login
            cy.url().should('include', '/#/login')

            // Preenche o campo 'Email'
            cy.get('[data-testid="login-email"]')
                .type('guilherme@justto.com.br')
                .should('have.value', 'guilherme@justto.com.br')

            // Preenche o campo 'Senha'
            cy.get('[data-testid="login-password"]')
                .type('tOOr13@$')
                .should('have.value', 'tOOr13@$')

            // Clica no botão "Entrar"
            cy.get('[data-testid="submit"]').click()

            // Valida se acesso foi feito
            cy.url().should('include', '/#/management')
        })
    // })

    // IMPORTA PLANILHA ===========================================
    it('Importa planilha modelo: Sucesso', function() {

        // Acessa a tela de gerenciamento
        cy.get('[data-testid=menu-import]').click()
        // Sistema deve redirecionar para a página de Importação
        cy.url().should('include', '/#/import')

        // Importa arquivo
        cy.wait(10000)

        // Acavça para proximo passo
        cy.get('[data-testid=submit]').click()

        // Sstema deve redirecionar para a página de Nova Importação
        cy.url().should('include', '/new')

        // Verifica se aparecem os números de linha da planilha importada
        cy.get('[data-testid=import-checklines]')
            .should('be.visible')

        // Avança para proximo passo
        cy.get('[data-testid=submit]').click()

        // Verifica se as colunas foram recebidas e estão visiveis
        cy.get('[data-testid=import-columns]').should('be.visible')

        // Verifica se as tags foram recebidas e estão visiveis
        cy.get('[data-testid=import-tags]').should('be.visible')


        // Avança apara proximo passo
        cy.get('[data-testid=submit]').click()

        // Verifica se configurações da campanha estão visiveis
        cy.get('[data-testid=import-feedback]').should('be.visible')

        // Preenche campo 'Nome do Reu'
        cy.get('[data-testid=feedback-respondent]')
            .type('Campanha Teste')
            .should('have.value', 'Campanha Teste')

        // Preenche o campo 'Nome da Campanna'
        cy.get('[data-testid=feedback-campaignName]')
            .should('have.value', 'Campanha Teste')
            .clear().type('Teste Campanha')
            .should('have.value', 'Teste Campanha')

        // Seleciona  uma estratégia
        cy.get('[data-testid=feedback-strategy]')
            .click()
            .trigger('keydown', {keyCode: 40, Which: 40}) // Pressiona seta para baixo
            .trigger('keydown', {keyCode: 13, Which: 13}) // Pressiona Enter

        // Campo com cata de pagamento dee estar visivel
        cy.get('[data-testid=feedback-paymendate]').should('be.visible')

        // Seleciona uma data limite
        cy.get('[data-testid=feedback-datapicker]')
            .click()
            .trigger('keydown', {keyCode: 40, Which: 40}) // Pressiona seta para baixo (3x)
            .trigger('keydown', {keyCode: 40, Which: 40})
            .trigger('keydown', {keyCode: 40, Which: 40})
            .trigger('keydown', {keyCode: 13, Which: 13}) // Pressiona Enter

        // Seleciona um negociador
        cy.get('[data-testid=feedback-negotiators]')
            .click()
            .trigger('keydown', {keyCode: 40, Which: 40}) // Pressiona seta para baixo (3x)
            .trigger('keydown', {keyCode: 13, Which: 13}) // Pressiona Enter
            .click()

        // Avança para proximo passo
        cy.get('[data-testid=start-negotiation]').click()

        // Aguarda tempo do loading e clica e Continuar
        cy.wait(10000)
        cy.get('[data-testid=submit]').click()
    })
})
