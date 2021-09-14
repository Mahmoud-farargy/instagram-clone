import React, { Fragment, useEffect, useState } from "react";
import "./About.scss";
import { ImGithub } from "react-icons/im";
import { MdEmail } from "react-icons/md";
import { AiFillInstagram, AiFillCodepenCircle } from "react-icons/ai";
import { AiTwotonePhone } from "react-icons/ai";

const About = (props) => {
    const { changeMainState } = props
    useEffect(() => {
        changeMainState("currentPage", "About");
    }, [changeMainState]);
    const contactList = Object.freeze([
        {type: "github", title: "Github",url: "https://github.com/Mahmoud-farargy/instagram-clone", icon: (<ImGithub style={{ fontSize: "30px" }} />), id: "github"},
        {type: "gmail", title: "Email",url: "mailto:mahmoudfarargy9@gmail.com", icon: (<MdEmail style={{ fontSize: "35px" }} />), id: "gmail"},
        {type: "instagram", title: "Instagram",url: "https://www.instagram.com/codepugilist", icon: (<AiFillInstagram style={{ fontSize: "35px" }} />), id: "instagram"},
        {type: "codepen", title: "Code Pen",url: "https://codepen.io/mahmoud-farargy/pens/public", icon: (<AiFillCodepenCircle style={{ fontSize: "35px" }} />), id: "codepen"},
        {type: "phoneNumber", title: "Call me only if you have a job offer",url: "tel:+01152559760", icon: (<AiTwotonePhone style={{ fontSize: "34px" }} />), id: "phoneNumber"}
    ]);

    console.log(contactList);
    return (
        <Fragment>
            <div id="about--container" className="flex-column">
                <div className="about--inner">
                    <div className="about-sub flex-column">
                        <div className="flex-column about-section-inner">
                            {/* <Avatar  className="my-image" src={myImage} alt="Me" draggable="false" /> */}
                            <h2>Hi, I'm Mahmoud <br /> Farargy</h2>

                            <p>A front end developer who is specialized in Vue.js, React.js, Javascript and other technologies. You can visit my portfolio to find more cool projects like this one <a target="_blank" rel="noopener noreferrer" href="https://mahmoudportfolio.netlify.app">Portfolio.</a></p>
                            <ul className="flex-row socials--links">
                                {
                                    contactList && contactList.length > 0 &&
                                    contactList.map((contactItem, idx) => {
                                        return (
                                            <li title={contactItem.title} key={`${contactItem.id}${idx}`}>
                                                <a href={contactItem.url} rel="noopener noreferrer" target="_blank">
                                                    {contactItem.icon}
                                                </a>
                                            </li>
                                        )
                                    })
                                }
                            </ul>

                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
export default About;