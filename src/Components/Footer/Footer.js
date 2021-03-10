import React, { Fragment } from "react";
import "../../Pages/Home/Home.css";
const Footer = (props) => (
    <Fragment>
        <footer id="main--footer">
            <div id="userProfFooter" className="userProfile--footer auth--footer--container desktop-only">
                            <ul className="auth--footer--ul flex-row">
                                    <li>ABOUT</li>
                                    <li>HELP</li>
                                    <li>PRESS</li>
                                    <li>API</li>
                                    <li>JOBS</li>
                                    <li>PRIVACY</li>
                                    <li>TERMS</li>
                                    <li>LOCATIONS</li>
                                    <li>TOP ACCOUNTS</li>
                                    <li>HASHTAGS</li>
                                    <li>LANGUAGE</li>
                                </ul>
                                <div className="auth--copyright">
                                    <span>This app was made for personal use</span>
                                    <span>&copy;2020 - {new Date().getFullYear()} Instagram clone made by Mahmoud Farargy</span>
                                </div>
            </div>    
        </footer>
       
    </Fragment>
)

export default Footer;