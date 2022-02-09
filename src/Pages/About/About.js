import React, { Fragment, useEffect, useState, useRef } from "react";
import "./About.scss";
import { ImGithub } from "react-icons/im";
import { MdEmail } from "react-icons/md";
import { AiFillInstagram, AiFillCodepenCircle, AiOutlineStar, AiOutlineFork } from "react-icons/ai";
import Api from "../../Config/API";
import Loader from "react-loader-spinner";

const About = (props) => {
    const _isMounted = useRef(true);
    const [isLoading, setLoading] = useState(false);
    const [githubInfo, setGithubInfo] = useState({
        starts: null,
        forks: null,
        repoUrl: ""
    });
    const { changeMainState } = props;
    useEffect(() => {
        changeMainState("currentPage", "About");
    }, [changeMainState]);
    const contactList = Object.freeze([
        { type: "github", title: "Github", url: "https://github.com/Mahmoud-farargy", icon: (<ImGithub style={{ fontSize: "30px" }} />), id: "github" },
        { type: "gmail", title: "Email", url: "mailto:mahmoudfarargy9@gmail.com", icon: (<MdEmail style={{ fontSize: "35px" }} />), id: "gmail" },
        { type: "instagram", title: "Instagram", url: "https://www.instagram.com/codepugilist", icon: (<AiFillInstagram style={{ fontSize: "35px" }} />), id: "instagram" },
        { type: "codepen", title: "Code Pen", url: "https://codepen.io/mahmoud-farargy/pens/public", icon: (<AiFillCodepenCircle style={{ fontSize: "35px" }} />), id: "codepen" }
    ]);
    useEffect(() => {
        if(process.env.NODE_ENV !== "production"){
            return;
        }
        setLoading(true);
        Api().get('https://api.github.com/repos/Mahmoud-farargy/instagram-clone').then(response => {
            if (_isMounted.current) {
                setLoading(false);
                const { stargazers_count = 100, forks_count = 100, html_url = "https://github.com/Mahmoud-farargy/instagram-clone" } = response.data;
                if (response.data) {
                    setGithubInfo({
                        ...githubInfo,
                        starts: stargazers_count,
                        forks: forks_count,
                        repoUrl: html_url
                    })
                }
            }
        }).catch(err => {
            if (_isMounted.current) {
                setLoading(false);
                console.error(err);
            }
        });
        return () => {
            _isMounted.current = false;
        }
    }, []);
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
                            <div tabIndex="-1" className="github--repo--info flex-row">
                                <a href={githubInfo.repoUrl} rel="noopener noreferrer" target="_blank">
                                    <p>Give me a star on Github</p>

                                    <strong>
                                        {
                                            isLoading ?
                                                <Loader
                                                    type="Rings"
                                                    color="var(--bluish-sky)"
                                                    arialLabel="loading-indicator"
                                                    height={30}
                                                    width={30}
                                                    timeout={3000}
                                                />
                                                :
                                                <>
                                                    <em>
                                                        <AiOutlineStar />
                                                        <span>{githubInfo.starts?.toLocaleString()}</span>
                                                    </em>
                                                    <em>
                                                        <AiOutlineFork />
                                                        <span>{githubInfo.forks?.toLocaleString()}</span>
                                                    </em>
                                                </>
                                        }
                                    </strong>


                                </a>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
export default About;