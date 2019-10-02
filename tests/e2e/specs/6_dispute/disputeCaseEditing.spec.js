// const login = Cypress.env('import-actions-email')
// const password = Cypress.env('default-password')
const login = 'lucas@justto.com.br'
const password = '123456'

describe('Justto.App - Disputa: Edição do Caso', function () {
  it('Login', function () {
    // Acessa a página inicial do Justto.App
    cy.visit('/#/login')

    // Redireciona para 'Login'
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

  it('Entra na disputa', function () {
    // Entra na aba 'Todos'
    cy.get('.el-tabs__nav > #tab-3')
      .contains('Todos')
      .click({ force: true })

    // clica no primeiro caso: index 0
    cy.get('[data-testid=dispute-index] tbody > tr.el-table__row', { timeout: 60000 }).first()
      .click({ force: true })

    // Clica no botão "Editar"
    cy.get('[data-testid=edit-dispute]')
    .click()
  })


  it('Altera dados e confirma a edição', function () {
    // Preenche o Campo de 'Descrição'
    cy.get('[data-testid=description]')
      .type(' Descrição de testes')

    // Verifica se o botão 'Editar dados' é visível e clica
    cy.get('[data-testid=confirm-edit-data]')
      .should('be.visible')
      .click()

    cy.get('.edit-case-confirm')
      .contains('As novas informações vão sobrescrever as antigas.')


    // Verifica se mensagem de confirmação aparece
    cy.get('.el-notification.success', { timeout: 60000 })
      .contains('Os dados foram alterados com sucesso.')
      .should('be.visible')
  })
})
