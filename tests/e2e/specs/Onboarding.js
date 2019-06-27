import { watchFile } from "fs";

describe('Justto.App - Onboarding', function () {
    beforeEach(function () {
        cy.viewport(1280, 720)
      })
    // it('Onboarding - Login', function () {
    //     // Acessa a página inicial do Justto.App
    //     // cy.visit('http://homol.justto.com.br')
    //     cy.visit('localhost:8080')

    //     // Sistema deve redirecionar para a página de Login
    //     cy.url().should('include', '/#/login')

    //     // Preenche o campo 'Email'
    //     cy.get('[data-testid=login-email]')
    //         .type('dake@emailay.com')
    //         .should('have.value', 'dake@emailay.com')

    //     // Preenche o campo 'Senha'
    //     cy.get('[data-testid=login-password]')
    //         .type('password')
    //         .should('have.value', 'password')

    //     // Clica no botão "Entrar"
    //     cy.get('[data-testid=submit]')
    //         .click()

    //     // Valida se primeira página acessada é a do Onboarding
    //     cy.url().should('include', '/#/onboarding')
    // })

    // it('Onboarding: Vamos começar', function () {
    //     // Acessa a página inicial do Justto.app
    //     // cy.visit('http://homol.justto.com.br')
    //     cy.visit('localhost:8080')

    //     // Sistema deve redirecionar para a página de Login
    //     cy.url().should('include', '/#/login')

    //     // Preenche o campo 'Email'
    //     cy.get('[data-testid=login-email]')
    //         .type('dake@emailay.com')
    //         .should('have.value', 'dake@emailay.com')

    //     // Preenche o campo 'Senha'
    //     cy.get('[data-testid=login-password]')
    //         .type('password')
    //         .should('have.value', 'password')

    //     // Clica no botão "Entrar"
    //     cy.get('[data-testid=submit]')
    //         .click()

    //     // Valida se primeira página acessada é a do Onboarding
    //     cy.url().should('include', '/#/onboarding')

    //     // Seleciona botão 'Vamos Começar'
    //     cy.get('[data-testid=lets-start]')
    //         .click()

    //     // Verifica próximo passo é 'Qual o nome da sua equipe?'
    //     //cy.get('data-testid="teamname-step"').should('be.visible')
    //     cy.contains('Qual o nome da sua equipe?').should('be.visible')
    // })

    // it('Onboarding: Nome da Equipe', function () {
    //     // Acessa a página inicial do Justto.app
    //     // cy.visit('http://homol.justto.com.br')
    //     cy.visit('localhost:8080')

    //     // Sistema deve redirecionar para a página de Login
    //     cy.url().should('include', '/#/login')

    //     // Preenche o campo 'Email'
    //     cy.get('[data-testid=login-email]')
    //         .type('dake@emailay.com')
    //         .should('have.value', 'dake@emailay.com')

    //     // Preenche o campo 'Senha'
    //     cy.get('[data-testid=login-password]')
    //         .type('password')
    //         .should('have.value', 'password')

    //     // Clica no botão "Entrar"
    //     cy.get('[data-testid=submit]')
    //         .click()

    //     // Valida se primeira página acessada é a do Onboarding
    //     cy.url().should('include', '/#/onboarding')

    //     // Seleciona botão 'Vamos Começar'
    //     cy.get('[data-testid=lets-start]')
    //         .click()

    //     // Verifica próximo passo é 'Qual o nome da sua equipe?'
    //     cy.contains('Qual o nome da sua equipe?').should('be.visible')

    //     // Preenche o campo 'Equipe'
    //     cy.get('[data-testid=name-teamname]')
    //         .type('Workspace de Teste')
    //         .should('have.value', 'Workspace de Teste')

    //     // Seleciona 'Próximo'
    //     cy.get('[data-testid=next-teamname]')
    //         .click()

    //     // Verifica próximo passo é 'Crie o seu espaço de trabalho na Justto'
    //     cy.contains('Crie o seu espaço de trabalho na Justto').should('be.visible')
    // })

    // it('OnBoarding: Workspace Válido', function () {
    //     // Acessa a página inicial do Justto.app
    //     // cy.visit('http://homol.justto.com.br')
    //     cy.visit('localhost:8080')

    //     // Sistema deve redirecionar para a página de Login
    //     cy.url().should('include', '/#/login')

    //     // Preenche o campo 'Email'
    //     cy.get('[data-testid=login-email]')
    //         .type('dake@emailay.com')
    //         .should('have.value', 'dake@emailay.com')

    //     // Preenche o campo 'Senha'
    //     cy.get('[data-testid=login-password]')
    //         .type('password')
    //         .should('have.value', 'password')

    //     // Clica no botão "Entrar"
    //     cy.get('[data-testid=submit]')
    //         .click()

    //     // Valida se primeira página acessada é a do Onboarding
    //     cy.url().should('include', '/#/onboarding')

    //     // Seleciona botão 'Vamos Começar'
    //     cy.get('[data-testid=lets-start]')
    //         .click()

    //     // Verifica próximo passo é 'Qual o nome da sua equipe?'
    //     cy.contains('Qual o nome da sua equipe?').should('be.visible')

    //     // Preenche o campo 'Equipe'
    //     cy.get('[data-testid=name-teamname]')
    //         .type('Workspace de Teste')
    //         .should('have.value', 'Workspace de Teste')

    //     // Seleciona 'Próximo'
    //     cy.get('[data-testid=next-teamname]')
    //         .click()

    //     // Verifica próximo passo é 'Crie o seu espaço de trabalho na Justto'
    //     cy.contains('Crie o seu espaço de trabalho na Justto').should('be.visible')

    //     function randomSubdomain(range) {
    //         var allLetters = '0123456789abcdefghiklmnopqrstuvwxyz';
    //         var randomSubdomain = '';
    //         for (var i = 0; i < range; i++) {
    //             var randomNumber = Math.floor(Math.random() * allLetters.length);
    //             randomSubdomain += allLetters.substring(randomNumber, randomNumber + 1);
    //         }
    //         var randomSubdomain = 'teste' + randomSubdomain
    //         return randomSubdomain;
    //     }

    //     // Preenche campo de Workspace 'https://justto.app' com subdomínio 'teste-xxxxx'
    //     var subdomain = randomSubdomain(5);
    //     cy.get('[data-testid=name-subdomain]')
    //         .type(subdomain)
    //     //.should(subdomain)

    //     // Verifica se subdomínio digitado está disponível
    //     cy.contains('Subdomínio disponível.').should('be.visible')

    //     // Seleciona Próximo
    //     cy.get('[data-testid=next-subdomain]')
    //         .click()

    //     // Verifica próximo passo é 'Adicione pessoas à sua equipe'
    //     cy.contains('Adicione pessoas à sua equipe').should('be.visible')
    // })

    // it('OnBoarding: Workspace Inválido', function () {
    //     // Acessa a página inicial do Justto.app
    //     // cy.visit('http://homol.justto.com.br')
    //     cy.visit('localhost:8080')

    //     // Sistema deve redirecionar para a página de Login
    //     cy.url().should('include', '/#/login')

    //     // Preenche o campo 'Email'
    //     cy.get('[data-testid=login-email]')
    //         .type('dake@emailay.com')
    //         .should('have.value', 'dake@emailay.com')

    //     // Preenche o campo 'Senha'
    //     cy.get('[data-testid=login-password]')
    //         .type('password')
    //         .should('have.value', 'password')

    //     // Clica no botão "Entrar"
    //     cy.get('[data-testid=submit]')
    //         .click()

    //     // Valida se primeira página acessada é a do Onboarding
    //     cy.url().should('include', '/#/onboarding')

    //     // Seleciona botão 'Vamos Começar'
    //     cy.get('[data-testid=lets-start]')
    //         .click()

    //     // Verifica próximo passo é 'Qual o nome da sua equipe?'
    //     cy.contains('Qual o nome da sua equipe?').should('be.visible')

    //     // Preenche o campo 'Equipe'
    //     cy.get('[data-testid=name-teamname]')
    //         .type('Workspace de Teste')
    //         .should('have.value', 'Workspace de Teste')

    //     // Seleciona 'Próximo'
    //     cy.get('[data-testid=next-teamname]')
    //         .click()

    //     // Verifica próximo passo é 'Crie o seu espaço de trabalho na Justto'
    //     cy.contains('Crie o seu espaço de trabalho na Justto').should('be.visible')

    //     // Preenche campo de Workspace 'https://justto.app' com subdomínio 'teste'
    //     cy.get('[data-testid=name-subdomain]')
    //         .type('teste')
    //         .should('teste')

    //     // Verifica se subdomínio digitado está indisponível
    //     cy.contains('Este subdomínio já está em uso.').should('be.visible')
    // })

    it('OnBoarding: Adicione Pessoas à sua Equipe, Válido', function () {
        // Acessa a página inicial do Justto.app
        // cy.visit('http://homol.justto.com.br')
        cy.visit('localhost:8080')

        // Sistema deve redirecionar para a página de Login
        cy.url().should('include', '/#/login')

        // Preenche o campo 'Email'
        cy.get('[data-testid=login-email]')
            .type('dake@emailay.com')
            .should('have.value', 'dake@emailay.com')

        // Preenche o campo 'Senha'
        cy.get('[data-testid=login-password]')
            .type('password')
            .should('have.value', 'password')

        // Clica no botão "Entrar"
        cy.get('[data-testid=submit]')
            .click()

        // Valida se primeira página acessada é a do Onboarding
        cy.url().should('include', '/#/onboarding')

        // Seleciona botão 'Vamos Começar'
        cy.get('[data-testid=lets-start]')
            .click()

        // Verifica próximo passo é 'Qual o nome da sua equipe?'
        cy.contains('Qual o nome da sua equipe?').should('be.visible')

        // Preenche o campo 'Equipe'
        // cy.get('[data-testid=name-teamname]')
        //     .type('Workspace de Teste')
        //     .should('have.value', 'Workspace de Teste')

        // Seleciona 'Próximo'
        cy.get('[data-testid=next-teamname]')
            .click()

        // Verifica próximo passo é 'Crie o seu espaço de trabalho na Justto'
        cy.contains('Crie o seu espaço de trabalho na Justto').should('be.visible')

        // function randomSubdomain(range) {
        //     var allLetters = '0123456789abcdefghiklmnopqrstuvwxyz';
        //     var randomSubdomain = '';
        //     for (var i = 0; i < range; i++) {
        //         var randomNumber = Math.floor(Math.random() * allLetters.length);
        //         randomSubdomain += allLetters.substring(randomNumber, randomNumber + 1);
        //     }
        //     var randomSubdomain = 'teste' + randomSubdomain
        //     return randomSubdomain;
        // }

        // // Preenche campo de Workspace 'https://justto.app' com subdomínio 'teste-xxxxx'
        // var subdomain = randomSubdomain(5);
        // cy.get('[data-testid=name-subdomain]')
        //     .type(subdomain)
        //.should(subdomain)

        // // Verifica se subdomínio digitado está disponível
        // cy.contains('Subdomínio disponível.').should('be.visible')

        // Seleciona Próximo
        cy.get('[data-testid=next-subdomain]')
            .click()

        // Verifica se próximo passo é 'Adicione pessoas à sua equipe'
        cy.contains('Adicione pessoas à sua equipe').should('be.visible')

        // Preenche o campo 'E-mail'
        cy.get('[data-testid=email-teammember]')
            .type('teste@email.com')
            // .should('teste@email.com')

        // Seleciona botão '+'
        cy.get('[data-testid=submit-teammember]')
            .click()

        // Verifica se e-mail adicionado foi exibido na lista
        cy.contains('teste@email.com').should('be.visible')

        // Convidar e-mail
        cy.get('[data-testid=invite-teammember]')
            .click()

        // Verifica se próximo passo é WhatsApp
        cy.contains('WhatsApp').should('be.visible')
    })

    it("OnBoarding: Adicione Pessoas à sua Equipe, Inválido", function(){
                // Acessa a página inicial do Justto.app
        // cy.visit('http://homol.justto.com.br')
        cy.visit('localhost:8080')

        // Sistema deve redirecionar para a página de Login
        cy.url().should('include', '/#/login')

        // Preenche o campo 'Email'
        cy.get('[data-testid=login-email]')
            .type('dake@emailay.com')
            .should('have.value', 'dake@emailay.com')

        // Preenche o campo 'Senha'
        cy.get('[data-testid=login-password]')
            .type('password')
            .should('have.value', 'password')

        // Clica no botão "Entrar"
        cy.get('[data-testid=submit]')
            .click()

        // Valida se primeira página acessada é a do Onboarding
        cy.url().should('include', '/#/onboarding')

        // Seleciona botão 'Vamos Começar'
        cy.get('[data-testid=lets-start]')
            .click()

        // Verifica próximo passo é 'Qual o nome da sua equipe?'
        cy.contains('Qual o nome da sua equipe?').should('be.visible')

        // Preenche o campo 'Equipe'
        // cy.get('[data-testid=name-teamname]')
        //     .type('Workspace de Teste')
        //     .should('have.value', 'Workspace de Teste')

        // Seleciona 'Próximo'
        cy.get('[data-testid=next-teamname]')
            .click()

        // Verifica próximo passo é 'Crie o seu espaço de trabalho na Justto'
        cy.contains('Crie o seu espaço de trabalho na Justto').should('be.visible')

        // function randomSubdomain(range) {
        //     var allLetters = '0123456789abcdefghiklmnopqrstuvwxyz';
        //     var randomSubdomain = '';
        //     for (var i = 0; i < range; i++) {
        //         var randomNumber = Math.floor(Math.random() * allLetters.length);
        //         randomSubdomain += allLetters.substring(randomNumber, randomNumber + 1);
        //     }
        //     var randomSubdomain = 'teste' + randomSubdomain
        //     return randomSubdomain;
        // }

        // // Preenche campo de Workspace 'https://justto.app' com subdomínio 'teste-xxxxx'
        // var subdomain = randomSubdomain(5);
        // cy.get('[data-testid=name-subdomain]')
        //     .type(subdomain)
        //.should(subdomain)

        // // Verifica se subdomínio digitado está disponível
        // cy.contains('Subdomínio disponível.').should('be.visible')

        // Seleciona Próximo
        cy.get('[data-testid=next-subdomain]')
            .click()

        // Verifica se próximo passo é 'Adicione pessoas à sua equipe'
        cy.contains('Adicione pessoas à sua equipe').should('be.visible')

        // Preenche o campo 'E-mail'
        cy.get('[data-testid=email-teammember]')
            .type('testeemailcom')
            // .should('teste@email.com')

        // Seleciona botão '+'
        cy.get('[data-testid=submit-teammember]')
            .click()

        // Verifica se e-mail mensagem 'Insira um e-mail válido' é exibida
        cy.contains('Insira um e-mail válido').should('be.visible')
    })
})