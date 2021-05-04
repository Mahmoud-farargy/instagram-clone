import React, {useEffect} from "react";
import "./LoadingStyling.scss";
import loadingImg from "../../../Assets/insta_loading_screen_mograph_dribbble.gif";
import Header from "../../Header/Header";
import Footer from "../../../Components/Footer/Footer";
import MobileHeader from "../../../Components/MobileHeader/MobileHeader";
import MobileNav from "../../MobileNav/MobileNav";

const LoadingScreen = () => {
useEffect(() => {
    document.body.style.overflow = "hidden";
    return() => {
        document.body.style.overflow = "visible";
    }
},[]);
return(
    <div id="loadingScreen">
        <Header />
        <MobileHeader />
        <div className="flex-column loading--screen--inner">
        <img loading="lazy" src={loadingImg} alt="Loading..." />
        </div>
   
     <Footer/>
     <MobileNav/>
    </div>    
)

}

export default LoadingScreen;