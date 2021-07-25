import { loginUser } from "./utilities/utilities";
describe("test searching functionality", () => {
    beforeEach(() => {
        loginUser();
    });
    it("tests seaching a random user by typing", () => {
        cy.visit("/");
        cy.wait(500);
        cy.get("#header.main--header").find(".search--bar--container input").clear().type("Mahmoud");
        cy.get(".noti--popup--ul").then( ul => {
            cy.wrap(ul).should("be.exist");
            cy.wait(1500);
            cy.wrap(ul).find(".search--result--item").first().click();
            cy.url().should("include", "/user_profile/Mahmoud/");
        });
        cy.wait(500);
    });
    //Make sure to allow microphone on your browser before testing
    it("tests searching a random user by voice simulation", () => {
        cy.visit("/");
        cy.wait(1000);
        cy.get("#header.main--header").find(".search--bar--container .voice__search__icon").click();
        cy.get(".desktop--search").then( sr => {
            cy.wrap(sr).find(".voice__search__btn").click();
            cy.wait(300);
            cy.wrap(sr).find(".voice__speach__listening").contains("Listening").should("be.exist");
            cy.wrap(sr).find(".voice__search__btn").click();
            cy.wrap(sr).find(".voice__speach__listening").contains("Listening").should("be.not.exist");
        })
    });
});