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
        el.dispatchEvent(new Event('change', {bubbles: true}))
      })
  })
})

Cypress.Commands.add('deleteWorkspace', (email, password, sub_domain) => {
  // this is an example of skipping your UI and logging in programmatically
  const homolUrl = Cypress.env('homolUrl')
  // setup some basic types
  // and user properties
  const loginDelete = {
    email: email,
    password: password
  }

  // create the user first in the DB
  cy.request({
    url: '/api/accounts/token', // assuming you've exposed a seeds route
    method: 'POST',
    body: loginDelete,
  })
  .its('body')
  .then((body) => {
    cy.request({
      url: '/api/disputes/workspace/' + sub_domain,
      method: 'DELETE',
      headers: 'Authorization: ' + body.token
    })
  })
})
