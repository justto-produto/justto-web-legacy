describe('Justto.App - Gerenciamento: Filtro Engajamento', function () {
  beforeEach(function () {
    // Acessa a página inicial do Justto.App
    // cy.visit('http://homol.justto.com.br')
    cy.visit('localhost:8080')

    // Sistema deve redirecionar para a página de Login
    cy.url().should('include', '/#/login')

    // Preenche o campo 'Email'
    cy.get('[data-testid=login-email]')
      .type('graziele@justto.com.br')
      .should('have.value', 'graziele@justto.com.br')

    // Preenche o campo 'Senha'
    cy.get('[data-testid=login-password]')
      .type('batata123')
      .should('have.value', 'batata123')

    // Clica no botão "Entrar"
    cy.get('[data-testid=submit]')
      .click()

    // Verifica se tela acessada é a de "Gerenciamento"
    cy.url().should('include', '/#/management')
  })

  it('Gerenciamento: Engajamento - Exibição dos Casos', function () {
    // Seleciona a aba "Engajamento"
    cy.contains('Engajamento').should('be.visible').click()

    // Seleciona botão 'Filtrar'
    cy.get('[data-testid=management-filterbtn]').click()

    // Seleciona Campanha
    cy.get('[data-testid=filter-campaign]')
      .click()
      .trigger('keydown', { keyCode: 40, Which: 40 }) // Pressiona seta para baixo
      .trigger('keydown', { keyCode: 40, Which: 40 }) // Pressiona seta para baixo
      .trigger('keydown', { keyCode: 13, Which: 13 }) // Pressiona Enter

    // Seleciona Estratégia
    cy.get('[data-testid=filter-strategy]')
      .click()
      .trigger('keydown', { keyCode: 40, Which: 40 })
      .trigger('keydown', { keyCode: 13, Which: 13 })

    // Seleciona Disputas Favoritas
    cy.get('[data-testid=filters-favorite]').click()

    // // Seleciona datepicker 'Fim da Negociação'
    // cy.get('[data-testid=filters-disputeexpirationdate]')
    //   .click()
    //   .trigger('keydown', { keyCode: 40, Which: 40 }) // Pressiona seta para baixo (3x)
    //   .trigger('keydown', { keyCode: 40, Which: 40 })
    //   .trigger('keydown', { keyCode: 40, Which: 40 })
    //   .trigger('keydown', { keyCode: 13, Which: 13 }) // Pressiona Enter

    // Seleciona o botão "Aplicar filtros"
    cy.get('[data-testid=filter-applyfilter]').click()

    // Verifica se existem casos exibidos
    cy.get('[class=el-table__body]').should('be.visible')
  })

  it('Gerenciamento: Engajamento - Exibição dos Casos - Vazio', function () {
    // Seleciona a aba "Engajamento"
    cy.contains('Engajamento').should('be.visible').click()

    // Seleciona botão 'Filtrar'
    cy.get('[data-testid=management-filterbtn]').click()

    // Seleciona Campanha
    cy.get('[data-testid=filter-campaign]')
      .click()
      .trigger('keydown', { keyCode: 40, Which: 40 }) // Pressiona seta para baixo
      .trigger('keydown', { keyCode: 13, Which: 13 }) // Pressiona Enter

    // Seleciona Estratégia
    cy.get('[data-testid=filter-strategy]')
      .click()
      .trigger('keydown', { keyCode: 40, Which: 40 })
      .trigger('keydown', { keyCode: 40, Which: 40 })
      .trigger('keydown', { keyCode: 13, Which: 13 })

    // Seleciona o botão "Aplicar filtros"
    cy.get('[data-testid=filter-applyfilter]').click()

    // Verifica se mensagem "Não foram encontradas disputas" é exibida
    cy.contains('Não foram encontradas disputas')
      .should('be.visible')
  })
})
