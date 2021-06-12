import { loginUser } from "./utilities/utilities";
const  makeAcomment = (element, post, commentingCondition) => {
    cy.wait(700);
    const MSG = "Hello this is just a test";
    cy.wrap(element).find(".post--bottom--comment--adding").then(input => {
        const writeAComment = (txt) => {
            cy.wrap(input).find(".post__bottom__input").clear();
            cy.wrap(input).find(".post__bottom__button").should("be.disabled");
            cy.wrap(input).find(".post__bottom__input").type(txt);
            cy.wrap(input).find(".post__bottom__button").click();
        }
        writeAComment(MSG);
        cy.wait(1000);
        const delComment = () => {
            cy.wait(200);
            cy.get(".react-confirm-alert-body").then( modal => {
                cy.wrap(modal).should("be.exist");
                cy.wrap(modal).contains("Yes").click();
            })
            cy.get(".Toastify__toast").contains("deleted");
        }
        cy.wrap(post)?.find(".post--comment--item")?.last().then( comment => {
            const replayTxt = "I know it's a test dummy!!";
            cy.wrap(comment)?.find(".comment__text").should("contain", MSG);
            cy.wrap(comment)?.contains("Replay").click();
            cy.wait(200);
            writeAComment(`@kiki ${replayTxt}`);
            cy.wait(1000);
            cy.wrap(comment)?.find(".sub--comments--nav")?.find(".post--comment--item").first().then(replay => {
                cy.wrap(replay)?.find(".post__top__comment").should("contain", `@kiki ${replayTxt}`);
                cy.wrap(replay).contains("Delete").click();
                delComment();
            });
           
            cy.wrap(comment).contains("Delete").click();
            delComment();
            cy.wrap(commentingCondition).click();
        });
        
    });
}
describe("test commenting functionality", ()=> {
    beforeEach(() => {
        loginUser();
    });
    it("tests commenting posts in homepage",()=> {
        cy.visit("/");
        cy.wait(1000);
        cy.get(".home--posts--side")?.find(".post--card--container")?.eq(0)?.then(post => {
            cy.wrap(post).find(".post--card--footer").then( el => {
                cy.wrap(el).find('[data-cy="comment"]').then( commentingCondition => {
                    cy.wrap(commentingCondition).click();
                    makeAcomment(el, post, commentingCondition);
                }); 
            })
        });
    });

    //TO BE CONTINUED...
});