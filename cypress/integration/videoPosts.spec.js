import { loginUser } from "./utilities/utilities";
describe("test video actions", () => {
    beforeEach(() => {
        loginUser();
    });
    it("tests a video in homepage" ,() => {
        cy.visit("/");
        cy.wait(700);
        cy.get('.home--posts--side')?.find(".post--card--container")?.find("#videoElement").last().then( vid => {
             cy.wrap(vid).find(".video__volume__icon").then( muteBtn => {
                cy.wrap(muteBtn).find('svg[data-cy="vid-unmuted"]').should("be.exist");
                cy.wrap(muteBtn).click();
                cy.wrap(muteBtn).find(('svg[data-cy="vid-muted"]')).should("be.exist");
             })
        })
       
    });
});