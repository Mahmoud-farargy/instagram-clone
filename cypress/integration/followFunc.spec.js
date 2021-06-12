describe("testing following functionality", () => {
    beforeEach(() => {
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
                    cy.visit("/");
                });   
            }
              
        })
            
    });
    it("follow users", () =>{
        cy.server();
        cy.wait(7000);
        cy.get(".suggestions--list .suggest--item--container").then( suggList => {
            
              cy.wrap(suggList).find(".suggestion--item")?.each( user => {
                    cy.wrap(user).find("button").then( userRow => {
                        // Follow case;
                        if(userRow.text().includes("Follow")){
                            cy.wrap(userRow).click();
                            cy.wait(1000);
                            cy.wrap(userRow).should("to.have.class","txt_unfollow");
                        }else if(userRow.text().includes("Unfollow") || userRow.text().includes("Requested")){
                        // Unfollow case
                           cy.wrap(userRow).click();
                           cy.wait(500);
                           cy.get("#optionsModal").find(".option__modal__btn").click();
                           cy.wait(500);
                           cy.get("#optionsModal").should("not.exist");
                           cy.wrap(userRow).should("contain", "Follow");
                           cy.wrap(userRow).should("to.have.class", "txt_follow");
                        }
                    })
            });
        });
        
    });
})