import { createGlobalStyle, css } from "styled-components";
import fonts from "./fonts/fonts";

function loopThroughSlides ({start= 1, finish= 5}){
    let styles = ``;
    for(let i = start; i<= finish; i++ ){
        styles += `
        .auth--slide--content {
            img:nth-child(${i}){
                z-index: ${ 88 + (i * 2)};
                ${
                finish <= 5 &&
                    `&:not(.active__slide){
                        opacity: ${(Math.floor(i * 1.3)) /10};
                    }`
                }
            }
        }
        `;
    }
    return css`${styles}`;
} 
const GlobalStyles = createGlobalStyle`
${fonts}
*{
    margin:0;
    padding:0;
}
*,
*:before,
*:after {
    box-sizing:border-box;
    -webkit-box-sizing:border-box;
}
html, body{
    width:100%;
}
html{
    -webkit-text-size-adjust: 100%;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
}
body{
    min-width: 150px;
    margin:0;
    line-height:18px;
    color:var(--font-black);
    background-color: var(--light-gray);
    transition: background 0.4s linear;
    -webkit-font-smoothing: antialiased;
}
ul{
    list-style:none;
}
div{
    vertical-align: baseline;
}
/* ---------------Global classes-------------- */
.disabled{
    opacity:0.5;
    pointer-events: none;
    cursor:not-allowed !important;
}
.disabled:focus{
    outline:none;
}
body, button, input, textarea {
    color: var(--font-black);
    font-size: 14px;
    line-height: 18px;
    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
}
.nav__icon, .nav__icon svg, .nav__icon path {
    height: 22px;
    width: 22px;
    padding:0;
    margin:0;
    font-size: 6px;
    line-height: normal;
}
input {
    writing-mode: horizontal-tb;
    -webkit-writing-mode: horizontal-tb !important;
    text-rendering: auto;
    color: -internal-light-dark(black, white);
    letter-spacing: normal;
    word-spacing: normal;
    text-transform: none;
    text-indent: 0px;
    text-shadow: none;
    display: inline-block;
    text-align: start;
    appearance: auto;
    background-color: -internal-light-dark(var(--white), rgb(59, 59, 59));
    -webkit-rtl-ordering: logical;
    cursor: text;
    margin: 0em;
    font: 400 13.3333px Arial;
    padding: 1px 2px;
    border-width: 2px;
    border-style: inset;
    border-color: -internal-light-dark(rgb(118, 118, 118), rgb(133, 133, 133));
    border-image: initial;
}
:root{
    /* paddings */
    --desktop-padding-top: 80px;
    --desktop-padding-bottom: 30px;
    --padding-sides: 9vw;
    /* colors */
    --white: #fff;
    --gray: #dbdbdb;
    --light-gray:#fafafa;
    --light-black: rgb(38, 38, 38);
    --second--gray:#8e8e8e;
    --secondary-clr:#0095f6;
    --sugg-btn-clr: #63baf4;
    --font-black: #262626; 
    --main-black: #363636;
    --shadow-white: #efefef;
    --bluish-sky: #00376b;
    --ultimate-black: #000;
    --links-clr: #276cd3;
    --tweet-txt-clr: rgb(15, 20, 25);
    --err-clr: #FF0000;
    --modal-clr: #fff;
    --b6a: 54,54,54;
    --mobile-border-clr: #f3f3f3;
    /* borders */
    --main-border:  1px solid var(--gray);
    /* transitions */
    --mild-transition: all 0.2s ease;
    /* fonts */
    --instaFont: "Billabong";
    --active-font-family: "Raleway";
    --max-width: 975px;
}
.icedCoffee .primary__btn, .butterCup .primary__btn, .honeysucle .primary__btn, .snorkelBlue .primary__btn{
    color: #fff;
}
a, abbr, acronym, address, applet, article, aside, audio, b, big, blockquote, canvas, caption, center, cite, code, dd, del, details, dfn, div, dl, dt, em, embed, fieldset, figcaption, figure, footer, form, h1, h2, h3, h4, h5, h6, header, hgroup, html, i, iframe, img, ins, kbd, label, legend, li, mark, menu, nav, object, ol, output, p, pre, q, ruby, s, samp, section, small, span, strike, strong, sub, summary, sup, table, tbody, td, tfoot, th, thead, time, tr, tt, u, ul, var, video
MuiTypography-body1{
  font-family: var(--active-font-family),"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  transition: color var(--mild-transition);
}
body{
    font-family: var(--active-font-family),"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
}
.react-confirm-alert-overlay{
    z-index: 6000;
}
/* -------dark theme------ */
.darkMode{
    --light-gray:rgba(18,18,18,1);
    --white:rgba(0,0,0,1);
    --gray: rgba(var(--b6a,219,219,219),1);
    --font-black: #d2d2d2;
    --main-black:  #ececec;
    --second--gray:#999999;
    --shadow-white: #666666;
    --bluish-sky: #4e8bc4;
    --light-black: #999999;
    --ultimate-black: #fff;
    --links-clr: #9595f3;
    --tweet-txt-clr:#dbdbdb;
    --modal-clr: rgba(38,38,38,1);
    --mobile-border-clr: #202020;
}
.darkMode img,.darkMode video{
    filter: brightness(95%);
}
textarea, input, select{
    background-color: var(--shadow-white);
    color: var(--ultimate-black);
}
textarea::placeholder, input::placeholder, select::placeholder{
    color: var(--font-black);
}
/* ----x---dark theme----x----- */
/* -------dusty cedar theme------ */
.snorkelBlue{
    --light-gray:#034f84;
    --white:#02365b;
    --gray:#3e627a;
    --font-black: #d2d2d2;
    --main-black:  #ececec;
    --second--gray:#999999;
    --shadow-white: #666666;
    --bluish-sky: #a2c9ec;
    --light-black: #999999;
    --ultimate-black: #fff;
    --secondary-clr: #21a0fa;
    --links-clr: #a8a8f7;
    --tweet-txt-clr:#dbdbdb;
    --modal-clr: #075085;
    --mobile-border-clr: #415e75;
}
/* ---x----dusty cedar theme--x---- */
/* -------dusty cedar theme------ */
.blueIzis{
    --light-gray:#3e4074;
    --white:#363763;
    --gray:#515377;
    --font-black: #d2d2d2;
    --main-black:  #ececec;
    --second--gray:#999999;
    --shadow-white: #666666;
    --bluish-sky: #4e8bc4;
    --light-black: #999999;
    --ultimate-black: #fff;
    --links-clr: #a8a8f7;
    --tweet-txt-clr:#dbdbdb;
    --modal-clr: #3e4074;
    --mobile-border-clr: #444568;
}
/* ---x----dusty cedar theme--x---- */
/* -------Iced Coffee theme------ */
.icedCoffee{
    --light-gray:#a58057;
    --white:#816344;
    --gray: #bd9a75;
    --font-black: #eee8e8;
    --main-black:  #e2e2e2;
    --second--gray:#c9c9c9;
    --shadow-white: #a89177;
    --bluish-sky: #a7cff3;
    --light-black: #d4d4d4;
    --ultimate-black: #fff;
    --secondary-clr:#55bafd;
    --links-clr: #a8a8f7;
    --tweet-txt-clr:#dbdbdb;
    --modal-clr: #a58057;
    --mobile-border-clr: #887369;
}
/* ----x---Iced Coffee theme---x--- */
/* -------Buttercup theme------ */
.butterCup{
    --light-gray:#fdf3b1;
    --white:#fef9d8;
    --gray: #fae03c;
    --secondary-clr:#d4b905;
    --sugg-btn-clr: #f8e35b;
    --links-clr: #a8a8f7;
    --modal-clr: #fdf3b1;
    --mobile-border-clr: #fcfaf1;
}
/* ----x---Buttercup theme---x--- */
/* -------Iced Coffee theme------ */
.honeysucle{
    --light-gray:#e1c1db;
    --white:#f0e0ed;
    --gray: #d2a2c9;
    --second--gray:#747474;
    --font-black:  #262626;
    --secondary-clr:#aa529a;
    --sugg-btn-clr: #d66ac2;
    --shadow-white: #fff;
    --links-clr: #6666f7;
    --tweet-txt-clr:#616161;
    --modal-clr: #e1c1db;
    --mobile-border-clr: #f3f0f2;
}
/* ----x---Iced Coffee theme---x--- */

a:visited{
   color:var(--bluish-sky);
}
.modalShow{
    animation: openModal 0.1s ease-out;
    -webkit-animation: openModal 0.1s ease-out;
    animation-fill-mode: none;
    animation-direction: normal;
    animation-iteration-count: 1;
    animation-play-state: running;
}
.auth--slide--container{
    width: 100%;
    align-self: center;
    background-repeat: no-repeat;
    background-position: 0 0;
    background-size: 454px 618px;
    -webkit-flex-basis: 454px;
    -ms-flex-preferred-size: 454px;
    flex-basis: 610px;
    height: 618px;
    margin-left: 0;
    margin-right: -15px;
}
.fadeEffect{
    animation: fadeIn 0.1s ease-out;
    -webkit-animation: fadeIn 0.3s ease-out;
    animation-fill-mode: none;
    animation-direction: normal;
    animation-iteration-count: 1;
    animation-play-state: running;
}
.profile--item--tweet, .tweet__text{
    display: inline;
    white-space: pre-wrap;
    position: relative;
    background-color: var(--light-gray);
    text-overflow: ellipsis;
}   
.profile--item--tweet span, .tweet__text span{
    color: var(--tweet-txt-clr);
    font-family: "Segoe UI",Roboto,Helvetica,Arial,sans-serif;
    font-size: inherit;
    font-weight: inherit;
    overflow-wrap: break-word;
    min-width: 0;
    font-weight: 400;
}
.tweet__text{
    overflow-y: auto;
    font-size: 23px;
    padding: 0.6rem 0.8rem 0.6rem 1rem;
}
.profile--item--tweet{
    border:1px solid var(--gray);
    margin: auto 0;
    font-size: 15px;
    padding: 0.4rem 0.6rem;
}
.tweet__text span{
    line-height: 28px;
}
.profile--item--tweet span{
    line-height: 20px;
}
.rotate__anim{
    animation: rotateAnim 1.5s ease-out;
    -moz-animation: rotateAnim 1.5s ease-out;
    -webkit-animation: rotateAnim 1.5s ease-out;
    animation-iteration-count: 1;
    -webkit-animation-iteration-count:1;
    -moz-animation-iteration-count:1;
    animation-fill-mode: backwards;
    -webkit-animation-fill-mode: backwards;
}

.MuiAvatar-img{
    background-color: rgb(98, 98, 98);
    min-height: 14px;
}
.main--app{
    min-height: 100vh;
    min-width: 250px;
    overflow: hidden;
}
.reels--ul{
    padding: 0 0 0 40px;
    margin: 0;
    align-items:center;
    max-width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    user-select: none;
    -webkit-user-select: none;
}
.reels--ul::-webkit-scrollbar{
    width: 0;
    display:none;
}
.reels--ul li{
    margin-right: 20px;
    margin-bottom: 10px;
}
.reel--bubble{
    align-items:center;
    cursor:pointer;
    width: 80px;
    text-decoration: none;
    color: var(--font-black);
    margin:0px 10px 20px;
}
#usersProfile .reel--bubble span{
    color: var(--font-black);
    text-decoration: none;
}
h4.loading__error{
    font-weight: 400;
    font-size: 16px;
    color:#dc3545!important;
    background-color: var(--white);
    border-radius: 5px;
    padding: 5px 10px;
    margin:5px;
    text-align: center;
}
span.clear--search--box.voice__search__icon{
    font-size: 18px;
}
.voice__search__btn{
    width: 60px;
    height: 60px;
    padding: 8px;
    background-color: var(--gray);
    color:#606060;
    border-radius:50%;
    font-size: 13px;
}
.rhap_container{
    background-color: var(--white) !important;
    overflow: hidden;
}
.rhap_time{
    color: var(--light-black) !important;
}
.voice__search__option{
    width: 100%;
    align-items: center;
    text-align: center;
}
.voice__speach__listening{
    margin-top:10px;
    font-size: 16px;
    color: var(--second--gray);
    min-height: 30px;
}
.reel--bubble .reel--upper--container{
    position: relative;
    width:77px;
    height:77px;
    text-align:center;
    justify-content: center;
    align-items:center;
}
.reel--bubble .reel--upper--container .reel--upper--inner{
    position: relative;
    top:0;
    bottom:0;
    left:0;
    right:0;
    border: 1px solid var(--gray);
    text-align:center;
    align-items:center;
}
.reel--bubble .reel--upper--container .reel--upper--inner .reels__icon, .add__new__reels__ico{
    position: absolute;
    margin: 2px;
}
.reel--bubble .reel--upper--container .reel--upper--inner, .reel--bubble .reel--upper--container .reel--upper--inner .reels__icon{
    width:100% !important;
    height:100% !important;
    border-radius: 50px;
}
#usersProfile svg.add__new__reels__ico{
    border-radius: 50px;
    width: 100%;
    color: var(--font-black);
    font-size: 34px;
    font-weight: 800;
}
.reel--bubble .reel--upper--container .reels--new .reel--upper--inner{
    border: 1px solid var(--light-black) !important;
}
#usersProfile .reel--bubble span{
    font-weight:600;
    font-size:14px;
    white-space: nowrap;
    width:100%;
    overflow:hidden;
    text-overflow:ellipsis;
    display:block;
    text-align:center;
    text-transform: capitalize;
}
.liked__heart{
    color: rgb(237, 73, 86) !important;
}
.bottom--row--user-info span{
    font-size: 16px;
    line-height: 24px;
    white-space: pre-line;
    margin-bottom:4px;
    width:100%;
}
.flex-row{
    display: -webkit-flex;
    display: -moz-box;
    display: -ms-flexbox;
    display:flex;
    -webkit-box-align: stretch;
    -webkit-align-items:stretch;
    align-items:stretch;
    flex-shrink: 0;
    flex-direction: row;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
}
.flex-column{
    display: -webkit-flex;
    display: -moz-box;
    display: -ms-flexbox;
    display:flex;
    flex-direction: column;
}
.app-container{
    padding: 10px 4vw;
}
#YTVideo, #youtubeContent, .youtube--thumbnail--error{
    width: 100%;
    height: 100%;
}
#YTVideo{
    min-height: 565px;
}
#youtubeContent{
    height: 1;
    position: relative;
    background-color: #111;
}
.youtube--thumbnail--error{
    display: grid;
    place-content: center;
}
.youtube--thumbnail--error svg{
    font-size: 60px;
    color: var(--err-clr);
}
.desktop-comp{
   padding:
    var(--desktop-padding-top)
    var(--padding-sides)
    var(--desktop-padding-bottom)
    var(--padding-sides);
    max-width:1300px;
    min-width: 85%;
    min-height: calc(100vh - 10px);
    height:100%;
    background: var(--light-gray);
}
.ReactModal__Content{
    background-color: var(--modal-clr) !important;
}
.desktop-only{
    display:flex;
}
.article__post{
    white-space:pre-line;
    word-break: break-word;
    font-size:normal;
    user-select: none;
    line-height:1.2;
}
.space__between{
    display:flex;
    flex-direction: row;
    justify-content: space-between;
}
.verified_icon{
    color: var(--secondary-clr);
    font-size:15px;
    margin-left:6px;
    margin-bottom:0;
}
.backdrop{
    position: fixed;
    top:0;
    left:0;
    width:100%;
    height: 100vh;
    background-color: rgba(0,0,0,.5);
    z-index:1300;
    overflow-x: hidden;
}
.usersModal--container{
    position:fixed;
    top:50%;
    left:50%;
    transform: translate(-50%,-50%);
    z-index: 2500;
    -webkit-box-flex: 1;
    width:420px;
    max-height:400px;
    min-height:200px;
}
.usersModal--inner{
    margin:0px;
    align-items:center;
    justify-content:center;
}
a, abbr, acronym, address, applet, article, aside, audio, b, big, blockquote, body, canvas, caption, center, cite, code, dd, del, details, dfn, div, dl, dt, em, embed, fieldset, figcaption, figure, footer, form, h1, h2, h3, h4, h5, h6, header, hgroup, html, i, iframe, img, ins, kbd, label, legend, li, mark, menu, nav, object, ol, output, p, pre, q, ruby, s, samp, section, small, span, strike, strong, sub, summary, sup, table, tbody, td, tfoot, th, thead, time, tr, tt, u, ul, var, video {
    vertical-align: baseline;
}
.usersModal--card{
    position: relative;
    height:100%;
    border-radius:12px;
    width:100%;
    transition: all 0.5s linear;
    background-color: var(--modal-clr);
    box-shadow: 0 7px 27px 1px rgba(0,0,0,0.7);
}
.react-confirm-alert-body{
    background: var(--modal-clr);
    color: var(--tweet-txt-clr);
}
.userModal--card--header{
    text-align:center;
    height:43px;
    border-bottom: 1px solid var(--gray);
    justify-content:center;
    align-items:center;
}
.userModal--card--header h1{
    font-size:16px;
    font-weight:600;
    line-height:24px;
    -webkit-box-pack: center;
    flex-grow:1;
    text-transform: capitalize;
    vertical-align:baseline;
}
.userModal--card--body{
    width:99%;
    overflow-y:auto;
    overflow-x: hidden;
}
.modal--user--item{
    padding:8px 16px;
    justify-content:space-between;
    align-items:center;
    flex:1;
}
.modal--user--item h3{
    font-weight:600;
}
.userModal__close{
    position: absolute;
    right:4%;
    top:0px;
    font-size:24px;
    font-weight:500;
    cursor:pointer;
    z-index:1600;
    padding:7px 11px;
}
.txt_follow, .txt_unfollow{
    font-size: 12px;
    font-weight:600;
    display:inline;
    background-color: transparent;
    border: none;
    line-height: 14px;
    cursor: pointer;
    padding: 4px 9px;
    text-decoration: none;
}
.txt_follow:focus, .txt_unfollow:focus{
    outline: none;
}
.txt_follow:active, .txt_unfollow:active{
    background-color: rgb(229, 239, 250);
    border-radius: 5px;
}
.txt_follow{
    color: var(--secondary-clr);
}
.txt_unfollow{
    color:var(--font-black);
}
.userModal__close:active{
    background-color: rgba(51, 102, 145, 0.1);
    border-radius: 5px;
}
.modal--item--inner{
    align-items:center;
}
.modal--user--info{
    margin-left:8px;
}
.modal--user--info h3, .trim__txt{
    white-space: nowrap;
    text-overflow:ellipsis;
    overflow: hidden;
}
.modal--user--item .modal--user--info span{
    font-weight: 600;
}
.modal--user--item h3,.modal--user--item span{
    margin:0;
    font-size:14px;
    text-transform: none;
    line-height: 18px;
    text-overflow: ellipsis;
    overflow:hidden;
    display: block;
    white-space:nowrap;
}
.modal--user--item span{
    font-weight:400px;
    color: var(--second--gray);
}
.modal--user--item .MuiAvatar-root{
    height: 34px;
    width: 34px;
}
.MuiFormLabel-root{
    color: var(--light-black) !important;
}
/* -----x----------Global classes------x-------- */
.auth--main{
    width:100%;
    align-items:center;
    background-color: var(--light-gray);
    min-height:90vh;
}
time{
    text-transform: uppercase;
    font-size: 10px;
}
.auth--main .insta--warning{
    margin-top:8px;
    color: #737171;
    text-align:center;
}
.auth--inner{
    justify-content: center;
    gap: 0px;
}
#page {
    min-height: 57vh;
}
.auth--review--pic{
    margin: 30px 0px 0px;
    padding:0px;
    width:200px;
    height: 614px;
    min-width: 454px;
    flex-basis: 454px;
}
.auth--slide--content{
    margin: 99px 0 0 151px;
    position: relative;
    height: auto;
}
.auth--slide--content img{
    position: absolute;
    inset: 0;
    opacity:0;
    background-color: var(--white);
    pointer-events: none;
    height: 427px;
    width: 240px;
    transition: opacity 1.5s ease-in;
}
${loopThroughSlides({start: 1, finish: 5})}
#slideContent .active__slide{
    opacity: 1;
    visibility: visible;
    z-index:100 !important;
}
.auth{
    color:var(--main-black);
    font-size:14px;
    width:350px;
    margin-top:20px;
}
.auth .auth--upper--card, .auth .auth--bottom--card{
    background-color: var(--white);
    border: 1px solid var(--gray);
    border-radius:4px;
}
.auth .auth--upper--card{
     padding:15px 20px 18px;
     margin-bottom:15px;
}
.auth .auth--bottom--card{
    padding:16px 20px;
    font-size:15px;
    justify-content: center;
    text-align:center;
}
.auth .auth--bottom--card span {
    margin:0 auto;
    font-weight:400;
    font-size:14px;
    flex-wrap: wrap;
    word-break: keep-all;
    display:flex;
    color:var(--font-black);
    padding: 10px 0;
}
.MuiAvatar-root{
    object-fit: contain;
}
.increase--posts--count{
    width: 100%;
    margin-top:15px;
    padding:15px 0;
    align-items:center;
    justify-content: center;
    min-height: 32px;

}   
.increase--posts--count img{
        width: 32px;
        height: 32px;
}
.prof--input--row{
    justify-content: space-between;
}
.disabled__comments{
    font-size: 13px;
    font-weight: 400;
    color: var(--second--gray);
    text-align:center;
}
.auth--upper--card .auth--logo{
    align-items:center;
    margin: 0 auto;
}
.auth--upper--card .auth--logo img{
    margin: 22px 0 12px 8px ;
    width:175px;
    height:51px;
    object-fit:contain;
    cursor:pointer;
}
.auth--upper--card .auth--logo span svg{
    font-size:35px;
}
.auth--input--form{
    margin-top:17px;
    padding:0 20px;
}
.auth--input--form .forgot__pass{
    text-align:center;
    color:#0c8add;
    cursor:pointer;
}
.auth--input--form .recaptcha__box{
    width: 100%;
    margin-top:40px;
}
.auth--input--form .back__Btn{
    background: linear-gradient(90deg,rgb(255, 81, 0), rgb(211, 42, 20));
    color:var(--white);
    font-weight:600;
    margin:20px 0;
    border:none;
    padding:6px 10px;
    border-radius:5px;
    text-align:center;
    cursor:pointer;
    margin-bottom: 6px;
}
.auth--input--form input[type="submit"], .resetPassBtn,.auth--input--form button{
    background-color: var(--secondary-clr);
    color:var(--white);
    font-weight:600;
    margin:20px 0;
    border:none;
    padding:6px 10px;
    border-radius:5px;
    text-align:center;
    cursor:pointer;
    min-height: 35px;
}
.loading__btn{
    justify-content: center;
    align-items: center;
    text-align: center;
}
.auth--main .signIn--options--box{
    margin-top:9px;
}
.auth--main .divider--or{
    padding:8px;
    margin:10px 0 0;
    flex-wrap: nowrap;
}
.auth--main .animate--input .password__visibiliry__ico{
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    right: -7px;
    font-size: 19px;
    padding: 4px 7px;
    color: var(--font-black);
    cursor: pointer;
}
.auth--main .divider--or .div__or__start, .auth--main .divider--or .div__or__end{
    background-color: var(--gray);
    background-color: rgb(219, 219, 219);
    height:1px;
    flex-grow: 1;
    -webkit-box-flex:1;
    -webkit-flex-grow:1;
    position: relative;
    top: .50em
}
.auth--main .divider--or .div__or__middle{
    margin: 0 17px;
    font-size: 13px;
    font-weight:600;
    line-height: 18px;
    text-transform: uppercase;
    color:var(--second--gray);
    flex-shrink:0;
    flex-grow:0;
    -webkit-box-flex: 0;
    -webkit-flex-grow:0;
    -webkit-flex-shrink: 0;
}
.auth--input--form input[type="submit"]:focus, .resetPassBtn:focus, .auth--input--form button{
    border:none;
}
.auth--input--form input[type="submit"]:hover{
    background-color:#1d8cd6;
}
.auth .auth--bottom--card span strong{
    font-weight:600;
    padding:0;
    color: var(--secondary-clr);
    cursor:pointer;
    transition: color 0.2s ease;
    font-size: 14px;
    margin: 0 1px 0 6px;
}
.auth .auth--bottom--card span strong:active{
   color:#3b658b; 
}

.auth--signup--msg{
    text-align:center;
    padding: 0 20px;
    font-size:17px;
    color: var(--second--gray);
}
.auth__get__app{
    text-align:center;
    padding:20px 0;
    margin-bottom: 0;
}
.auth--available--stores .auth--stores--inner{
    margin:0 auto;
}
.auth--available--stores .auth--stores--inner > img{
    width:136px;
    height:40px;
    margin-right:8px;
    cursor:pointer;
}
.auth--footer--container{
    width:95%;
    align-self: center;
    flex-wrap:wrap;
    margin:60px 3vw 35px 4vw;
    justify-content:space-between;
    max-width: 1150px;
}
.auth--footer--container span{
    color: var(--second--gray);
    font-size: 12px;
    font-weight: 600;
    margin-bottom:2px;
}

.auth--footer--ul {
    margin:0;
    padding:0;
    flex-wrap:wrap;
    list-style:none;
    align-items:center;
    width: 100%;
    justify-content: center;
}
.auth--footer--ul li{
    color:var(--bluish-sky);
    font-size:12px;
    cursor:pointer;
    margin-right:10px;
    font-weight:400;
    text-transform: uppercase;
    transition: var(--mild-transition);
}
.auth--footer--ul li:active{
    color:#0e60ad;
}
.auth--footer--container  .auth--copyright{
    width: 100%;
    margin:0;
    padding:0;
}
.auth--footer--container  .auth--copyright, .auth--copyright--inner{
    text-align:center;
    overflow: hidden;
    justify-content: center;
    text-transform: uppercase;
}
.auth--footer--container  .auth--copyright, .auth--copyright--inner span{
    font-weight: 600;
}
.auth--copyright--inner select{
        padding:2px 6px 2px 7px;
}
.auth--footer--container  .auth--copyright, .auth--copyright--inner select{
    background: transparent;
    border: none;
    font-size: inherit;
    font-weight: inherit;
    color: inherit;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    cursor: auto;
}   
.auth--footer--container  .auth--copyright, .auth--copyright--inner .lang--selector{
    align-items: center;
    font-size: 13px;
    font-weight: 400;
    color: var(--second--gray);
    margin-right:9px;
}
.auth--footer--container  .auth--copyright, .auth--copyright--inner select:active{
    outline: none;
}

.auth--footer--container  .auth--copyright span{
    white-space: pre-wrap;
    word-break: break-word;
    font-size: 12px;
    font-weight: 400;
    color: var(--second--gray);
    line-height: 24px;
    pointer-events:none;
    width: 98%;
}
.auth--footer--ul li:hover{
    text-decoration:underline;
}
.emoji-picker-react .emoji-categories{
    flex-direction: row !important;
}
/*any weird behavior? comment this >>*/
article, div, footer, header, main, nav, section{ 
    -webkit-box-align:stretch;
    align-items:stretch;
    -webkit-box-orient: vartical;
    -webkit-box-direction:normal;
    display:flex;
    flex-direction:column;
    flex-shrink:0;
    padding:0;
    margin:0;
}
.people--also--liked{
    align-items:center;
    font-size: 14px;
    margin-bottom: 8px;
}
.people--also--liked span{
    padding-left:4px;
}
.people--also--liked p{
    font-size: inherit;
    font-weight: 400;
    margin-bottom:0;
    cursor: pointer;
    text-overflow: ellipsis;
    white-space: wrap;
}
.people--also--liked p .similar__followers__item{
    font-weight: 600;
    font-size: inherit;
    cursor: pointer;
    margin:0 5px 0 0;
    line-height: inherit;
}
.people--also--liked p strong.you--followed, .people--also--liked p strong.you__followed{
    font-size: inherit;
    font-weight: inherit !important;
    line-height: inherit;
}
.people--also--liked p strong.you--followed strong.other__likers{
    font-size: inherit;
    font-weight: 600;
}

.people--also--liked p strong.you--followed::before{
    content: ", ";
    color: var(--second--gray);
}
.people--also--liked .MuiAvatar-root{
    width:20px;
    height: 20px;
    object-fit: contain;
    margin-right: 7px;
}
#main--footer {
    background-color: var(--light-gray);
    padding-bottom: 10px;
    width: 100%;
}
#userProfFooter.userProfile--footer .auth--footer--ul{
    justify-content:center;
    text-align:center;
    margin-bottom:7px;
    width: 100%;
}
button:active{
    outline:none;
}
.profile--posts--container .buffererror{
    z-index: 4;
}
.buffererror{
    position: absolute;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content:center;
    z-index: 150;
    user-select: none;
    -moz-user-select: none;
    -webkit-user-drag: none;
}
.ReactModal__Overlay{
    z-index: 2000;
}
.load__failed__ico{
    font-size: 30px;
}
.blurry_img{
    backdrop-filter: saturate(190%) blur(20px);
    opacity: 0.9;
}
.logoText{
    font-family:"billabong";
    color: var(--font-black);
    margin-bottom:8px;
    width:103px;
    height:25px;
    font-size:31px;
    object-fit:auto;
    font-weight:500;
    text-decoration:none !important;
}
#header .logoText:active{
    color: gray;
    outline:none;
}
.invalid__input{
    border-radius:3px;
    border: 1px rgb(190, 10, 10) solid !important;
}
.user--typing--row{
    color: var(--second--gray);
}
.user--typing--row .messsage--sender--img{
    margin: 8px;
}
.user--typing--row, .user--typing--row .user_typing{
    align-items: center;
}
.user--typing--row h5{
    font-size: 13px;
    font-weight: 500;
    user-select: none;
    -webkit-user-drag: none;
    -webkit-user-select: none;
    margin-bottom:0;
}
.user--typing--row .user__typing__icon{
    font-size: 18px;
    margin-right:4px;
}
.auth--main .logoText{
    font-size:47px;
    font-weight: 500;
    margin-bottom:0;
    margin-left:4px;
    height:auto;
    width: auto;
}
.app__titles{
    color:var(--bluish-sky);
    text-transform: capitalize;
    font-size:19px;
    font-weight:bold;
    text-align:center;
    margin:15px 0;
}
.liked__double__click{
    opacity:0.9;
    color: rgb(255,255,255);
    font-size: 80px;
    margin:0;
    padding:0;
    top:50%;
    left:50%;
    transform: translate(-50%,-50%);
    z-index:100;
    filter: drop-shadow(rgb(0,0,0) 0px 0px 10px);
}
.liked__double__click__layout{
    top:0;
    left:0;
    width:100%;
    height:100%;
    background-color: rgba(0,0,0,0.07);
    z-index: 33;
}
.liked__double__click__layout, .liked__double__click{
    position:absolute;
    transition: all 0.4s ease;
}
.clickable{
     cursor:pointer;
}
.clickable:active{
    background-color: rgb(229, 239, 250);
    border-radius: 5px;
}

.global__loading span.global__loading__inner{
    height: 100%;
    background: #f09433;
    background: -moz-linear-gradient(45deg, #f09433 20%,#3bd175 25%,#dc2743 50%,#b120be 75%,#bc1888 100%); 
    background: -webkit-linear-gradient(45deg, #f09433 20%,#3bd175 25%,#dc2743 50%,#b120be 75%,#bc1888 100%); 
    background: linear-gradient(45deg, #f09433 20%,#3bd175 25%,#dc2743 50%,#b120be 75%,#bc1888 100%);
    background-size: 200% 200%;
    filter:progid:DXImageTransform.Microsoft.gradient( startColorstr='#f09433', endColorstr='#bc1888',GradientType=1 );
    animation: fakeLoading 0.8s ease-out 1, waveBg 2s ease infinite;
    -moz-animation: fakeLoading 0.8s ease-out 1, waveBg 2s ease infinite;
    -webkit-animation: fakeLoading 0.8s ease-out 1, waveBg 2s ease infinite;
    user-select: none;
}
.global__loading{
    padding: 0;
    margin:0;
    position: fixed;
    top:0;
    left:0;
    height:3px;
    z-index:6000;
    width: 100%;
    background-color: rgb(199, 199, 199);
}
.post--comment--row{
    padding:2px 0;
    justify-content:space-between;
    align-items:flex-start;
}
.post--comment--row .comment__user__avatar{
    width:32px !important;
    height: 32px;
    margin-right: 10px;
}
.post--comment--actions{
    align-items:center;
    white-space:nowrap;
    flex-wrap: nowrap;
    padding:3px 0 0 47px;
    max-width:200px;
}

.sub--comments--nav{
    list-style:none;
    padding-top:8px;
    padding-bottom: 0;
    margin-bottom: 0;
}
.sub--comments--nav .post--comment--item{
    padding:12px 7px;
    width: auto;
    background-color: var(--shadow-white);
    border-radius: 5px;
}
.sub--comments--nav .post--comment--item:last-of-type{
    padding-bottom: 0;
}
.sub--comments--nav li{
    margin-bottom:3px;
}
.post__view__replies__btn,
.post--comment--actions span{
    font-size:12px !important;
    color:var(--second--gray);
    line-height:14px;
    font-weight:500;
}
.post--comment--actions span{
    padding:2px 3px;
}
.post--comment--actions .acc-action{
    margin:0 5px 0px;
}
.long__dash{
    border-bottom: 1px solid var(--second--gray);
    width: 24px;
    margin-right: 8px;
    display: inline-block;
    height: 0;
}
.post__top__comment strong, .sub--comments--nav li strong{
    font-weight:600;
    text-overflow: ellipsis;
    margin-right:7px;
    white-space:nowrap;
    max-width:80%;
    cursor: pointer;
    display:inline;
}
.post__top__comment p, .sub--comments--nav li span{
    margin:0;
    font-size: 14px;
    text-overflow: ellipsis;
}
.desktop--caption .post__top__comment strong{
    margin:0 0 0 5px;
    font-weight: 600;
    font-size: inherit;
}
.desktop--caption .post__top__comment .comment__text{
    font-weight: 400;
    font-size: 14px;
}
.desktop--caption p{
    display: inline;
    margin:0 0 0 1px !important;
}
.desktop--caption .post--comment--actions{
    margin-top:-6px;
}
.post__view__replies__btn{
    cursor:pointer;
    margin-top: 16px;
    padding:0 4px 0px 40px;
}
.post__card__content{
    position: absolute;
    top:0;
    left:0;
    bottom: 0;
    right: 0;
    cursor:pointer;
    width:100%;
    height:100%;
    object-fit: cover;
    min-height: 100%;
    margin: auto;
}
/*-------------Messages-----------*/
.messages--container{
    height:100%;
}
#messages.messages--container .messages--desktop--card{
    border: 1px solid var(--gray);
    background-color: var(--white);
    min-height:85vh;
    height: 100%;
    position: relative;
    
}
#usersProfile.users--profile--container {
    padding-top: 19px;
}
.messages--main--container{
    display: grid;
    width:100% !important;
    max-width:1000px;
    margin: auto;
}
#usersProfile.users--profile--container .profile--user--info{
    padding: 0 16px 21px;
    margin-top:5px;
    width: 100%;
}
#messages.messages--container .messages--side, #messages.messages--container .messages--users--side{
        height:100%;
        vertical-align: baseline;
        align-items: stretch;
        -webkit-box-orient: vertical;
        -webkit-box-direction:normal;
        position:absolute;
        
}
#messages.messages--container .messages--chatlog--container{
    height:100%;
    position: relative;
}
#messages.messages--container .messages--users--side{
    flex-basis: 35%;
    left:0;
    top:0;
    width:35%;
    border-right: var(--main-border);
}
#messages.messages--container .mobile--users--sidedrawer #messagesUL{
    max-height:85%;
    overflow-y: auto;
}
#messages.messages--container .messages--side{
    flex-basis: 65%;
    width:65%;
    left:35%;
    top:0;    
}
#messages.messages--container .users--side--header{
    width:100%;
    padding:0px 19px;
    justify-content: flex-end;
    align-items:center;
    height:60px;
    border-bottom: var(--main-border);
    z-index:40;
}
#messages.messages--container .users--side--header span{
    margin: 0 auto;
    overflow: hidden;
    padding:1px;
    text-overflow: ellipsis;
    white-space: nowrap;
    width:100%;
    align-items:center;
}
#messages.messages--container .users--side--header span h4{
    flex:1;
    font-size: 16px;
    font-weight:600;
    text-align:center;
    margin:0;
}
#messages.messages--container .users--side--header span .pen__logo{
    padding:0 1px;
    margin-bottom:0;
    font-size:22px;
}   
#messages.messages--container .users--side--header span .pen__logo:active, .messages--users--side.mobile-only .pen__log:active, #usersProfile .my__settings__btn:active{
    background-color: rgb(184, 225, 248);
    border-radius: 5px;
}
.messages--top--nav{
    width:100%;
    height: 40px;
    padding:0px 12px;
    border-bottom: var(--main-border);
    overflow:hidden;
}
.messages--top--nav div{
    width:60%;
    align-items:center;
}
.messages--top--nav div h5{
    text-transform: uppercase;
    font-size:16px;
    font-weight:600;
    margin:0;
    cursor:pointer;
}
.messages--top--nav div h5:nth-child(1){
    padding:9px 0px;
    border-bottom: 1px solid black;
    margin-right:10px;
    z-index:200;
}
.messages--view--users{
    padding:8px 0px;
    overflow-y:auto;
    height: 100%;
}
.messages--view--users ul{
    padding:0;
    margin:0;
}
.messages--view--users ul li{
    padding:8px 15px;
    overflow-x:hidden;
    text-overflow:ellipsis;
    width:100%;
}
.messages--view--users ul li div > p{
    margin:0;
}
#messages .messages--view--users ul li .messages--user--info{
    width: 100%;
    margin-left:8px;
    align-items:center;
}
.my-empty--posts--container{
    width:100%;
    flex-wrap: wrap;
    background-color: var(--white);
    padding:0;
}
.saved--posts--container h6{
    font-size: 12px;
    font-weight: 400;
    color: var(--second--gray);
    margin-top: 32px;
    margin-bottom:16px;
    display: block;
}
.my-empty--posts--img{
    flex-basis: 40%;
}
.my-empty--posts--text--container{
    flex-basis:60%;
    align-items:center;
    justify-content:center;
    text-align:center;
    min-height: 300px;
}
.my-empty--posts--text--container h2{
    font-size: 18px;
    font-weight: 600;
}
.my-empty--posts--text--container h3{
    font-size: 16px;
    font-weight: 500;
    margin-top:10px;
}
.my-empty--posts--img img{
    width:100%;
    min-height: 100%;
    object-fit: contain;
}
.my--empty--posts--get--app{
    width:100%;
    flex-wrap: wrap;
    justify-content:center;
    margin-top:10px;
}
.my--empty--posts--get--app img{
    margin-right: 9px;
    height:40px;
    width:136px;
    cursor: pointer;
}

#messages .messages--view--users ul li .messages--user--info div{
    flex:1;
    margin-right:6px;
    font-weight:400;
    font-size:14px;
    line-height: 18px;
}
#messages .messages--user .MuiAvatar-root{
    height: 50px;
    width: 50px;
}
#messages .messages--user .like__noti__dot{
    left:8px;
    top:50%;
    width:7px;
    height:7px;
}
.messages--user--info div span.last__message{
    color: var(--second--gray);
    margin-top:2px;
}
.messages--user--info div span.last__message svg{
    font-size: 25px;
    font-weight:bold;
}
.mobile-only{
    display:none ;
}
.hide__loading__animation{
    display: none;
    opacity: 0;
    margin:0;
}
#messages .messages--user{
    cursor:pointer;
    transition: all 0.2s linear;
}
#messages .messages--user:hover{
    
    background-color:rgba(225,225,225,0.2);
}   
#messages .messages--empty--container{
    justify-content: center;
    align-items: center;
    height:100%;
}
#messages .messages--side--inner{
    width:70%;
    text-align:center;
    align-items:center;
    margin:0 auto;
}
#messages .messages--side--inner h3{
    display:block;
    font-size:22px;
    font-weight:400;
    margin:32px 0 -3px 0;
    line-height:28px;
}
#messages .messages--side--inner p{
    line-height:18px;
    font-weight:400;
    font-size:14px;
    color: var(--second--gray);
    margin:16px 0px 32px 0px;
}
#messages .messages__send__logo{
    font-size:70px;
    padding:15px;
    border:2px solid black;
    border-radius:50%;
    z-index: 50;
}
 
#messages .messages--side--inner button{
    background-color:var(--secondary-clr);
    padding:5px 9px;
    display:block;
    text-align:center;
    text-overflow:ellipsis;
    font-size:14px;
    font-weight:600;
    text-transform: capitalize;
    text-transform: inherit;
    line-height:18px;
    border-radius:4px;
    color: var(--white);
    border:none;
    transition: var(--mild-transition);
}
#messages .messages--side--inner button:hover{
    background-color: #0d7ac4;
}
#messages .messages--side--inner button:active{
    transform: scale(0.98);
    outline: 1px solid var(--white);
}
/* chat log */
.sender, .receiver{
    min-height:44px;
    padding: 16px;
    -webkit-box-align: stretch;
    max-width: 236px;
    margin-bottom:8px;
    z-index:3px;
    justify-items:center;
    border-radius:22px;
    position: relative;
    white-space: pre-wrap;
}
.sender .message--like--emoji, .receiver .message--like--emoji{
    cursor: auto;
}
.message--outer:hover .message--options{
    display: block;
} 
.sender{
    float: right;
    margin-left:auto;
    justify-content: flex-end;
}
.receiver{
    background: transparent;
    justify-content: flex-start;
}
#message .messsage--sender--img{
     margin:8px 8px 16px;
}
#message .messsage--sender--img, .user--typing--row .messsage--sender--img{
    width:24px;
    height: 24px;
    align-self: flex-end;
    object-fit: contain;
}
.message--outer{
    touch-action: manipulation;
    width:100%;
}
.message--outer .hidden--backdrop {
    z-index: 100;
}
.audio--content .audio__artwork__cover{
    width: 100%;
    height: 100%;
    object-fit: cover;
    cursor: pointer;
    background-color:var(--gray) ;
    min-height: 100%;
}
.rhap_container div{
    flex-direction: row;
}
.rhap_container .rhap_main{
    flex-direction: column !important;
}
.rhap_container .rhap_volume-bar-area{
    width: 70%;
}
.message--full--screen--ico{
    position: absolute;
    top:5%;
    right:8%;
    font-size:23px;
    color: var(--white);
    background-color: rgba(36, 36, 36, 0.4);
    border-radius: 5px;
    cursor: pointer;
    z-index: 100;
    padding: 1px;
}
.messages--user{
    background-color: var(--white);
}
.message--text{
    word-break: break-word;
    white-space:pre-line;
    font-size:14px;
    line-height:18px;
    font-weight:400;
    margin: -3px 0 -4px;
    text-transform: none;
    position: relative;
}
.message--like--emoji{
    animation: boundHeart 0.5s forwards ease;
    font-size: 41px;
}
.message--content{
 max-width: 300px;
 height: 372px;
 min-height: 200px;
 min-width: 210px;
 border-radius: 22px;
}
.message--video, .message--picture{
    background-color: var(--second--gray);
}
.message--content video, .message--content img{
    width: 100%;
    height: 100%;
    object-fit:contain;
    min-height: 100%;
    border-radius: 22px;
}
.message--content.message--document{
    background-color: rgb(238, 251, 252);
}
.message--options{
    position: absolute;
    top:50%;
    transform: translate(-50%,-50%);
    left:-20px;
    display: none;
}
#messages.messages--container .messages--user--info  .msg--info--btn{
    cursor: pointer;
    padding: 2px 10px;
}
#messages.messages--container .messages--user--info  .msg--info--btn:active{
    background-color: rgba(228, 252, 255, 0.5);
    border-radius: 5px;
}
.message--options .message--inner--options, #usersProfile .reel--list--item, #usersProfile .user--img--container, .message--picture{
    position: relative;
}
#usersProfile .user--img--container{
    width: 100%;
    position: relative;
    flex: 0 0 auto;
    overflow: hidden;
    max-height: 300px;
    -webkit-box-pack: start;
    -webkit-justify-content: flex-start;
    justify-content: flex-start;
    padding-bottom: 100%;
    background-color: var(--shadow-white);
}
.message--audio audio{
    width: 200px !important;
}
.message--options .message--inner--options .message--option::after{
    content: "";
    border-bottom: 7px solid var(--ultimate-black);
    border-right:7px solid transparent;
    border-left:7px solid transparent;
    position: absolute;
    bottom: -7px;
    right:8px;
    width:0;
    display:block;
    height:0;
    transform: rotate(180deg);
    box-shadow: inherit;
}
.message--options .message--inner--options svg{
    color: var(--second--gray);
    font-size: 20px;
    font-weight: 600;
    transition: color 0.2s ease-in;
    cursor: pointer;
}
.message--options .message--inner--options svg:hover{
    color: var(--ultimate-black);
}
.message--options .message--inner--options .message--option{
    position: absolute;
    top: calc(50% - 47px);
    left:-95px;
    background-color: var(--ultimate-black);
    transform-origin: bottom center;
    z-index:1500;
    padding:0px 2px;
    border-radius: 5px;
    box-shadow: rgba(0,0,0,0.3) 0 4px 22px;
    user-select: none;
    cursor: pointer;
}
.message--options .message--inner--options .message--option span{
     color: var(--white);
     text-transform: capitalize;
     font-size: 14px;
     font-weight:600;
     text-align:left;
     line-height: 18px;
     padding:6px 8px;
}
.message--options .message--inner--options .message--option span:active{
    background-color:rgba(255,255,255,0.3);
    border-radius: 6px;
}
.active-msg{
    background-color: var(--shadow-white) !important;
    cursor: auto;
    pointer-events: none;
}
.messages--chatbox--header{
    padding: 9px 15px;
    align-items:center;
    width:100%;
    height:60px;
    border-bottom: var(--main-border);
    white-space:nowrap;
    justify-content: space-between;
}
.messages--chatbox--header .MuiAvatar-root{
    width:30px;
    height:30px;
    margin-right: 11px;
}   
.mobile--users--sidedrawer .messages--chatbox--body{
    height:85%;
}
#messages.messages--container .messages--chatbox--body{
    padding:44px 20px 20px;
    height:75%;
    overflow-y: auto;
    overflow-x: hidden;
    position: relative;
}
#messages.messages--container .user_on_chat{
    font-size: 15px;
    margin: 0 5px;
}
#messages.messages--container .messages--user--info {
    align-items:center;
    z-index:100;
}
.react-confirm-alert-button-group{
    flex-direction: row;
    margin-top: 10px;
}
#messages.messages--container .messages--user--info p{
    flex:1;
    margin-bottom:0;
    font-size:16px;
    font-weight:600;
    align-items: center;
}
#messages.messages--container .messages--user--info p, #messages.messages--container .messages--user--info .last__message{
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
#messages.messages--container .messages--user--info div{
    flex:0;
    font-size: 24px;
}
#usersProfile .sugg__btn{
    padding:0 12px !important;
    font-size: 20px !important;
}
#usersProfile .sugg__btn:focus{
    outline: 0 !important;
}
.getting--started--container{
    width:100%;
    overflow-x:auto;
    overflow-y: hidden;
    max-width: 100%;
    align-items:center;
    margin-bottom:0;
    min-height: 50px;
    align-content: flex-start;
    transition: all 0.5 ease-in;
    white-space: nowrap;
    display:block;
    max-width: 614px;
}
#usersProfile .suggestions--list--container{
    width:auto;
    -webkit-box-align: stretch;
    justify-content:flex-start;
    overflow-x: auto;
    gap:10px;
    flex-wrap: nowrap;
    padding:0px 10px 10px 10px;
    scrollbar-width: none;
    -ms-overflow-style: none;
}
ul.getting--started--inner li.getting--started--box{
    min-width: 170px;
}
div.suggestion--item-inner{
    justify-content: space-between;
    height:100%;
}
ul.getting--started--inner li.getting--started--box .plus--icon--container svg{
    font-size: 27px;
}
ul.getting--started--inner li.getting--started--box .plus--icon--container{
    width: 55px;
    height: 55px;
}
ul.getting--started--inner li.getting--started--box .GSTitle{
    text-transform: capitalize;
    font-size: 16px;
    font-weight: 600;
    margin: 8px 0;
    white-space: normal;
}
ul.getting--started--inner li.getting--started--box .GSDescription{
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 15px;
    color: var(--second--gray);
    white-space: normal;
}
ul.getting--started--inner li.getting--started--box .profile__btn.primary__btn{
    padding:0 5px !important;
    background-color: #DD2A7B;
    border:1px solid #DD2A7B;
    transition: all 0.2s ease-out;
}
ul.getting--started--inner li.getting--started--box .profile__btn.primary__btn:hover{
    background-color: #d1558d;
    border:1px solid#d1558d;
}
ul.getting--started--inner{
    overflow-x:auto;
}
.voxgram--set--up--conainer{
    width: 100%;
    overflow: hidden;
}
#usersProfile .suggestion--items, ul.getting--started--inner{
    width:100%;
    padding-left:10px;
    flex-wrap:nowrap;
    white-space: nowrap;
}
#usersProfile .suggestions--list--container::-webkit-scrollbar, #usersProfile .suggestion--items::-webkit-scrollbar, ul.getting--started--inner::-webkit-scrollbar{
    width:0px;
    display:none;
}
#usersProfile ul.suggestions--p--ul{
    max-width: 100%;
    overflow-x: auto;
}
#usersProfile .my__settings__btn{
    background: transparent;
    border: none;
    font-size: 25px;
    color: var(--font-black);
}
.ReactModal__Overlay{
    z-index: 6000;
}
#usersProfile .suggestion--item, .getting--started--box{
    padding:20px;
    position: relative;
    border: 1px solid var(--gray);
    background-color: var(--white);
    margin-right: 18px;
    width: 180px;
    height:auto;
    border-radius:4px;
    align-items:center;
    justify-content: center;
    text-align:center;
}
#usersProfile .suggestion--item span, #usersProfile .suggestion--item p,.getting--started--box span, .getting--started--box p{
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    width: 100%;
}
#usersProfile .acc__name, #usersProfile .user__name{
    font-weight:600;
    font-size:14px;
    white-space:nowrap;
    text-overflow:ellipsis;
}
#usersProfile .user__name{
    color: var(--second--gray);
    margin:  0;
    padding: 6px 0;
}
#usersProfile .suggestion--item-inner .MuiAvatar-root{
    width:49px !important;
    height:49px !important;
    margin:0 auto;
    cursor: pointer;
}
.link--element{
    color: var(--links-clr);
    cursor: pointer;
    display: inline;
}
.link--element:hover{
    text-decoration: underline;
}
#home .suggestion--item .MuiAvatar-root{
    width:32px;
    height:32px;
    cursor: pointer;
}
#usersProfile .user__sugg__title__title{
    color: var(--second--gray);
    flex: 1 auto;
}
#usersProfile .users--suggestions--container{
    border: 1px solid var(--gray);
    background-color: var(--white);
    overflow: hidden;
    padding:4px 0;
    position: relative;
    border-radius: 4px;
    margin-bottom:20px;
    margin-top: 16px;
    width: 100%;
}
#usersProfile .user--sugg--header{
    padding:10px 20px;
    width:100%;
}
.user__see__all__btn{
    color: var(--font-black);
    display:block;
    font-size:12px !important;
    font-weight:600;
    text-transform: capitalize !important;
}
#usersProfile .profile--more--btn{
    padding: 9px 7px;
    border-radius:50px;
    cursor: pointer;
    text-align:center;
}
#usersProfile .profile--more--btn svg{
    font-size:24px;
    fill:rgb(38, 38, 38);
}
#usersProfile .profile--more--btn:active{
    background-color: rgba(0,0,0,0.05);
}
#messages.messages--container .chat--emojis--box{
    width:100%;
    position: absolute;
    bottom:68px;
    padding:6px 20px;
    left:0;
    border: var(--main-border);
    border-radius:22px;
    align-items:center;
    justify-content:center;
    background: linear-gradient(90deg, rgba(255, 123, 0,0.3), rgba(236, 57, 13,0.3));
    z-index: 1200;
    flex-wrap:nowrap;
    white-space:nowrap;
    overflow-x: auto;
    user-select: none;
}
#messages.messages--container .chat--emojis--box::-webkit-scrollbar{
    width:0;
}
#messages.messages--container .chat--emojis--box span{
    padding: 1px 6px;
    margin-right:5px;
    font-size:22px;
    cursor:pointer;
}
#messages.messages--container .messages--bottom--form{
    position: absolute;
    bottom:0;
    left:0;
    width:100%;
    padding:20px;
    align-items:center;
    background-color:var(--white);
    z-index: 100;
}
#messages.messages--container .messages--bottom--form form{
    width:100%;
    border: var(--main-border);
    border-radius: 22px;
    /* min-height:44px; */
    padding:3px 8px 3px 11px;
    z-index:90;
    align-items:center;
}
#messages.messages--container .messages--bottom--form .form--input--container{
    width: 90%;
}
#messages.messages--container .messages--bottom--form form:hover{
    box-shadow: 0px 2px 10px rgba(26, 25, 25, 0.1);
}
#messages.messages--container .messages--bottom--form .message__input{
    border:none;
    padding:10px 9px;
    flex:1;
    background-color: var(--white);
}
#messages.messages--container .messages--bottom--form .message__input:focus{
    outline:none;
}
#messages.messages--container .messages--bottom--form input[type="submit"], .msg__send__btn{
    border:none;
    background-color: transparent;
    color:var(--secondary-clr);
    font-size:14px;
    font-weight:600;
    cursor:pointer;
    padding-right: 2px;
}
#messages.messages--container .messages--bottom--form .message--mini--toolbox{
    position: absolute;
    top:50%;
    transform: translate(-50%, -50%);
    z-index:500;
    right:0;
    width:auto;
    align-items:center;
}
#messages.messages--container .messages--bottom--form .message--mini--toolbox .message--pic--ico, #messages.messages--container .messages--bottom--form .message--mini--toolbox .message--heart--ico{
    padding:1px 2px;
    cursor: pointer;
    margin-right:8px;
    user-select: none;
}
#messages.messages--container .messages--bottom--form .message--mini--toolbox svg:active{
    background-color: rgba(178, 212, 226, 0.7);
    border-radius: 4px;
}
#messages.messages--container .messages--bottom--form .message--mini--toolbox .message--pic--ico{
    font-size:27px;
}
#messages.messages--container .messages--bottom--form .message--mini--toolbox .message--heart--ico{
    font-size:23px;
}
.smiley__icon{
    font-size:24px;
    cursor: pointer;
}
#messages.messages--container .messages--bottom--form .message--mini--toolbox .message--heart--ico:last-of-type{
    margin:0;
    padding-right:0;
}
.form--input--container--inner{
    position: relative;
    width: 90%;
    align-items: center;
}
.form--input--container--inner .emoji-picker-react{
    position: absolute;
    top: -378px;
    z-index: 250;
    left: -10px;
    margin:0;
    padding:0;
}
.form--input--container{
    width: 100%;
    align-items: center;
}
.emoji-picker-react ul.skin-tones-list label{
    width: 15px;
}
#contentUploader, #fileUploader {
    display: none;
    visibility: hidden;
    opacity: 0;
}

#messages.messages--container .loading--message--container{
    width: 100%;
    height: 372px;
    align-items: center;
    justify-content: flex-end;
    color: var(--white);
}
#messages.messages--container .loading--message--container h5{
     font-weight: 500;
     font-size: 16px;
}
#messages.messages--container .loading--message--container .loading--message--inner{
    position: relative;
    border-radius: 22px;
    align-items: center;
    justify-content: center;
    width: 230px;
    height: 270px;
    background: radial-gradient(circle at 30% 107%, #fdf497 1%,#ffc63f 10% , #fd3358 45%,#bc35d8 60%);
    border-radius: 22px;
    background-size: 200% 200%;
    animation: waveBg 5s ease infinite;
    -moz-animation: waveBg 5s ease infinite;
    -webkit-animation: waveBg 5s ease infinite;
}

#messages.messages--container .loading--message--container .loading--message--anim{
    font-size: 90px; 
}
/*------x---------Messages------x------*/
/* ----------user's profile----------- */
#usersProfile.users--profile--container, .messages--container {
    background-color: var(--light-gray);
}
#usersProfile.users--profile--container .user--pic--container{
    flex-basis:30%;
    align-items:center;
    position: relative;
}
#usersProfile.users--profile--container .desktop--inner--info{
    width:100%;
    margin:0;
    flex-basis:70%;
}
.usersModal--card .new--msg--header{
    width: 100%;
    align-items: center;
    padding: 3px 8px;
    height: 43px;
    justify-content:space-between;
}
.usersModal--card .new--msg--send--to{
    border-top: var(--main-border);
    border-bottom: var(--main-border);
    align-items: center;
    padding: 8px 7px;
    max-height: 250px;
    overflow-y: scroll;
    overflow-x: hidden;
}
.usersModal--card .new--msg--send--to form{
    width: 95%;
}
.usersModal--card .new--msg--send--to h4{
    padding-right: 12px;
    font-size: 16px;
    text-transform: capitalize;
    font-weight: 600;
    margin-bottom:0;
}
.usersModal--card .new__msg__title{
    font-size: 16px;
    line-height: 24px;
    font-weight: 600;
    padding: 4px 8px;
}
.usersModal--card .new__msg__close{
    font-size: 25px;
    font-weight: 400;
    padding: 4px 8px;
    cursor: pointer;
}
.usersModal--card .new__msg__search{
    border-radius: 6px;
    line-height: 24px;
    padding: 4px 12px;
    overflow: visible;
    font-size:14px;
    color: var(--light-black);
    margin:0;
    border: none;
    flex-grow: 1;
}
.usersModal--card .new__msg__search::placeholder{
    color: var(--second--gray);
}
.usersModal--card .new__msg__search:focus, #usersProfile .my__settings__btn:focus{
    outline: none;
}
.new--msg--body{
     max-height: 250px;
     overflow-y: auto;
}
.new--msg--body button.msg_mobile_btn{
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: var(--secondary-clr);
    z-index: 5000;
    color: var(--white);
    font-weight: 600;
    font-size: 16px;
    padding: 9px 15px;
}
.messages--users--side.mobile-only .pen__logo__container{
    justify-content: center;
}
.messages--users--side.mobile-only .pen__logo{
    font-size: 24px;
    padding:3px;
}
.new--msg--body .suggestions--list ul{
    padding:15px 0 10px 0;
    justify-content: center;
    overflow-x:hidden;
    height: 100%;
    min-height: 150px;
}
.new--msg--conainer .new__msg__username{
    padding:10px 12px;
    background-color: #e0f1ff;
    position: relative;
    color: var(--secondary-clr);
    height:35px;
    border-radius: 4px;
    align-items:center;
    margin-right:5px;
}
.new--msg--conainer .new__msg__username .new__msg__del__name{
    padding:0px 0px 0px 8px;
    cursor:pointer;
}
.new--msg--conainer .new__msg__username span{
    font-size: 24px;
    font-weight: 400;
    color: inherit;
}
.new--msg--body h4.new__msg__sugg__title{
    font-size: 16px;
    font-weight: 600;
    margin-left: 15px;
    padding: 10px 6px 6px;
    margin-bottom: 0;
}
.new--msg--body .suggestions--list ul li.suggestion--item{
    align-items: center;
    justify-content:space-between; 
    padding: 7px 17px;
    cursor: pointer;
}
.new--msg--body .suggestions--list ul li.suggestion--item:hover{
    background-color: var(--shadow-white);
}
.new--msg--body input.new__msg__radio{
    cursor:pointer;
    padding:5px 8px;
}
.new--msg--body .suggestions--list ul li.suggestion--item .side--user--info{
    padding-top: 0px;
}
.new__msg__textarea__body{
    width: 100%;
    max-height: 150px;
    resize:none;
    min-height: 90px;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 8px;
}
.new--msg--body .suggestions--list ul li.suggestion--item .MuiAvatar-root{
    width: 44px;
    height: 44px;
}
.profile__btn{
    text-align:center;
    font-size:14px;
    font-weight:600;
    line-height:28px;
    outline:0;
    overflow:hidden;
    text-overflow:ellipsis;
    cursor:pointer;
    text-transform: capitalize;
    appearance:none;
    word-wrap: keep-all;
    white-space: nowrap;
}
.profile__btn:active{
    outline: none !important;
}
.private-acc{
    background-color: var(--white);
}
.private-acc .empty--posts--container{
    height: 350px ;
}
.private-acc .plus__icon{
    font-size:34px;
}
.voxgram--greeting{
    width: 100%;
    background-color: var(--white);
    padding:20px;
    border: 1px solid var(--gray);
    border-radius: 2px;
}
.voxgram--greeting .primary__btn{
    padding: 5px 10px;
    width: 90%;
    margin: 10px auto 0 auto;
    font-size: 15px;
}
.voxgram--greeting .empty--card .plus--icon--container svg{
    margin:0;
}
.getting--started--container h4{
    font-size: 16px;
    font-weight: 600;
    margin: 30px 0 15px 0;
}
.unselectable, .logoText{
    user-select: none;
    -webkit-user-drag: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    pointer-events: none;
}
.primary__btn{
    border-radius:3px;
    border:1px solid var(--secondary-clr);
    background-color:var(--secondary-clr);
    /* background-color:#63baf4; */
    padding:0 20px;
    color:var(--white);
    transition:background-color 0.2s linear ;
}
.reuqest-item button{
    padding: 0 9px;
}
.reuqest-item button:first-of-type{
    margin-right: 7px;
}
.option__modal__btn{
    width: 100%;
    cursor: pointer;
    border:none;
    background: transparent;
    padding:12px 8px;
    border-bottom: 1px solid var(--gray);
}
.primary__btn svg{
    width: 15px;
    height: 15px;
}
.primary__btn:hover{
    background-color:#34a3ee;
}
.primary__btn:active{
    color:rgb(224, 224, 224);
}
.prof__btn__unfollowed{
    border-radius:4px;
    border:1px solid var(--gray);
    padding:0px 9px;
    background-color: transparent;
    color:var(--font-black);
}
.prof__btn__unfollowed:focus, .primary__btn:focus{
    outline: none;
}
a.prof__btn__unfollowed{
    color:var(--font-black);
}
.prof__btn__unfollowed:hover{
    text-decoration: none;
}
.prof__btn__unfollowed a {
    color:var(--font-black);
    text-decoration: none;
}
.prof__btn__unfollowed:active{
    color:#424242 !important;
    background-color: #f1f1f1;
}
#usersProfile.users--profile--container .users__profile__image{
    width:100%;
    object-fit:cover;
    cursor:pointer;
    margin:auto;
    height: 100%;
    padding:0;
    min-height:100%;
    position: absolute;
    top:0;
    left: 0;
    right: 0;
    bottom: 0;
}
#usersProfile .user--img--container:hover .user--img--cover{
    display:flex;
    z-index: 6;
}
#usersProfile .owner--post--name{
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
}
#usersProfile .user--img--cover{
    position:absolute;
    top:0;
    left:0;
    width:100%;
    height:100%;
    background-color: rgba(0,0,0,0.3);
    justify-content:center;
    align-items:center;
    text-align:center;
    color: #fff;
    font-size: 21px;
    cursor:pointer;
    display:none;
    overflow-x: hidden;
    transition: all 0.5 ease-in;
}
#usersProfile.users--profile--container .user--top--info{
    width:100%;
    padding:10px 0 44px;
    align-items:center;
    justify-content:space-between;
    min-height: 220px;
}
.similar__followers{
 padding-left: 0;
 color: var(--second--gray);
 font-size: 12px;
 display: block;
 line-height: 14px;
 margin-top: 14px;
 font-weight: 500;
 cursor: pointer;
}
.similar__followers__item{
    margin:0 0 5px 0 !important;
    font-size: inherit; 
    font-weight: inherit;
    color:var(--font-black) !important;   
    cursor: pointer;
}
.similar__followers__item:hover{
    text-decoration: underline;
}
.full--width {
    width: 100%;
}
.similar__followers__item::after{
    content: ",";
    color: var(--second--gray);
}
.similar__followers__item:last-of-type{
    margin:0 !important;
}
.similar__followers__item:last-of-type::after{
    content: "";
    display: none;
}
.bd--wish{
    font-size: 15px;
    font-weight: 400;
    color: rgb(10, 44, 83);
    margin-top:5px;
    cursor: pointer;
}
.online__user{
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: linear-gradient(rgba(111, 201, 111, 1), rgba(37, 224, 37, 1) ) ;
    border:1px solid var(--white);
    display: inline-block;
    margin-left: 5px;
}
.activity--container{
    margin-bottom: 10px;
}
.activity--container small{
    font-size: 14px !important;
    color: var(--second--gray);
    font-weight: 400;
    text-transform: none ;
    line-height: 14px;
}
.activity--container small time{
    text-transform: inherit !important;
    font-size: inherit;
    font-weight: inherit;
}
.activity--container .online--status{
    align-items:center;
}
.user-top-inner{
    margin:0 auto;
    flex-wrap: wrap;
    width:80%;
}
#usersProfile.users--profile--container .desktop--social--row p{
    padding:2px 6px 2px 0px;
    margin-right:30px;
    font-weight:400;
}
#usersProfile.users--profile--container .desktop--social--row p span{
    font-weight:600;
}
#usersProfile.users--profile--container .MuiAvatar-root{
    width:120px;
    height: 120px;
}
#usersProfile.users--profile--container .users--profile--stripe{
    width:100%;
    padding:0;
    border-top: 1px solid var(--gray);
    justify-content:center;
}
#usersProfile.users--profile--container .users--profile--posts{
    -webkit-display: grid;
    display:grid;
    grid-template-columns: repeat(3, 1fr);
    gap:25px;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
}
.users--profile--rowLine{
    margin:0 auto;
    gap:10px;
    width: 70%;
}
.message--pic--fullScreen{
    z-index: 2000;
    position: fixed;
    top:50%;
    left:50%;
    transform: translate(-50%, -50%);
    height: auto ;
    
}
.message--pic--fs--close{
    position: fixed;
    top: 5%;
    right:8%;
    padding:15px;
    font-size: 33px;
    font-weight: bold;
    color: rgb(230, 230, 230);
    z-index: 2000;
    cursor: pointer;
    background-color: rgba(0,0,0,0.4);
    border-radius: 5px;
}
.message--pic--fs--close:hover{
    color: var(--white);
}
.message--pic--fullScreen .pic--fullScreen--inner{
    width: 80%;
    height: 80vh;
    min-width: 300px;
    background-color: var(--white);
    border-radius: 10px;
    align-items: center;
    justify-content:center;
    padding:10px;
    border: 1px solid var(--second--gray);
    margin:10px;
}
.message--pic--fullScreen .pic--fullScreen--inner img{
    width: 100%;
    height: 100%;
    min-height: 300px;
    object-fit: contain;
}
.users--profile--stripe .profile--stripe--inner{
    margin:0 auto;
    justify-content: space-between;
    max-width:380px;
    align-items: center;
}
.users--profile--stripe .profile--section--item{
    cursor: pointer;
    font-weight: 600;
}
.users--profile--stripe .profile--section--item svg{
    font-size:14px;
    font-weight: inherit;
    
}
.users--profile--stripe .profile--section--item strong{
    text-transform: uppercase;
    font-size: 12px;
    font-weight: inherit;
    margin-left: 7px;
}
.users--profile--stripe .profile--stripe--inner span{
    font-size:30px;
    padding:10px;
    height: 52px;
    margin-right:10px;
    align-items: center;
    justify-content: center;
    margin-right: 8px;
}
.noti__bar__img{
    width:40px;
    height:40px;
}
#usersProfile.users--profile--container .users--action--row{
    max-width:450px;
    flex-wrap:nowrap;
}
#usersProfile.users--profile--container .profile__display__name{
    font-size:28px;
    line-height:32px;
    white-space:nowrap;
    word-break: keep-all;
    text-align:left;
    text-overflow: ellipsis;
    overflow:hidden;
    max-width: 210px;
    font-weight: 300;
    display: block;
}

#usersProfile.users--profile--container .users--action--row,
#usersProfile.users--profile--container .desktop--social--row p{
    align-items:center;
    justify-content:space-between;
    font-size:16px;
}
#usersProfile.users--profile--container .users--action--row div,
#usersProfile.users--profile--container .users--action--row h5{
    flex-basis:48%;
    margin-bottom:19px;
}
#usersProfile.users--profile--container .users--action--row div > button{
    margin-right: 15px;
}
#usersProfile.users--profile--container .users--action--row div > button:last-of-type{
    margin-right:0;
}
.rotate {
    -webkit-animation:spin 1s linear infinite;
    -moz-animation:spin 1s linear infinite;
    animation:spin 1s linear infinite;
}
/* ---x-------user's profile----x------- */
/* ---------------Mobile Notifications------------------ */
#mobNotifications.mob--notifications{
    padding:10px 10px 50px;
    overflow:hidden auto;
}
.mob--notifications--container{
    width:100%;
}
#mobNotifications.mob--notifications .noti--popup-item{
    padding:12px 0 13px;
    position:static;
}
#mobNotifications.mob--notifications .noti--popup-item:hover{
    background-color:var(--light-gray);
}   
#mobNotifications.mob--notifications .noti--popup-item .noti--user--info{
    width:70%;
}
#mobNotifications.mob--notifications .noti--popup-item .noti--user--info h6{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
 }
.mob--notifications{
 height:calc(100vh - 50px);
}
.mob--notifications--container{
    padding-top:0px;
}
.mob--notifications--container .mob--noti--title{
    padding:2px 10px;
    text-overflow:ellipsis;
    border-bottom: 1px solid rgb(236, 236, 236);
    width:100%;
    background-color: var(--light-gray);
    position: sticky;
    top:50px;
    left:0;
    z-index: 1000;
}
.mob--notifications--container .mob--noti--title h4{
    font-size:16px;
    font-weight: 700;
}

#mobNotifications.mob--notifications .noti--popup-item:after{
    border:none !important;
}
.noti--popup-item .noti--row{
    width:70%;
    white-space: normal;
}
.follow__loading__ico{
    font-size: 15px !important;
}
.requests--bubble{
    background-color: rgb(231, 69, 69);
    font-size: 15px;
    border-radius: 5px;
    color: var(--white);
    display: inline-block;
    padding: 2px 7px;
}
.requests--button:hover{
    background-color: var(--light-gray);
}
/* ------x---------Mobile Notifications------x------------ */
/* -------------------Comments Modal----------------------- */
#commentsModal.comments--modal--container{
    position:fixed;
    top:50%;
    left:50%;
    transform: translate(-50%,-50%);
    z-index:1600;
    margin:0;
    padding:0;
    background-color:var(--white);
    border-radius:12px;
}
#commentsModal.comments--modal--container .comments--modal--card{
    position: relative;
    z-index:1800;
    padding: 0;
    min-height:200px;
    width:400px;
    height: 400px;
    transition: all 0.5s linear;
}

#commentsModal.comments--modal--container .comments--modal--card .comments--modal--inner{
    height: 340px;
    overflow:hidden auto;
}
#commentsModal.comments--modal--container .post--comment--item{
    padding:1px 8px;
}
.post--comment--item{
    padding:1px 8px 16px 8px;
}
.post__card__content__outer{
    width: 100%;
    height: 100%;
    display: block;
    overflow: hidden;
    position: relative;
    touch-action: manipulation;
    display: flex;
    -webkit-box-flex:1;
    user-select: none;
    -webkit-user-select: none;
    -webkit-tap-highlight-color: transparent;
    max-height:750px;
    min-height:130px;
}
.post__card__content__middle{
    position: relative;
    padding-bottom: 125%;
    display: block;
    overflow: hidden;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.102);
}
.post__card__content__video{
    position: absolute;
    width: 100%;
    height:100%;
}
#commentsModal.comments--modal--container .comments--modal--header{
    position: relative;
    padding:4px 10px;
    background-color: rgb(252, 252, 252);
    border-bottom: 1px solid rgb(228, 228, 228);
    border-radius:12px;
}
#commentsModal.comments--modal--container .comments__close__modal{
    position: absolute;
    top:4px;
    right:15px;
    font-size:29px;
    font-weight: 800;
    cursor:pointer;
}
#commentsModal.comments--modal--container .comments--modal--header h4{
    text-align:center;
    font-size:15px;
    font-weight:700;
}
#commentsModal.comments--modal--container .comments--modal--card .post--bottom--comment--adding{
    position: fixed;
    bottom:0px;
    left:0;
    width:99%;
    margin:0;
    background-color:var(--white) !important;
    border-radius: 12px;
}
/* --------x-------------Comments Modal------------x---------- */
/* ---------------------Empty page------------------ */
.empty--posts--container{
    padding:4px 8px;
    height: 450px;
    width:100%;
   
}
.plus--icon--container, .empty--posts--container{
    justify-content: center;
    align-items:center;
    text-align:center;
}
.empty--posts--container span{
    color: var(--secondary-clr);
    font-weight: 600;
    word-break: break-word;
    font-size:15px;
}
.empty--posts--container h3{
    font-weight:400px;
    padding:12px 0;
}
.empty--posts--container p, .text--size--2{
    color: var(--second--gray);
    font-size:15px;
    line-height: 20px;

}
.empty--posts--container p:hover{
    text-decoration: underline;
}
.usersModal--container .empty--card svg, #messagesUL .empty--chat--box{
    font-size: 50px;
    font-weight: bolder;
    margin-bottom: 8px;
}
.usersModal--container .empty--card h2{
    font-size: 1.3rem;
}
.usersModal--container .empty--card h4{
    font-size: 0.9rem;
}
#messagesUL .empty--chat--box{
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    text-align: center;
    justify-items: center;
    align-items: center;
    padding-top: 10px;
}
.empty--card{
    display: flex;
    flex-direction:column;
    align-items: center;
    justify-content:center;
    min-height: 100px;
    text-align:center;
    padding:16px;
}
.empty--card .plus--icon--container{
    width: 50px;
    height: 50px;
    margin-bottom: 8px;
}
.empty--card .plus--icon--container svg{
    font-size: 28px;
    margin-top: 3px;
}
.empty--card h2{
    font-size: 1.5rem;
    color: var(--font-black);
    font-weight: 400;
    margin-bottom: 14px;
}
.empty--card h4{
    font-size: 1rem;
    font-weight: 400;
    color: var(--second--gray);
}
.plus--icon--container{
    border: 2px solid var(--main-black);
    border-radius:50%;
    padding:7px;
    color:var(--main-black);
    width:60px;
    height:60px;
    margin:0 auto;
}
.plus--icon--container .plus__icon{
    font-size: 30px;
}
.prof--acc--website a{
    font-size: 16px; 
    font-weight: 600;
    color:#00376B;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    text-decoration:none;
    display: inline;
    width: max-content;
}
.prof--acc--name h1{
    display: inline;
    color: var(--font-black);
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    word-break: break-word;
    margin-bottom: 0px;
}
.prof--acc--name br, .prof--acc--category br{
    content: "";
    word-break: break-word;
    font-size: 16px;
}
.prof--acc--category span {
    color: var(--second--gray);
    line-height:20px;
    font-size: 16px;
    /* font-weight:400; */
    margin-bottom: 2px;
}
.home--footer{
    padding:0 10px;
    color: #c7c7c7;
    color: rgb(199, 199, 199);
    font-size:11px;
    font-weight:400;
    text-decoration:none;
}
.home--footer ul{
    padding:0;
    margin:0;
    list-style:none;
    align-items:center;
    flex-wrap: wrap;
    white-space: pre-wrap;
    margin-bottom:19px;
}
.home--footer ul li{
    line-height:13px;
    text-transform: capitalize;
    /* margin-right:8px; */
    font-size: inherit;
    font-weight: inherit;
    cursor:pointer;
}
.home--footer ul li::after{
    content: " • ";
}
.home--footer ul li:last-of-type::after{
    content: "";
    display:none;
    width:0;
}
.home--footer .home--footer--copyright{
    text-transform: uppercase;
}
.requests--noti .noti--popup-item .noti--row, .requests--button .noti--popup-item .noti--row{
    width: auto;
}
.change--photo .MuiAvatar-circle{
    width:50px;
    height: 50px;
}
.change--photo {
    flex-wrap: wrap;
   margin: 20px 0px 0px;
   width: 100%;
   align-items: center;
   padding: 4px 0;
 }
 .user__prof__name{
    padding:2px 2px 0;
    margin-bottom:3px;
    font-size:20px;
    color: var(--font-black);
    line-height: 22px;
    white-space:nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
/* -------x------------Empty page--------x-------- */
  /*----------
  RESPONSIVE
  ===========*/
/* -----------Query less than or equal 250px------------ */
@media only screen and (max-width: 250px){
    .rhap_container{
        padding: 10px 1px;
    }
}
/* -----------Query less than or equal 300px------------ */
@media only screen and (max-width: 300px){
    #usersProfile.users--profile--container .users--profile--posts, #explore.explore-container .explore--upper--row{
        grid-template-columns: 1fr !important;
        gap:18px;
    }
    .sender, .receiver{
        max-width: 80%;
    }
    #messages.messages--container .messages--desktop--card{
        border:none;
    }
    .auth--stores--inner{
        flex-direction:column !important;
    }
    .auth--footer--ul {
        grid-template-columns: 1fr !important;
        gap: 2vw;
    }
    .auth--copyright span{
        font-size:11px !important;
    }
    .user-top-inner{
        flex-direction: column;
    }
}
/* -----------Query less than or equal 670px------------ */

@media only screen and (max-width: 670px){
    :root{
        --padding-sides: 4vw;
    }
    .noti--popup-item .noti--row{
        width:55%;
    }
    .increase--posts--count img{
        width: 21px;
        height: 21px;
    }
    .react-confirm-alert-body{
        width: 90% !important;
        margin: 0 auto;
        white-space: pre-wrap;
        padding: 20px !important;
    }
    .react-confirm-alert-body h1{
        font-size: 28px;
    }
    .reel--bubble .reel--upper--container{
        width: 60px;
        height: 60px;
    }
    .loading--message--container .loading--message--inner{
        width: 50%;
    }
    form#tweetEditor{
        width: 100%;
    }
    .auth{
        width:85%;
    }
    .prof--input--row{
        flex-direction: column !important;
    }
    .desktop-comp{
        padding:0;
    }
    .auth .auth--upper--card{
        padding:15px 15px 18px;
    }
    .form--input--container--inner .emoji-picker-react, .usersModal--container, .usersModal--inner .usersModal--card, #commentsModal.comments--modal--container, .desktopPost, .create--dismiss--modal{
        z-index: 5800 !important;
    }
    .backdrop, .hidden--backdrop{
        z-index: 5500 !important;
    }
    #usersProfile.users--profile--container .users--action--row,
    #usersProfile.users--profile--container .desktop--social--row p{
        align-items: baseline;
    }
    #usersProfile.users--profile--container .profile__display__name{
        font-size:25px;
    }
    #usersProfile.users--profile--container {
        padding-top: 4px;
    }
    #usersProfile .reel--bubble{
        width: 60px;
        margin:0px 10px 10px;
    }
    #usersProfile .reel--bubble .reels__icon{
        width: 40px;
        height: 40px;
    }
    .my-empty--posts--container{
        margin-top: 0;
        flex-direction: column-reverse !important;
    }
    .my-empty--posts--img, .my-empty--posts--text--container{
        flex-basis: 100%;
    }
    .my-empty--posts--img img{
        min-height: 250px;
    }
    .message--pic--fullScreen .pic--fullScreen--inner{
        width: 100%;
        height: 100vh;
        padding:0;
        margin:0;
        border-radius:0;
        min-width: auto;
    }

    .message--pic--fullScreen{
        left:0;
        top:0;
        bottom: 0;
        right: 0;
        width: 100%;
        height: 100vh;
        transform: none;
        z-index: 5950;
    }
    .new--msg--body .suggestions--list ul{
        padding:15px 0 70px 0;
    }
    .new--msg--body{
        max-height: 75vh;
    }
    .global__loading{
        z-index: 6050;
    }
    .users--profile--rowLine .profile--posts--container{
        width: 90%;
    }
    #usersProfile.users--profile--container .MuiAvatar-root{
        width:77px;
        height:77px;
    }
    #usersProfile .user--img--cover{
        font-size: 17px;
    }
    #usersProfile .reels__icon{
        width: 56px;
        height:56px;
    }
    #page {
        min-height:95vh;
        margin-bottom: 50px;
    }
    .prof--acc--category span {
        font-size: 14px;
    }
    .user-top-inner{
        width:100%;
    }
    .mobile-only{
        display:block;
    }
    .auth--footer--container{
        margin:80px 2vw 20px 2vw;
    }
    .auth .auth--bottom--card span {
        font-size:14px;
        font-weight:400;
    }
    .auth--footer--container{
        width:70%;
        margin-right:auto;
        margin-left:auto;
    }
    #usersProfile.users--profile--container .users--action--row{
        flex-direction: column !important;
    }
    .auth--footer--container .auth--copyright{
        margin-top:25px;
    }
    .auth--input--form, #usersProfile.users--profile--container .profile--posts--container{
        padding:0;
    }
    .auth--input--form input[type="text"], .auth--input--form input[type="password"],.auth--input--form input[type="email"], .auth--input--form input[type="submit"] {
        width: 100%;
    }
    #usersProfile.users--profile--container .users--profile--posts, #explore.explore-container .explore--upper--row{
        gap:1px !important;
    }
    #explore.explore-container .explore--upper--row{
        margin-bottom: 1px !important;
    }
    .similar__followers{
        font-size: 13px;
        font-weight: 600;
    }
    .desktop-only{
        display:none;
    }
    .post--comment--actions,
    .post__view__replies__btn,
    .sub--comments--nav
    {
        padding-left:25px;
    }
    #messages.messages--container{
        background-color:var(--white);
    }
    #messages.messages--container .messages--bottom--form{
        z-index: 1100;
    }
    #messages.messages--container .messages--desktop--card{
        min-height:100%;
        flex-direction: column;
        flex-wrap: wrap;
        height:100vh;
    }
    #messages.messages--container .messages--users--side, #messages.messages--container .messages--side{
        flex-basis: 100%;
        width:100%;
        left:0;
        position: static !important;
        margin-bottom: 50px;
    }
    .mobile--msgs--menu{
        position:fixed;
        right: 19px;
        top:10px;
        font-size:27px;
        cursor:pointer;
        opacity: 0.8;
        z-index:5900;
        padding:8px 10px;
        border-radius:50%;
        background-color:var(--white);
    }
    #usersProfile.users--profile--container .user--top--info{
        padding: 22px 0 10px 10px;
    }
    #messages.messages--container .messages--bottom--form{
        position: fixed;
        bottom: 50px;
        left:0;
        width:100%;
        padding:10px 15px; 
    }
    .users--profile--stripe .profile--section--item svg{
        font-size: 22px;
    }
    #messages.messages--container .chat--emojis--box{
        position: fixed;
        bottom:109px;
    }
    .noti--popup--window, .noti--popup--arrow, .search--pop--window, .search--popup--arrow{
        display:none !important;
    }
    .messages--side .mobile--users--sidedrawer{
        position: fixed;
        top:0px;
        height:100vh;
        width:70%;
        right:0;
        padding-top: 13px;
        z-index:5800;
        background-color: var(--white);
        border-left:1px solid var(--gray);
    }
    .auth--footer--container  .auth--copyright{
        width:90%;
    }
    .mobile--msgs--menu:hover{
        opacity: 1;
    }
    #messages.messages--container .messages--chatbox--body{
        overflow-y:auto;
        padding:44px 10px 40px;
        height: 68%;
    }
    #messages .messages--view--users ul li .messages--user--info{
        width:100%;
    }
    #messages .desktop-comp{
        padding-top:0;
    }   
    #messages.messages--container .messages--desktop--card, #editProfile .edit--box.edit--box{
        border:none;
    }
    .post--card--container{
        padding-bottom:0px;
    }
    .desktop-comp{
        padding-top:50px !important;
        padding-bottom:50px;
        min-width: 100%;
    }
    #usersProfile.users--profile--container .desktop--social--row{
        justify-content: center;
    }
    #usersProfile.users--profile--container .desktop--social--row p{
        margin-right:5px;
        font-size:13px;
        font-weight:600;
    }
    #usersProfile.users--profile--container .desktop--social--row p span{
        font-weight:700;
        width:100%;
        text-align:center;
    }
    .auth--main{
        padding-bottom:50px;
    }
    .auth--footer--ul {
        display:grid !important;
        grid-template-columns: repeat(2, 1fr);
        list-style:none;
        align-items:center;
        align-content: center;
        gap: 2vw;
    }
    .voxgram--greeting{
        width: 90%;
        margin: 10px auto;
    }
    .usersModal--container, .comments--modal--container{
        top:0;
        left:0;
        transform: translate(0);
        width:100%;
        height:100%;
        max-height:100%;
    }
    .usersModal--container{
        position:fixed;
    }
    .reels--ul{
        padding: 0 0 0 10px;
    }
    #messages.messages--container .messages--side, .messages--side--inner{
        overflow-x: hidden;
    }
    .reels--ul li{
        margin-right: 15px;
    }
    .usersModal--inner{
        margin:0;
    }
    .empty--posts--container h3{
        font-size:19px;
    }
    .usersModal--inner .usersModal--card, #commentsModal.comments--modal--container{
        border-radius:0;
        height:100vh;
        width:100%;
    }
    .getting--started--container h4{
        margin-left:9px;
    }
    .userModal--card--body{
        max-height: 100%;
    }
    #messages.messages--container .desktop-comp{
        padding-top:0px !important;
    }
    #editProfile{
        padding-top: 0 !important;
    }
    #editProfile .edit--box{
        padding-top:40px !important;
    }
    #usersProfile.users--profile--container, .post--comments--layout{
        padding-bottom:40px;
    }
    #usersProfile.users--profile--container .users__profile__image, #explore.explore-container .explore--upper--row .users__profile__image{
        height: 150px !important;
    }
    /* #commentsModal.comments--modal--container{
        position:static !important;
    } */
    /* #commentsModal .comments--modal--container .comments--modal--card{
        width:100%;
        border-radius:0;
        height:100vh;
        max-height:auto;
    } */
    #commentsModal.comments--modal--container .comments--modal--card {
        position:relative;
        max-height:90%;
        width:100%;
    }
    #commentsModal.comments--modal--container .comments--modal--card .post--bottom--comment--adding{
        bottom:100px;
        background-color:var(--white);
    }
    #commentsModal.comments--modal--container .comments--modal--card .comments--modal--inner{
        height:100%;
    }
    
}

/* ---------Query less than or equal 9300px------------ */
@media only screen and (max-width:930px){
    #usersProfile.users--profile--container .users--action--row{
        flex-direction: column;
        flex-wrap: wrap !important;
    }
    .auth--review--pic{
        display:none;
    }
    #usersProfile.users--profile--container .users--action--row div,
    #usersProfile.users--profile--container .users--action--row h5{
        flex-basis:auto; 
    }
    #usersProfile.users--profile--container .users--profile--posts, #explore.explore-container .explore--upper--row{
        gap:3px;
    }
    #messages .desktop-comp{
        padding:4rem 0 0;
    }
    #explore.explore-container .explore--upper--row{
        margin-bottom: 3px;
    }
}
/* more than 1160px */
@media only screen and (min-width:1160px){
    #usersProfile .desktop-comp, #explore .desktop-comp{
        max-width: 935px !important;
        margin-left:auto; 
        margin-right:auto;
    }

}
/* more than 760px */
@media only screen and (min-width:760px){
    .auth--review--pic{
        animation: slideRight 1.5s forwards ease-out;
    }
    .auth{
        animation: slideLeft 1.5s forwards ease-out;
    }
    .prof--input--row{
        align-items: center;
    }
    .prof--input--row label{
        margin:0;
    }
    .messages--view--users{
        max-height: 70vh;
    }
    .userModal--card--body{
        max-height: 400px;
    }
    #messages.messages--container{
        overflow:hidden;
    }
    .messages--container{
        min-height: 90vh;
    }
    #messages.messages--container .messages--user--info {
        width:70%;
    }
    .private-acc{
        border: 1px solid var(--shadow-white);
        border-radius: 3px;
    }
}
/* between 670px and 930px */
@media only screen and (max-width:930px) and (min-width: 670px){
    .auth--footer--container{
        justify-content: center;
    }
    #suggestionsPage .desktop-comp div.suggestions--p--inner{
        width: 100%;
    }
}

/* ---x------Query less than or equal 480px---x--------- */
@media screen and (max-width: 480px) {
    .profile__display__name, .user--pic--container {
        margin: auto auto 15px;
        text-align: center;
    }
    #usersProfile.users--profile--container .desktop--inner--info{
        margin: 0 auto;
    }
}
/* ----x-- Keyframes Animations --x--- */
/* ------------bound heart on double click effect---------------- */
@keyframes boundHeartOnDouble {
    0% {
      transform: scale(0.75);
    }
    20% {
      transform: scale(1);
    }
    40% {
      transform: scale(0.75);
    }
    60% {
      transform: scale(1);
    }
    80% {
      transform: scale(0.75);
    }
    100% {
      transform: scale(0.50);
    }
  }
/* --------x---------bound heart on double click effect-----------x---------- */
@keyframes openModal{
    0%{
        transform: scale(1.15);
    }
    100%{
        transform: scale(1);
    }
}
@-moz-keyframes openModal {
    0%{
        transform: scale(1.15);
    }
    100%{
        transform: scale(1);
    }
}
@-o-keyframes openModal {
    0%{
        transform: scale(1.15);
    }
    100%{
        transform: scale(1);
    }
}
@-webkit-keyframes openModal {
    0%{
        transform: scale(1.15);
    }
    100%{
        transform: scale(1);
    }
}

@keyframes waveBg {
    0%{background-position:10% 0%}
    50%{background-position:91% 100%}
    100%{background-position:10% 0%}
}
@-moz-keyframes waveBg {
    0%{background-position:10% 0%}
    50%{background-position:91% 100%}
    100%{background-position:10% 0%}
}
@-o-keyframes waveBg {
    0%{background-position:10% 0%}
    50%{background-position:91% 100%}
    100%{background-position:10% 0%}
}
@-webkit-keyframes waveBg {
    0%{background-position:10% 0%}
    50%{background-position:91% 100%}
    100%{background-position:10% 0%}
}

@keyframes fadeIn {
    0%{
        opacity: 0;
    }
    100%{
        opacity: 1;
    }
}
@-webkit-keyframes fadeIn {
    0%{
        opacity: 0;
    }
    100%{
        opacity: 1;
    }
}
@-o-keyframes fadeIn {
    0%{
        opacity: 0;
    }
    100%{
        opacity: 1;
    }
}
@-moz-keyframes fadeIn {
    0%{
        opacity: 0;
    }
    100%{
        opacity: 1;
    }
}

@keyframes fakeLoading {
    0% {
        width:0;
    }
    10% {
        width:10%;
    }
    30% {
        width:30%;
    }
    50% {
        width:50%;
    }
    70% {
        width:70%;
    }
    80% {
        width:80%;
    }
    100% {
        width:100%;
    }
}

@-moz-keyframes fakeLoading {
    0% {
        width:0;
    }
    10% {
        width:10%;
    }
    30% {
        width:30%;
    }
    50% {
        width:50%;
    }
    70% {
        width:70%;
    }
    80% {
        width:80%;
    }
    100% {
        width:100%;
    }
}
@keyframes rotateAnim {
    10%{
        transform: rotate(0deg);
    }
    100%{
        transform: rotate(360deg);
    }
}
@-webkit-keyframes fakeLoading {
    0% {
        width:0;
    }
    10% {
        width:10%;
    }
    30% {
        width:30%;
    }
    50% {
        width:50%;
    }
    70% {
        width:70%;
    }
    80% {
        width:80%;
    }
    100% {
        width:100%;
    }
}
@-o-keyframes fakeLoading {
    0% {
        width:0;
    }
    10% {
        width:10%;
    }
    30% {
        width:30%;
    }
    50% {
        width:50%;
    }
    70% {
        width:70%;
    }
    80% {
        width:80%;
    }
    100% {
        width:100%;
    }
}
@keyframes rotateReel {
    100%{
        transform: rotate(360deg);
    }
}
@-moz-keyframes rotateReel {
    100%{
        transform: rotate(360deg);
    }
}

@-o-keyframes rotateReel {
    100%{
        transform: rotate(360deg);
    }
}
@-webkit-keyframes rotateReel {
    100%{
        transform: rotate(360deg);
    }
}

@-moz-keyframes spin { 100% { -moz-transform: rotate(360deg); } }
@-webkit-keyframes spin { 100% { -webkit-transform: rotate(360deg); } }
@keyframes spin { 100% { -webkit-transform: rotate(360deg); transform:rotate(360deg); } }

@keyframes slideRight {
    0%{
        opacity: 0;
        transform: translateX(-80px);
    }
    100%{
        opacity: 1;
        transform: translateX(0);
    }
}
@keyframes slideLeft {
    0%{
        opacity: 0;
        transform: translateX(80px);
    }
    100%{
        opacity: 1;
        transform: translateX(0);
    }
}
/* End of key frames */
`;

export default GlobalStyles