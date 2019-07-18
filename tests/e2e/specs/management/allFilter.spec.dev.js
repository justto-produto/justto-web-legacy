const login = Cypress.env('email6')
const password = Cypress.env('password6')

describe('Justto.App - Com Interação: Filtro Todos', function () {
  beforeEach(function () {
    // Acessa a página inicial do Justto.App
    // cy.visit('http://homol.justto.com.br')
    cy.visit('localhost:8080')

    // Sistema deve redirecionar para a página de Login
    cy.url().should('include', '/#/login')

    // Preenche o campo 'Email'
    cy.get('[data-testid=login-email]')
      .type(login)
      .should('have.value', login)

      // Preenche o campo 'Senha'
    cy.get('[data-testid=login-password]')
      .type(password)
      .should('have.value', password)

      // Clica no botão "Entrar"
    cy.get('[data-testid=submit]')
      .click()

      // Verifica se tela acessada é a de "Gerenciamento"
    cy.url().should('include', '/#/management')
  })

  it('Gerenciamento: Todos - Exibição dos Casos', function () {
    // Seleciona a aba "Todos"
    cy.get('.el-tabs__nav > #tab-3').should('be.visible').click({force: true})

    // Seleciona botão 'Filtrar'
    cy.get('[data-testid=management-filterbtn]').click()

    // Seleciona Campanha
    cy.get('[data-testid=filter-campaign]')
      .click()
      .trigger('keydown', { keyCode: 40, Which: 40 }) // Pressiona seta para baixo
      .trigger('keydown', { keyCode: 40, Which: 40 }) // Pressiona seta para baixo
      .trigger('keydown', { keyCode: 13, Which: 13 }) // Pressiona Enter

    cy.wait(5000)

    // Seleciona Estratégia
    cy.get('[data-testid=filter-strategy]')
      .click()
      .trigger('keydown', { keyCode: 40, Which: 40 })
      .trigger('keydown', { keyCode: 13, Which: 13 })

      // Seleciona Disputas Favoritas
    cy.get('[data-testid=filters-favorite]').click()

    // Seleciona o botão "Aplicar filtros"
    cy.get('[data-testid=filter-applyfilter]').click()

    // Verifica se existem casos exibidos
    cy.get('tbody>tr').first().should('be.visible')
  })

  it('Gerenciamento: Todos - Exibição dos Casos - Vazio', function () {
    // Seleciona a aba "Todos"
    cy.get('.el-tabs__nav > #tab-3').should('be.visible').click({force: true})

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

      // Seleciona Disputas Favoritas
    cy.get('[data-testid=filters-favorite]').click()

    // Seleciona o botão "Aplicar filtros"
    cy.get('[data-testid=filter-applyfilter]').click()

    // Verifica se mensagem "Não foram encontradas disputas" é exibida
    cy.contains('Não foram encontradas disputas')
      .should('be.visible')
  })
})
