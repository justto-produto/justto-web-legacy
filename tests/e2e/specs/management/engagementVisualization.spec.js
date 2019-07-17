const login = Cypress.env('email1')
const password = Cypress.env('password1')

describe('Justto.App - Gerenciamento: Visualização Engajamento', function () {
  it('Gerenciamento: Engajamento - Exibição dos Casos - Vazio', function () {
    // Acessa a página inicial do Justto.App
    cy.visit('/#/login')

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

    // Seleciona a aba "Engajamento"
    cy.contains('Engajamento').should('be.visible').click({force: true})

    // Verifica se mensagem "Não foram encontradas disputas" é exibida
    cy.contains('Não foram encontradas disputas')
      .should('be.visible')
  })

  it('Gerenciamento: Engajamento - Exibição de Casos - Com casos', function () {
    // Acessa a página inicial do Justto.App
    cy.visit(Cypress.env('BASE_URL'))

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

    // Seleciona a aba "Engajamento"
    cy.contains('Engajamento')
      .should('be.visible')
      .click({force: true})

    // // Verifica se existem casos exibidos  OBS: PRECISA DE LOGAR EM CONTA COM CASOS EM ENGAJAMENTO
    // cy.get('tbody>tr').eq(0)
    //   .should('be.visible')
  })
})
