const login = Cypress.env('import-actions-email')
const password = Cypress.env('default-password')

describe('Justto.App - Gerenciamento: Ação em Lote', function () {
  beforeEach(function () {
    // Acessa a página inicial do Justto.App
    // cy.visit('http://homol.justto.com.br')
    cy.visit('/')

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

    // Entra na aba 'Todos'
    cy.get('.el-tabs__nav > #tab-3')
      .contains('Todos')
      .click({ force: true })
    /// / TODO: Tivemos que adiciocar um delay por causa da lentidão do sistema
    cy.log('Aguarde carregar disputas')
    cy.wait(10000)

    cy.get('tbody label[role=checkbox]', { timeout: 60000 }).first()
      .click()

    // Menu de ações deve estar visivel
    cy.get('.management-actions')
      .should('have.class', 'active')
      .should('be.visible')
  })

  afterEach(function () {
    // Notificação de sucesso deve aparecer
    cy.get('.el-notification.success', { timeout: 60000 })
      .contains('Yay!')

    // Modal de confirmação deve desaparecer
    cy.get('[data-testid=choose-unsettled-dialog]')
      .should('not.be.visible')
  })

  const motives = [
    'Ausência de interação',
    'Arquivado/Baixa definitiva',
    'Cliente solicitou encerrar negociação',
    'Alçada insuficiente',
    'Sem interesse no acordo',
    'Encaminhado para arbitragem',
    'Não foi possível realizar contato',
    'Acordo fechado por terceiros'
  ]

  motives.forEach((motive) => {
    it('Ação em Lote: Perder - ' + motive, function () {
      // Clica na ação
      cy.get('[data-testid=batch-unsettled]')
        .click()

      // Mensagem de confirmação deve aparecer
      cy.get('[data-testid=unsettled-dialog]')
        .should('be.visible')

      // Abre o select
      cy.get('[data-testid=select-unsettled]')
        .click()

      // Seleciona motivo da perda
      cy.contains(motive)
        .click()

      // Confirma a ação
      cy.get('.confirm-action-unsettled')
        .click()
    })
  })
})
