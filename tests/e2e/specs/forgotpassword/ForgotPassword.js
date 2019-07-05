describe('Justto.app - Esqueci a Senha', function () {
    it('Esqueci minha Senha: Sucesso', function () {
        // Acessa a página inicial do Justto.App
        // cy.visit('http://homol.justto.com.br')
        cy.visit('localhost:8080')

        // Sistema deve redirecionar para a página de Login
        cy.url().should('include', '/#/login')

        // Acessa a página de Equeci minha Senha
        cy.get('[data-testid=forgot-password]').click()

        // Sistema deve redirecionar para a página de Esqueci minha Senha
        cy.url().should('include', '/#/forgot-password')

        // Digita um email válido existente
        cy.get('[data-testid=forgot-password-email]')
            .type('teste.onboarding@justto.com.br')
            .should('have.value', 'teste.onboarding@justto.com.br')

        // Clica no botão Recuperar
        cy.get('[data-testid=submit]').click()

        // Verifica se email foi enviado
        cy.get('[data-testid=forgot-password-success]')
            .should('be.visible')
        cy.get('[data-testid=forgot-password-success]')
            .contains('Requisição de recuperação enviada com sucesso! Acesse seu email para prosseguir.')
            .should('be.visible')
    })

    it('Alteração de senha: Token Inválido', function () {
        // Acessa a página de nova senha invalida
        cy.visit('localhost:8080/#/new-password/FAILURE123')

        // Sistema deve redirecionar para a página de Nova Senha
        cy.url().should('include', '/#/new-password/FAILURE123')

        // Insere uma senha
        cy.get('[data-testid=new-password]')
            .type('password')

        // Repete a Senha
        cy.get('[data-testid=confirm-password]')
            .type('password')

        // Clica em Alterar Senha
        cy.get('[data-testid=submit]')
            .click()

        // Verifica se mensagem de erro é exibida
        cy.get('[data-testid=new-password-failure]')
            .should('be.visible')
    })

    it('Tente Novamente: Sucesso', function () {
        // Clica em tentar novamente
        cy.get('[data-testid=try-again]')
        .click()

        // Verifica se retornou para página de Esqueci minha Senha
        cy.url().should('include', '/#/forgot-password')
    })

    it('Alteração se senha: Senhas não competem', function () {
        // Acessa a página de nova senha (Click no link do email)
        cy.visit('localhost:8080/#/new-password/TSTAUTO')

        // Sistema deve redirecionar para a página de Nova Senha
        cy.url().should('include', '/#/new-password/TSTAUTO')

        // Digita uma senha
        cy.get('[data-testid=new-password]')
            .type('password')

        // Digita uma senha incorreta
        cy.get('[data-testid=confirm-password]')
            .type('drowssap')

        // Clica em Alterar senha
        cy.get('[data-testid=submit]')
            .click()

        // Verifica se mensagem de erro foi exibida
        cy.contains('Campos não correspondem').should('be.visible')
    })

    it('Alteração de senha: Sucesso', function () {
        // Limpa confirmação se senha e insere senha correta
        cy.get('[data-testid=confirm-password]')
            .clear()
            .type('password')

        // Clica em Alterar Senha
        cy.get('[data-testid=submit]')
            .click()

        // Verifica se mensagem de sucesso foi exibida
        cy.get('[data-testid=new-password-success]')
            .should('be.visible')
    })

    it('Ir para login: Sucesso', function () {
        // Clica em Ir Para Login
        cy.get('[data-testid=go-login]')
            .click()

        // Verifica se retornou para login
        cy.url().should('include', '/#/login')
    })

})
