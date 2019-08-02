describe('Justto.App - Onboarding', function () {
  const email = Cypress.env('emailonboarding')
  const senha = Cypress.env('senhaonboarding')

  it('Onboarding: Login', function () {
    cy.visit('localhost:8080')
    cy.url()
      .should('include', '/#/login')
    cy.get('[data-testid=login-email]')
      .type(email)
      .should('have.value', email)
    cy.get('[data-testid=login-password]')
      .type(senha)
      .should('have.value', senha)
    cy.get('[data-testid=submit]')
      .click()
    cy.url().should('include', '/#/onboarding')
  })

  it('Onboarding: Vamos começar', function () {
    cy.get('[data-testid=welcome-next]')
      .click()
    cy.contains('Qual o nome da sua equipe?')
      .should('be.visible')
  })

  it('Onboarding: Nome da Equipe', function () {
    cy.get('[data-testid=teamname-name]')
      .type('Workspace de Teste')
      .should('have.value', 'Workspace de Teste')
    cy.get('[data-testid=teamname-next]')
      .click()
    cy.contains('Crie o seu espaço de trabalho na Justto')
    .should('be.visible')
  })

  it('OnBoarding: Workspace Válido', function () {

    function randomSubdomain (range) {
      var allLetters = '0123456789abcdefghiklmnopqrstuvwxyz'
      var randomSubdomain = ''
      for (var i = 0; i < range; i++) {
        var randomNumber = Math.floor(Math.random() * allLetters.length)
        randomSubdomain += allLetters.substring(randomNumber, randomNumber + 1)
      }
      var randomSubdomain = 'teste' + randomSubdomain
      return randomSubdomain
    }

    // Preenche campo de Workspace 'https://justto.app' com subdomínio 'teste-xxxxx'
    var subdomain = randomSubdomain(5)
    cy.get('[data-testid=subdomain-name]')
      .type(subdomain)
    // .should(subdomain)

    // Verifica se subdomínio digitado está disponível
    cy.contains('Subdomínio disponível.')

    // Seleciona Próximo
    cy.get('[data-testid=subdomain-next]')
      // .click()

    // Verifica próximo passo é 'Adicione pessoas à sua equipe'
    cy.contains('Adicione pessoas à sua equipe').should('be.visible')
  })

  //
  // it('OnBoarding: Workspace Inválido', function () {
  //   // Seleciona botão 'Vamos Começar'
  //   cy.get('[data-testid=lets-start]')
  //     .click()
  //
  //   // Verifica próximo passo é 'Qual o nome da sua equipe?'
  //   cy.contains('Qual o nome da sua equipe?').should('be.visible')
  //
  //   // Preenche o campo 'Equipe'
  //   cy.get('[data-testid=name-teamname]')
  //     .type('Workspace de Teste')
  //     .should('have.value', 'Workspace de Teste')
  //
  //   // Seleciona 'Próximo'
  //   cy.get('[data-testid=next-teamname]')
  //     .click()
  //
  //   // Verifica próximo passo é 'Crie o seu espaço de trabalho na Justto'
  //   cy.contains('Crie o seu espaço de trabalho na Justto').should('be.visible')
  //
  //   // Preenche campo de Workspace 'https://justto.app' com subdomínio 'teste'
  //   cy.get('[data-testid=name-subdomain]')
  //     .type('teste')
  //     .should('teste')
  //
  //   // Verifica se subdomínio digitado está indisponível
  //   cy.contains('Este subdomínio já está em uso.').should('be.visible')
  // })
  //
  // it('OnBoarding: Adicione Pessoas à sua Equipe, Válido', function () {
  //   // Seleciona botão 'Vamos Começar'
  //   cy.get('[data-testid=lets-start]')
  //     .click()
  //
  //   // Verifica próximo passo é 'Qual o nome da sua equipe?'
  //   cy.contains('Qual o nome da sua equipe?').should('be.visible')
  //
  //   // Preenche o campo 'Equipe'
  //   cy.get('[data-testid=name-teamname]')
  //     .type('Workspace de Teste')
  //     .should('have.value', 'Workspace de Teste')
  //
  //   // Seleciona 'Próximo'
  //   cy.get('[data-testid=next-teamname]')
  //     .click()
  //
  //   // Verifica próximo passo é 'Crie o seu espaço de trabalho na Justto'
  //   cy.contains('Crie o seu espaço de trabalho na Justto').should('be.visible')
  //
  //   function randomSubdomain(range) {
  //     var allLetters = '0123456789abcdefghiklmnopqrstuvwxyz';
  //     var randomSubdomain = '';
  //     for (var i = 0; i < range; i++) {
  //       var randomNumber = Math.floor(Math.random() * allLetters.length);
  //       randomSubdomain += allLetters.substring(randomNumber, randomNumber + 1);
  //     }
  //     // eslint-disable-next-line no-redeclare
  //     var randomSubdomain = 'teste' + randomSubdomain
  //     return randomSubdomain;
  //   }
  //
  //   // Preenche campo de Workspace 'https://justto.app' com subdomínio 'teste-xxxxx'
  //   var subdomain = randomSubdomain(5);
  //   cy.get('[data-testid=name-subdomain]')
  //     .type(subdomain)
  //     .should(subdomain)
  //
  //   // Verifica se subdomínio digitado está disponível
  //   cy.contains('Subdomínio disponível.').should('be.visible')
  //
  //   // Seleciona Próximo
  //   cy.get('[data-testid=next-subdomain]')
  //     .click()
  //
  //   // Verifica se próximo passo é 'Adicione pessoas à sua equipe'
  //   cy.contains('Adicione pessoas à sua equipe').should('be.visible')
  //
  //   // Preenche o campo 'E-mail'
  //   cy.get('[data-testid=email-teammember]')
  //     .type('teste@email.com')
  //   // .should('teste@email.com')
  //
  //   // Seleciona botão '+'
  //   cy.get('[data-testid=submit-teammember]')
  //     .click()
  //
  //   // Verifica se e-mail adicionado foi exibido na lista
  //   cy.contains('teste@email.com').should('be.visible')
  //
  //   // Convidar e-mail
  //   cy.get('[data-testid=invite-teammember]')
  //     .click()
  //
  //   // Verifica se próximo passo é WhatsApp
  //   cy.contains('WhatsApp').should('be.visible')
  // })
  //
  // it('OnBoarding: Adicione Pessoas à sua Equipe, Inválido', function () {
  //   // Seleciona botão 'Vamos Começar'
  //   cy.get('[data-testid=lets-start]')
  //     .click()
  //
  //   // Verifica próximo passo é 'Qual o nome da sua equipe?'
  //   cy.contains('Qual o nome da sua equipe?').should('be.visible')
  //
  //   // // Preenche o campo 'Equipe'
  //   cy.get('[data-testid=name-teamname]')
  //     .type('Workspace de Teste')
  //     .should('have.value', 'Workspace de Teste')
  //
  //   // Seleciona 'Próximo'
  //   cy.get('[data-testid=next-teamname]')
  //     .click()
  //
  //   // Verifica próximo passo é 'Crie o seu espaço de trabalho na Justto'
  //   cy.contains('Crie o seu espaço de trabalho na Justto').should('be.visible')
  //
  //   // function randomSubdomain (range) {
  //   //   var allLetters = '0123456789abcdefghiklmnopqrstuvwxyz'
  //   //   var randomSubdomain = ''
  //   //   for (var i = 0; i < range; i++) {
  //   //     var randomNumber = Math.floor(Math.random() * allLetters.length)
  //   //     randomSubdomain += allLetters.substring(randomNumber, randomNumber + 1)
  //   //   }
  //   //   var randomSubdomain = 'teste' + randomSubdomain
  //   //   return randomSubdomain
  //   // }
  //
  //   // // Preenche campo de Workspace 'https://justto.app' com subdomínio 'teste-xxxxx'
  //   var subdomain = randomSubdomain(5)
  //   cy.get('[data-testid=name-subdomain]')
  //     .type(subdomain)
  //     .should(subdomain)
  //
  //   // // Verifica se subdomínio digitado está disponível
  //   cy.contains('Subdomínio disponível.').should('be.visible')
  //
  //   // Seleciona Próximo
  //   cy.get('[data-testid=next-subdomain]')
  //     .click()
  //
  //   // Verifica se próximo passo é 'Adicione pessoas à sua equipe'
  //   cy.contains('Adicione pessoas à sua equipe').should('be.visible')
  //
  //   // Preenche o campo 'E-mail'
  //   cy.get('[data-testid=email-teammember]')
  //     .type('testeemailcom')
  //   // .should('teste@email.com')
  //
  //   if (window.Cypress) {
  //     $(window).scroll(() => {
  //       $(window).scrollTop(0);
  //     });
  //   }
  //
  //   // Seleciona botão '+'
  //   cy.get('[data-testid=submit-teammember]')
  //     .click()
  //
  //   // // Verifica se e-mail mensagem 'Insira um e-mail válido' é exibida
  //   cy.contains('Insira um e-mail válido').should('be.visible')
  // })
})
