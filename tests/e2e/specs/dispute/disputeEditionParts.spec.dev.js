const login = Cypress.env('email1')
const password = Cypress.env('password1')

describe('Justto.App - Disputa: Edição do Caso', function () {
  beforeEach('Login', function () {
    // Acessa a página inicial do Justto.App
    cy.visit('/')

    // Verifica se link redirecionado é o 'Login'
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

    // Seleciona a aba "Todos"
    cy.get('.el-tabs__nav > #tab-3')
      .contains('Todos')
      .click({force: true})

    // Entra na disputa
    cy.get('[data-testid=dispute-index] tbody > tr.el-table__row').first()
      .click()

    // Sistema deve redirecionar para a página de Registro
    cy.url().should('include', '/#/management/dispute/')
  })



  it('Clica no botão para expandir o card', function () {
    // Clica no nome para expandir o card
    cy.get('[data-testid=expand-party]').first()
      .click()

    // Clica no botão de 'Editar'
    cy.get('[data-testid=edit-part]').first()
      .click()

    // Verifica se todos os 'spans' aparecem
    cy.get('span')
      .should('be.visible')
      
    // Preenche o Campo de 'E-mail'
    cy.get('[data-testid=input-email]')
      .type('testes@testes.com')

    // Clica no botão de '+'
    cy.get('[data-testid=add-email]')
      .click()

    // Verifica se o email inserido aparece
    cy.contains('testes@testes.com')
      .should('to.exist')

    // Verifica se o botão 'Editar dados' é visível e clica
    cy.get('[data-testid=edit-data-part]')
      .should('be.visible')
      .click()

    // Verifica se mensagem de confirmação aparece
    cy.contains('Os dados foram alterados com sucesso.')
      .should('be.visible')
  })
})
