export const loginUser = () => {
    cy.userAuth().then( checkIfLoggedIn => {
        if(checkIfLoggedIn){
            cy.login().then(() => {
                localStorage.setItem(
                    "user",
                    JSON.stringify({
                      email: Cypress.env("email"),
                      password: Cypress.env("password"),
                    })
                  );
            });   
        }
    })
}
export const toast = (word) => {
   return cy.get(".Toastify__toast").should("contain", word);
}