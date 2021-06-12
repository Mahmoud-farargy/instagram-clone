import { loginUser } from "./utilities/utilities";

const likeAndDislike = (likingCondition) => {
    //disliked
    if(likingCondition.hasClass("post--like--icon")){
        cy.wrap(likingCondition).click();
        cy.wait(700);
        cy.wrap(likingCondition).should("have.class", "liked__heart");
    }else if(likingCondition.hasClass("liked__heart")){
    // liked
        cy.wrap(likingCondition).click();
        cy.wait(400);
        cy.wrap(likingCondition).should("have.class", "post--like--icon");
    }   
}
describe("test liking functionality", () => {
    beforeEach(() => {
        loginUser();
    });
    // homepage
    it("tests liking posts in homepage", () => {
        cy.visit("/")
        cy.get(".home--posts--side")?.find(".post--card--container").each( post => {
            cy.wrap(post).find(".post--card--footer").find('[data-cy="like"]').then( likingCondition => {
                likeAndDislike(likingCondition);
            })
        });
    });
    it("tests liking posts in my profile page", () => {
        cy.visit("/profile");
        cy.wait(1000);
        cy.get("#profilePosts").find(".profile--posts--container").first()?.then( post => {
            cy.wrap(post).click();
            cy.get(".d--post--container").should("be.exist").then(() => {
                cy.get(".d--post--container .desktop--right").find(".post--footer--upper--row").find('[data-cy="like"]').then( likingCondition => {
                    likeAndDislike(likingCondition);
                }).then(() => {
                    cy.get(".post--modal--close").click();
                    cy.get(".d--post--container").should("not.exist");
                });
            });

        });
    });
    it("tests liking posts in users profile page", () => {
            cy.visit("/");
            cy.wait(600);
            cy.get(".suggest--item--container").then( user => {
           cy.wrap(user)?.find(".suggestion--item")?.first().then( userRow => {
            cy.wrap(userRow).find(".displayed_userName").trigger("mouseover");
            cy.get(".user--mini--window").should("be.exist").then( el => {
                cy.wrap(el).find(".mini--window--media--counters [data-cy='postsCount'] h5").then(postsCount =>{
                        if(Cypress.$(postsCount).text() > 0){
                                    cy.get("#header").click("left");
                                    cy.wait(1000);
                                    cy.wrap(user)?.find(".suggestion--item")?.first()?.then( userRow => {
                                    cy.wrap(userRow).find(".displayed_userName").click();
                                    cy.wait(2000);
                                    
                                                cy.get("#profilePosts").find(".profile--posts--container").first()?.then( post => {
                                                cy.wrap(post).click();
                                                cy.get(".d--post--container").should("be.exist").then(() => {
                                                    cy.get(".d--post--container .desktop--right").find(".post--footer--upper--row").find('[data-cy="like"]').then( likingCondition => {
                                                        likeAndDislike(likingCondition);
                                                    }).then(() => {
                                                        cy.get(".post--modal--close").click();
                                                        cy.get(".d--post--container").should("not.exist");
                                                        cy.visit("/");
                                                    });
                                                });
                                                    
                                                });
                                    });
                        }else if(Cypress.$(postsCount).text() <= 0){
                            cy.wrap(userRow).find(".displayed_userName").trigger("mousedown");
                            // find an alternative
                        }
                });
            });
           });

                
            })
        
    });

    // it("tests liking reels", () => {
    //     cy.visit("/");
    //     cy.wait(1000);
    //     cy.get('#homeReels .home--reels--ul .home-reel-item').first().then(firstReel => {
    //         cy.wrap(firstReel).find(".reel--reel--inner").click();
    //         cy.wait(7000);
    //         cy.get(".reel--video--box .reel--inner--container").eq(0).then( reel => {
    //             console.log(cy.wrap(reel).find(".interaction--box"));
    //                 cy.wrap(reel).find(".interaction--box").find('[data-cy="like"]').then( likingCondition => {
    //                     likeAndDislike(likingCondition);
    //                 }).then(() => {
    //                     console.log("done");
    //                     // cy.get(".post--modal--close").click();
    //                     // cy.get(".d--post--container").should("not.exist");
    //                 });
    //                 // cy.wrap(reel).find('[data-cy="like"]').then( likingCondition => {
    //                 //     likeAndDislike(likingCondition);
    //                 // }).then(() => {
    //                 //     console.log("done");
    //                 //     // cy.get(".post--modal--close").click();
    //                 //     // cy.get(".d--post--container").should("not.exist");
    //                 // });
    //         });

    //     });
    // })
});