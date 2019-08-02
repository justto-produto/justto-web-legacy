const login = Cypress.env('email1')
const password = Cypress.env('password1')

describe('Justto.App - Disputa: Notas', function () {
  beforeEach('Login', function () {
    // Acessa a página inicial do Justto.App
    cy.visit('/#/login')

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
    // Entra na aba 'Todos'
    cy.get('.el-tabs__nav > #tab-3')
      .contains('Todos')
      .click({force: true})

    // Entra na disputa
    cy.get('[data-testid=dispute-index] tbody > tr.el-table__row').first()
      .click()

    // Sistema deve redirecionar para a página de Registro
    cy.url().should('include', '/#/management/dispute/')

    // Entra na aba 'Notas'
    cy.get('.el-tabs__nav > #tab-3')
      .contains('Nota')
      .click({force: true})

    function randomText(size) {
      var caracters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
      var result = '';
      for (var i = 0; i < size; i++) {
        var n = Math.floor(Math.random() * caracters.length);
        result += caracters.substring(n, n + 1);
      }
      return 'TST' + result;
    }
    const message = randomText(12)

    // Digita uma nota
    cy.get('[data-testid=input-nota]')
      .type(message)
      .should('have.value', message)

    // Salva a nota
    cy.get('[data-testid=submit-note]')
      .click()

    // Notificação de sucesso deve desaparecer
    cy.contains('Nota gravada com sucesso.', { timeout: 30000 })
      .should('be.visible')

    // Nota deve aparecer entre as mensagens
    cy.contains(message,  { timeout: 30000 })
      .should('be.visible')
      .get('[data-testid=message-box]')
      .should('be.visible')
  })
})
