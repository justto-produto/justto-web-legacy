const login = Cypress.env('import-actions-email')
const password = Cypress.env('default-password')
const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
const fileInput = 'input[type=file]'

describe('Justto.App - Planilha Modelo', function() {
  beforeEach(function() {
    // Acessa a página inicial do Justto.App
    cy.visit('/')

    // Sistema deve redirecionar para a página de Login
    cy.url().should('include', '/#/login')

    // Preenche o campo 'Email'
    cy.get('[data-testid="login-email"]')
      .type(login)
      .should('have.value', login)

    // Preenche o campo 'Senha'
    cy.get('[data-testid="login-password"]')
      .type(password)
      .should('have.value', password)

    // Clica no botão "Entrar"
    cy.get('[data-testid="submit"]')
      .click()

    // Espera carregamento
    cy.wait(1000)
  })

  // IMPORTA PLANILHA
  it('Importa planilha modelo: Falha', function() {
    // Acessa a tela de gerenciamento
    cy.get('[data-testid=menu-import]')
      .click()

    // Sistema deve redirecionar para a página de Importação
    cy.url().should('include', '/#/import')

    // Espera carregamento
    cy.wait(1000)

    // Importa arquivo
    cy.upload_file('Varios_Casos_Aleatorios.xlsx', fileType, fileInput)

    // Acavça para proximo passo
    cy.get('[data-testid=submit]')
      .click()

    // Sstema deve redirecionar para a página de Nova Importação
    cy.url().should('include', '/new')

    // Verifica se aparecem os números de linha da planilha importada
    cy.get('[data-testid=import-checklines]')
      .should('be.visible')

    // Avança para proximo passo
    cy.get('[data-testid=submit]')
      .click()

    // Verifica se as colunas foram recebidas e estão visiveis
    cy.get('[data-testid=import-columns]')
      .should('not.have.class', '.el-tag--dropzone-active')
      .should('be.visible')

    // Verifica se as tags foram recebidas e estão visiveis
    cy.get('[data-testid=import-tags]')
      .should('be.visible')

    cy.get('.file-column>.el-tag')
      .should('be.visible')
      // .should('have.css', 'background-color', 'rgb(148, 97, 247)')

    // Apaga tag mapeada
    // cy.get('.columns-step .el-tag__close')
    //   .click()

    // Arrasta tags para colunas
    // cy.get('.el-tag--drag:nth-child(1)').drag('.file-column:nth-child(1) .el-tag--dropzone')

    // Avança apara proximo passo
    cy.get('[data-testid=submit]')
      .click()

    // Verifica se configurações da campanha estão visiveis
    cy.get('[data-testid=import-feedback]')
      .should('be.visible')

    // Preenche campo 'Nome do Reu'
    cy.get('[data-testid=feedback-respondent]')
      // .clear().type('Teste')
      .should('not.have.value', '')

    // Preenche o campo 'Nome da Campanna'
    cy.get('[data-testid=feedback-campaignName]')
      .clear()
      .should('have.value', '')

    // Seleciona  uma estratégia
    cy.get('[data-testid=feedback-strategy]')
      .should('have.value', '')
    //   .click()
    // .trigger('keydown', { keyCode: 40, Which: 40 }) // Pressiona seta para baixo
    // .trigger('keydown', { keyCode: 13, Which: 13 }) // Pressiona Enter
    // cy.get('.el-select-dropdown__list')
    //   .contains('TRABALHISTA -  COM ADVOGADO')
    //   .click({ force: true })

    // Seleciona uma data limite
    cy.get('[data-testid=feedback-datapicker]')
      .should('have.value', '')
    //   .click()
    //   .trigger('keydown', { keyCode: 39, Which: 39 }) // Pressiona seta direita
    //   .trigger('keydown', { keyCode: 13, Which: 13 }) // Pressiona Enter

    // Seleciona um negociador
    cy.get('[data-testid=feedback-negotiators]')
      .should('have.value', '')
    //   .click()
    //   .trigger('keydown', { keyCode: 40, Which: 40 }) // Pressiona seta para baixo
    //   .trigger('keydown', { keyCode: 13, Which: 13 }) // Pressiona Enter
    //   .click()

    // Avança para proximo passo
    cy.get('[data-testid=start-negotiation]')
      .click()

    // Mensagem de erro deve aparecer
    cy.get('.el-notification.warning')
      .contains('Para prosseguir você deve configurar todos os campos')
  })

  // IMPORTA PLANILHA
  it('Importa planilha modelo: Sucesso', function() {
    // Acessa a tela de gerenciamento
    cy.get('[data-testid=menu-import]')
      .click()

    // Sistema deve redirecionar para a página de Importação
    cy.url().should('include', '/#/import')

    // Importa arquivo
    cy.upload_file('PLANILHA_TESTE-CASOS_REAIS.xlsx', fileType, fileInput)

    // Acavça para proximo passo
    cy.get('[data-testid=submit]')
      .click()

    // Sstema deve redirecionar para a página de Nova Importação
    cy.url().should('include', '/new')

    // Verifica se aparecem os números de linha da planilha importada
    cy.get('[data-testid=import-checklines]')
      .should('be.visible')

    // Avança para proximo passo
    cy.get('[data-testid=submit]')
      .click()

    // Verifica se as colunas foram recebidas e estão visiveis
    cy.get('[data-testid=import-columns]')
      .should('be.visible')

    // Verifica se as tags foram recebidas e estão visiveis
    cy.get('[data-testid=import-tags]')
      .should('be.visible')

    cy.get('.file-column>.el-tag')
      .should('have.css', 'background-color', 'rgb(148, 97, 247)')

    // Apaga tag mapeada
    // cy.get('.columns-step .el-tag__close')
    //   .click()

    // Arrasta tags para colunas
    // cy.get('.el-tag--drag:nth-child(1)').drag('.file-column:nth-child(1) .el-tag--dropzone')

    // Avança apara proximo passo
    cy.get('[data-testid=submit]')
      .click()

    // Verifica se configurações da campanha estão visiveis
    cy.get('[data-testid=import-feedback]')
      .should('be.visible')

    const campaings = ['Natura', 'Nestle', 'Garoto']

    campaings.forEach((campaing, index) => {
      // Preenche campo 'Nome do Reu'
      cy.get('[data-testid=feedback-respondent]').eq(index)
        .clear().type(campaing)
        .should('have.value', campaing)

      // Preenche o campo 'Nome da Campanna'
      cy.get('[data-testid=feedback-campaignName]').eq(index)
        .clear().type(campaing)
        .should('have.value', campaing)

      let strategy
      switch (index) {
        case 0: strategy = 'INDENIZATÓRIO - COM ADVOGADO (JEC, CíVEL)'
          break
        case 1: strategy = 'INDENIZATÓRIO - SEM ADVOGADO (PROCON, JEC)'
          break
        case 2: strategy = 'TRABALHISTA -  COM ADVOGADO'
          break
        default: strategy = 'NDENIZATÓRIO - COM ADVOGADO (JEC, CíVEL)'
      }

      // Seleciona  uma estratégia
      cy.get('[data-testid=feedback-strategy]').eq(index)
        .click()
      // .trigger('keydown', { keyCode: 40, Which: 40 }) // Pressiona seta para baixo
      // .trigger('keydown', { keyCode: 13, Which: 13 }) // Pressiona Enter
      cy.get('.el-select-dropdown__list')
        .contains(strategy)
        .click({ force: true })

      // Campo com data de pagamento deve estar visivel
      // cy.get('[data-testid=feedback-paymendate]')
      //   .should('be.visible')

      // Seleciona uma data limite
      cy.get('[data-testid=feedback-datapicker]').eq(index)
        .click()
        .trigger('keydown', { keyCode: 39, Which: 39 }) // Pressiona seta direita
        .trigger('keydown', { keyCode: 13, Which: 13 }) // Pressiona Enter

      // Seleciona um negociador
      cy.get('[data-testid=feedback-negotiators]').eq(index)
        .click()
        .trigger('keydown', { keyCode: 40, Which: 40 }) // Pressiona seta para baixo
        .trigger('keydown', { keyCode: 13, Which: 13 }) // Pressiona Enter
        .click()
    })

    // Avança para proximo passo
    cy.get('[data-testid=start-negotiation]')
      .click()

    // Aguarda tempo do loading e clica e Continuar
    cy.wait(10000)
    cy.get('[data-testid=submit]')
      .click()
  })
})
