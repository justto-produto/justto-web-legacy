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
    cy.get('[data-testid=submit-login]')
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
    cy.get('[data-testid=bondary-input]')
      // .should('have.value', '')
      .clear().type('400000')
      .should('have.value', 'R$ 4.000,00')

    cy.get('[data-testid=counterproposal-value-input]')
      // .should('have.value', '')
      .clear().type('350000')
      .should('have.value', 'R$ 3.500,00')

    cy.get('[data-testid=counterproposal-claimant-input]')
      .click()
      .trigger('keydown', { keyCode: 40, Which: 40, force: true }) // Pressiona seta direita
      .trigger('keydown', { keyCode: 13, Which: 13, force: true }) // Pressiona Enter

    cy.get('[data-testid=proposal-value-input]')
      // .should('have.value', '')
      .clear().type('200000')
      .should('have.value', 'R$ 2.000,00')

    cy.get('[data-testid=proposal-negotiator-input]')
      .click()
      .trigger('keydown', { keyCode: 40, Which: 40, force: true }) // Pressiona seta direita
      .trigger('keydown', { keyCode: 13, Which: 13, force: true }) // Pressiona Enter

    cy.get('[data-testid=expiration-date-input]')
      .click()
      .trigger('keydown', { keyCode: 39, Which: 39, force: true }) // Pressiona seta direita
      .trigger('keydown', { keyCode: 13, Which: 13, force: true }) // Pressiona Enter
      // .should('have.value', '')

    // Preenche o Campo de 'Descrição'
    cy.get('[data-testid=description-input]')
      .clear().type('Teste edição descrição')
      .should('have.value', 'Teste edição descrição')

    // Verifica se o botão 'Editar dados' é visível e clica
    cy.get('[data-testid=confirm-edit-data]')
      .should('be.visible')
      .click()

    cy.get('.edit-case-confitm-dialog')
      .contains('As novas informações vão sobrescrever as antigas.')
      .get('.edit-case-confirm-button')
      .click({ force: true })
  })

  it('Verifica se valores foram alterados' , function () {
    // Verifica se mensagem de confirmação aparece
    cy.get('.el-notification.success', { timeout: 60000 })
    .contains('Os dados foram alterados com sucesso.')
    .should('be.visible')

    cy.wait(1000)

    cy.get('[data-testid=overview-upperrange]')
      .contains('R$ 4.000,00')

    cy.get('[data-testid=overview-counterproposal]')
      .contains('R$ 3.500,00')

    cy.get('[data-testid=overview-proposal]')
      .contains('R$ 2.000,00')

    cy.get('[data-testid=overview-expirationdate]')
      .contains('02/10/30')

    cy.get('[data-testid=overview-description]')
      .contains('Teste edição descrição')

  })
})
