import React, {Fragment, useEffect} from "react";
import "./About.scss";

const About = (props) => {
    
    useEffect(() => {
        props.changeMainState("currentPage", "About");
    }, []);
    return (
        <Fragment>
            <div id="about--container" className="flex-column">
                <div className="about--inner">
                    <div className="about-sub flex-column">
                        <div className="flex-column about-section-inner">
                        {/* <Avatar  className="my-image" src={myImage} alt="Me" draggable="false" /> */}
                        <h2>Hi, I'm Mahmoud</h2>

                        <p>I am a front end developer who is specialized in Vue.js, React.js, Javascript and other technologies. You can visit my portfolio to find more cool projects like this one <a target="_blank" rel="noopener noreferrer" href="https://mahmoudportfolio.netlify.app">Portfolio.</a></p>
                    </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
export default About;