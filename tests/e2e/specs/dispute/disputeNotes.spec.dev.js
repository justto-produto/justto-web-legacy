const login = Cypress.env('email6')
const password = Cypress.env('password6')

describe('Justto.App - Disputa: Notas', function () {
  beforeEach('Login', function () {
    // Acessa a página inicial do Justto.App
    cy.visit('https://' + Cypress.env('BASE_URL'))

    // Valida se o endereço redirecionado é o 'Login'
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

  it('Salvar Nota: Sucesso', function () {
    cy.wait(2000)
    // Clica na aba 'Todos'
    cy.contains('Todos').click({force: true})

    // Entra na primeira disputa da lista
    cy.get('[data-testid=dispute-index]').eq(0)
      .click()

    // Entra na aba 'Notas'
    cy.contains('Nota')
      .click()

    // Digita uma nota
    cy.get('[data-testid=input-nota]')
      .type('Teste notaaaa 10')

    // Salva a nota
    cy.get('[data-testid=submit-note]')
      .click()

    // Notificação de sucesso deve desaparecer
    cy.contains('Nota gravada com sucesso.')
      .should('be.visible')

    // // Aguarda chat atualizar
    // cy.wait(10000)

    // Nota deve aparecer entre as mensagens
    cy.get('.dispute-view-messages__message-content.note')
      .should('be.visible')
      .contains('Teste notaaaa 10')
  })
})
