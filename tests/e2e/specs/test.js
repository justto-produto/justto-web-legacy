// // https://docs.cypress.io/api/introduction/api.html

// describe('My First Test', () => {
//   it('Visits the app root url', () => {
//     cy.visit('/')
//     cy.contains('h1', 'Welcome to Your Vue.js App')
    
//   }) 
// })

// /// <reference types="Cypress" />

// context('Actions', () => {
//   beforeEach(() => {
//     cy.visit('http://localhost:8080/login')
//   })

//   // Acessando página de Login do justto-web

//   it('Acessando Página de Login ', () => {
//     // https://on.cypress.io/type
//     cy.get('[class=el-input__inner]').then($els => $els.get(0))
//       .type('fake@email.com')

//     cy.get('[class=el-input__inner]').then($els => $els.get(1))
//       .type('password')
//     // Press 'Enter' buttom
//     // cy.contains('Entrar').click()
//   })

//   it('Cadastrar usuário', () => {
//   // https://on.cypress.io/type
//     cy.contains('Cadastre').click()

//     // Fills 'Nome' field
// <<<<<<< Updated upstream
//     cy.get('[class=el-input__inner]').then($els => $els.get(2))
//       .type('nome')
// =======
//       cy.get('[class=el-input__inner]').then($els => $els.get(0))
//         .type('nome')
// >>>>>>> Stashed changes
//     // Fills 'Email' field
//     cy.get('[class=el-input__inner]').then($els => $els.get(1))
//       .type('e@mail.com')
//     // Fills 'Senha' field
//     cy.get('[class=el-input__inner]').then($els => $els.get(2))
//       .type('password')

//     cy.contains('Cadastrar').click()
//   })
// })

// Novo jeito de utilizar os elementos
    // // Welcome
    // cy.wait(5)
    // cy.get('.onboarding-welcome-step > button').click()
    // cy.wait(5)
    // // Team Name
    // cy.get('[name=name]').type('Team Name')
    // cy.wait(5)
    // cy.get('.onboarding-step-content > .el-button el-button--primary').click()
    // cy.wait(5)
    // // Workspace Name


