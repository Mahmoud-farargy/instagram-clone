import React, {Fragment, useEffect} from "react";
import "./About.scss";
import {ImGithub} from "react-icons/im";
import {MdEmail} from "react-icons/md";
import {AiFillInstagram, AiFillCodepenCircle} from "react-icons/ai";

const About = (props) => {
    const {changeMainState} = props
    useEffect(() => {
        changeMainState("currentPage", "About");
    }, [changeMainState]);
    return (
        <Fragment>
            <div id="about--container" className="flex-column">
                <div className="about--inner">
                    <div className="about-sub flex-column">
                        <div className="flex-column about-section-inner">
                        {/* <Avatar  className="my-image" src={myImage} alt="Me" draggable="false" /> */}
                        <h2>Hi, I'm Mahmoud</h2>

                        <p>I am a front end developer who is specialized in Vue.js, React.js, Javascript and other technologies. You can visit my portfolio to find more cool projects like this one <a target="_blank" rel="noopener noreferrer" href="https://mahmoudportfolio.netlify.app">Portfolio.</a></p>
                        <ul className="flex-row socials--links">
                            <li title="Github">
                                <a href="https://github.com/Mahmoud-farargy/instagram-clone" rel="noopener noreferrer" target="_blank">
                                    <ImGithub style={{fontSize:"30px"}}  />
                                </a> 
                            </li>
                            <li title="Email">
                                <a  href="mailto:mahmoudfarargy9@gmail.com" rel="noopener noreferrer" target="_blank">
                                    <MdEmail style={{fontSize:"35px"}} />
                                </a> 
                            </li>
                            <li title="Instagram">
                                <a  href="https://www.instagram.com/codepugilist"rel="noopener noreferrer" target="_blank">
                                    <AiFillInstagram style={{fontSize:"35px"}} />
                                </a> 
                            </li>
                            <li title="Code Pen">
                                <a  href="https://codepen.io/mahmoud-farargy/pens/public" rel="noopener noreferrer" target="_blank">
                                    <AiFillCodepenCircle style={{fontSize:"35px"}} />
                                </a> 
                            </li>
                        </ul>

                    </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
export default About;