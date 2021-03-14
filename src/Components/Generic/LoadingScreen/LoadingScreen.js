import React from "react";
import "./LoadingStyling.scss";
import loadingImg from "../../../Assets/insta_loading_screen_mograph_dribbble.gif";
const LoadingScreen = () => <div id="loadingScreen" className="flex-column"><img src={loadingImg} alt="Loading..." /></div>

export default LoadingScreen;