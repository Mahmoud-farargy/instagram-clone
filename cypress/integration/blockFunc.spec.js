import { loginUser } from "./utilities/utilities";
describe("test blocking functionality", () => {
    beforeEach(() => {
        loginUser();
    });
    it("tests blocking on random user's profile", () => {
        cy.visit("/");
        cy.wait(1000);
        cy.get(".suggestions--header").find(".user__see__all__btn").click();
        cy.wait(600);
        cy.get(".suggestions--p--ul").find(".suggest--item--container").last().find(".suggestion--item .side--user--name").click();
        cy.wait(600);
        cy.get(".desktop--social--row").find(".profile--more--btn").click();
        cy.get(".optionsM--container--inner").find("span").first().click();
        cy.wait(200);
        cy.get(".Toastify__toast").should("contain", "blocked");
        cy.visit("/profile");
        cy.wait(1000);
        cy.get(".users--action--row").find(".my__settings__btn").click();
        cy.get("#optionsModal .optionsM--container--inner").contains("Manage blocked accounts").click();
        cy.wait(300);
        cy.get(".block--list--inner").find(".block__li").first().contains("Unblock").click();
        cy.get(".Toastify__toast").should("contain", "unblocked");
    });
});