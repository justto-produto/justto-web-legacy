// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
import 'cypress-file-upload'

// require('cypress-drag-drop')

Cypress.Commands.add('upload_file', (fileName, fileType = ' ', selector) => {
  cy.get(selector).then(subject => {
    cy.fixture(fileName, 'base64')
      .then(Cypress.Blob.base64StringToBlob)
      .then(blob => {
        const el = subject[0]
        const testFile = new File([blob], fileName, { type: fileType })
        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(testFile)
        el.files = dataTransfer.files
        el.dispatchEvent(new Event('change', { bubbles: true }))
      })
  })
})

Cypress.Commands.add('prepair_testes', (method, endPoint) => {
  // Faz requisição para preparar ambiente especifico de teste
  cy.request(method, 'https://api.justto.app/api/disputes/' + endPoint)
})

Cypress.Commands.add('login', (email, password, workspace) => {
  // Preenche o campo 'Email'
  cy.get('[data-testid=login-email]')
    .type(email)
    .should('have.value', email)

  // Preenche o campo 'Senha'
  cy.get('[data-testid=login-password]')
    .type(password)
    .should('have.value', password)

  // Clica no botão "Entrar"
  cy.get('[data-testid=submit-login]')
    .click()

  // Verifica se entrou na seleção de workspace
  cy.contains('Selecione uma de suas equipes de trabalho para entrar')

  // Seleciona um workspace
  cy.get('[data-testid=select-workspace]')
    .click()
  cy.get('[data-testid=select-workspace-item]')
    .contains(workspace)
    .click()
  // .trigger('keydown', { keyCode: 40, Which: 40 }) // Pressiona seta para baixo
  // .trigger('keydown', { keyCode: 13, Which: 13 }) // Pressiona Enter

  // Clica no botão "Selecionar e Entrar"
  cy.get('[data-testid=submit-workspace]')
    .click()
})

Cypress.Commands.add('access', (link) => {
  const url = link === '/' ? '/#/login' : link

  // Acessa a página inicial do Justto.App
  cy.visit(link)

  // Sistema deve redirecionar para a página de Login
  cy.url().should('include', url)
})

// Cypress.Commands.add('deleteWorkspace', (email, password, sub_domain) => {
//
//
//   // create the user first in the DB
//   cy.request({
//     url: '/api/accounts/token', // assuming you've exposed a seeds route
//     method: 'POST',
//     body: loginDelete
//   })
//     .its('body')
//     .then((body) => {
//       cy.request({
//         url: '/api/disputes/workspace/' + sub_domain,
//         method: 'DELETE',
//         headers: 'Authorization: ' + body.token
//       })
//     })
// })
