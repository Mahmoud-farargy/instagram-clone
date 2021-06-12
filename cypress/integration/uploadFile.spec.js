
import { loginUser } from "./utilities/utilities";
describe("test file uploading", () => {
    beforeEach(() => {
        loginUser();
    });
    it("tests upload" ,() => {
        cy.visit("/add-post");
        cy.wait(1000);
        cy.get('.post--uploading--card input[type="file"]').attachFile('fixture.jpeg');
    });
});