describe('Justto.App - Gerenciamento: Ação em Lote', function () {
  beforeEach(function () {
    // Acessa a página inicial do Justto.App
    // cy.visit('http://homol.justto.com.br')
    cy.visit('localhost:8080')

    // Valida se o endereço redirecionado é o 'Login'
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

  it('Ação em Lote: Ganhar', function () {
    // Seleciona a aba "Todos"
    cy.contains('Todos').should('be.visible').click()

    // Seleciona checkbox 'Selecionar Todos'
    cy.get('.is-leaf > .cell > .el-checkbox > .el-checkbox__input > .el-checkbox__inner')
      .click()

    // Seleciona ação 'Perder'
    cy.get('[data-testid=batch-settled]').click()

    cy.contains('Tem certeza que deseja realizar esta ação?').should('be.visible')
    cy.contains('Atenção!').should('be.visible')

    cy.wait(2000)
  })

  it('Ação em Lote: Perder', function () {
    // Seleciona a aba "Todos"
    cy.contains('Todos').should('be.visible').click()

    // Seleciona checkbox 'Selecionar Todos'
    cy.get('.is-leaf > .cell > .el-checkbox > .el-checkbox__input > .el-checkbox__inner')
      .click()

    // Seleciona ação 'Perder'
    cy.get('[data-testid=batch-unsettled]').click()

    cy.contains('Tem certeza que deseja realizar esta ação?').should('be.visible')
    cy.contains('Atenção!').should('be.visible')

    cy.wait(2000)
  })

  it('Ação em Lote: Pausar', function () {
    // Seleciona a aba "Todos"
    cy.contains('Todos').should('be.visible').click()

    // Seleciona checkbox 'Selecionar Todos'
    cy.get('.is-leaf > .cell > .el-checkbox > .el-checkbox__input > .el-checkbox__inner')
      .click()

    // Seleciona ação 'Pausar'
    cy.get('[data-testid=batch-paused]').click()

    cy.contains('Tem certeza que deseja realizar esta ação?').should('be.visible')
    cy.contains('Atenção!').should('be.visible')
  })

  it('Ação em Lote: Retomar', function () {
    // Seleciona a aba "Todos"
    cy.contains('Todos').should('be.visible').click()

    // Seleciona checkbox 'Selecionar Todos'
    cy.get('.is-leaf > .cell > .el-checkbox > .el-checkbox__input > .el-checkbox__inner')
      .click()

    // Seleciona ação 'Retomar'
    cy.get('[data-testid=batch-resume]').click()

    cy.contains('Tem certeza que deseja realiza esta ação?').should('be.visible')
    cy.contains('Atenção!').should('be.visible')
  })

  it('Ação em Lote: Excluir', function () {
    // Seleciona a aba "Todos"
    cy.contains('Todos').should('be.visible').click()

    // Seleciona checkbox 'Selecionar Todos'
    cy.get('.is-leaf > .cell > .el-checkbox > .el-checkbox__input > .el-checkbox__inner')
      .click()
  
      // Seleciona ação 'Retomar'
    cy.get('[data-testid=batch-resume]').click()
  
    cy.contains('Tem certeza que deseja realiza esta ação?').should('be.visible')
    cy.contains('Atenção!').should('be.visible')
  })

  it('Ação em Lote: Reiniciar Engajamento', function () {
    
  })
})
