import { loginUser, toast } from "./utilities/utilities";
describe("test chat functionalities", () => {
    beforeEach(() => {
        loginUser();
    });
    it("tests a video in homepage" ,() => {
        cy.visit("/messages");
        cy.wait(500);
        cy.get('.users--side--header').find(".pen__logo").click();
        cy.wait(200);
        cy.get(".usersModal--card").should("be.exist").then(msgCard => {
            const msgToSend = "Hi there, I'm just testing the app";
            cy.wrap(msgCard)?.find(".new--msg--send--to [class='new__msg__search']").type("Mahmoud");
            cy.wait(500);
            cy.wrap(msgCard)?.find(".suggestions--list .suggestion--item input[type='radio']").first().click();
            cy.wrap(msgCard)?.find("textarea[class='new__msg__textarea__body']").then(txtArea => {
                cy.wrap(txtArea).should("be.exist");
                cy.wrap(txtArea).type(msgToSend);
                cy.wrap(msgCard).find(".new--msg--header .msg__send__btn").click();
                cy.wait(7000);
                cy.get(".messages--chatbox--body").then( chatBoxBody => {
                    cy.wrap(chatBoxBody).should("be.exist");
                    cy.wrap(chatBoxBody).find('div[id="message"]').last().then(lastMsg => {
                        const openOptions = () =>{
                            cy.wrap(lastMsg).find(".message--options").then( optBtn => {
                                cy.wrap(optBtn).invoke("attr", "style", "display: flex").click();
                            });
                        }
                       
                        cy.wrap(lastMsg).find(".message--text").should("contain", msgToSend);
                        openOptions();
                        cy.wait(300);
                        // if(Cypress.$('div[class="backdrop"]').first().has){
                        //     cy.wrap(msgCard).find(".new--msg--header new__msg__close").click(); 
                        // }
                        cy.wrap(lastMsg).find(".message--option").contains("copy").click();
                        cy.get(".Toastify__toast").should("contain", "Copied");
                        openOptions();
                        cy.wrap(lastMsg).contains("unsend").click();
                        cy.get(".react-confirm-alert")?.contains("Unsend").click();
                        cy.wrap(lastMsg).should("not.exist");
                    });
                })
            })
        });
    });
    it("test sending emojies and text", () => {
        cy.visit("/messages");
        cy.wait(500);
        cy.get(".messages--bottom--form").then( bottomForm => {
            cy.wrap(bottomForm)?.find('.message--mini--toolbox').find("svg[data-cy='heart_emoji']").click();
            cy.wait(3000);
            cy.get(".messages--chatbox--body").then( chatBoxBody => {
                cy.wrap(chatBoxBody).should("be.exist");
                const deleteElement = (el) => {
                    cy.wrap(chatBoxBody).find('div[id="message"]').last().then(lastMsg => {
                        const openOptions = () =>{
                            cy.wrap(lastMsg).find(".message--options").then( optBtn => {
                                cy.wrap(optBtn).invoke("attr", "style", "display: flex").click();
                            });
                        }
                        const delLastMsg = () => {
                            openOptions();
                            cy.wrap(lastMsg).contains("unsend").click();
                            cy.get(".react-confirm-alert")?.contains("Unsend").click();
                            cy.wrap(lastMsg).should("not.exist");
                        }
                        cy.wrap(lastMsg).find(el).should("be.exist");
                        cy.wait(1000);
                        delLastMsg();
                    });
                }
                deleteElement(".liked__heart");
                //test sending text using bottom form
                const newMSG = "another one!!!";
                cy.wrap(bottomForm)?.find('input[class="message__input"]')?.clear();
                cy.wrap(bottomForm)?.find('input[type="submit"]').should("not.exist");
                cy.wrap(bottomForm)?.find('input[class="message__input"]')?.type(newMSG);
                cy.wrap(bottomForm)?.find('input[type="submit"]').click();
                cy.wait(1000);
                cy.wrap(chatBoxBody).find('div[id="message"]').last().then(lastMsg => {
                    cy.wrap(lastMsg).find(".message--text").should("contain",newMSG);
                });
                deleteElement(".message--text");
                // test emoji picker
                        cy.wrap(bottomForm)?.find('svg[class="smiley__icon"]').click();
                        cy.wait(200);
                        cy.get('ul[class="emoji-group"]').first().find("li.emoji button").first().click({force:true});
                        cy.get(".hidden--backdrop").click({force:true});
                        cy.wrap(bottomForm).find('input[type="submit"]').click();
                        cy.wait(1000);
                        deleteElement(".message--text");
                     
            })
            
        });

    });
    it("test deleting chat", () =>{
        cy.visit("/messages");
        cy.wait(500);
        cy.get('.messages--chatbox--header').find(".msg--info--btn").click();
        cy.wait(200);
        cy.get("#optionsModal").contains("Delete Chat").click();
        cy.get('div[class="react-confirm-alert"]').contains("Yes").click();
        toast("Chat deleted");
    })
});