describe("login tests", () => {
    beforeEach(() => {
        cy.visit("/auth");
    })
    it("makes sure to disable submit button if fields are empty",() =>{
        if(cy.userAuth) cy.logout();
        cy.get('.auth--main .auth--input--form').then( form => {
           cy.wrap(form).find('input[data-cy="email"]').clear();
           cy.wrap(form).find('input[data-cy="password"]').clear();
           cy.wrap(form).find('input[type="submit"]').should("be.disabled");
        });
    });
    const wrongEmail = "wrongemail@gmail.com";
    it("validates login", () => {
        cy.logout();
        cy.get('.auth--main .auth--input--form').then( form => {
            cy.wrap(form).find('input[data-cy="email"]').type(wrongEmail);
            cy.wrap(form).find('input[data-cy="password"]').type("72928279");
            cy.wrap(form).submit();
            cy.wait(300);
            cy.get(".Toastify__toast--error").invoke("text").should("contain", "no user");
        });
    });
    it("validates forgot password", () => {
        cy.get('.auth--main .auth--input--form').then( form => {
            cy.wrap(form).find('span[class="forgot__pass"]').click();
            cy.wrap(form).find('input[data-cy="email"]').clear();
            cy.wrap(form).find('input[type="submit"]').should("be.disabled");
            cy.wrap(form).find('input[data-cy="email"]').type(wrongEmail);
            cy.wrap(form).find('input[class="resetPassBtn"][type="submit"]').click();
            cy.wait(300);
            cy.get(".Toastify__toast--error").invoke("text").should("contain", "not exist");
        });
    });
    it("logs in successfully with the right authentications", () => {
            cy.get('.auth--main .auth--input--form').then( form => {
                cy.intercept('POST', '/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyCsDXcBqUkFzP7a_YLfSi1bUFV4zYv9Ipk').as('loginUser')
                cy.wrap(form).find('input[data-cy="email"]').clear().type(Cypress.env("email"));
                cy.wrap(form).find('input[data-cy="password"]').clear().type(Cypress.env("password"));

                cy.wrap(form).find('input[type="submit"]').click();

                cy.wait('@loginUser').its('response.statusCode').should('eq', 200);
                cy.get(".Toastify__toast").invoke("text").should("contain", "Good evening"); //or Good evening
            });
    });  
    

});