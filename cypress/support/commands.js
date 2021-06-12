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
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import { auth } from "../../src/Config/firebase";
Cypress.Commands.add("login", () => {
       return auth.signInWithEmailAndPassword(Cypress.env("email"), Cypress.env("password"));
});
Cypress.Commands.add("logout", () => {
    return auth.signOut();
});
Cypress.Commands.add("userAuth", () =>{
  return auth.onAuthStateChanged((authUser) => {
    return authUser
});
});   