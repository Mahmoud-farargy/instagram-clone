import React, {useEffect, useRef, memo, useState, Fragment} from "react";
import "./LoadingStyling.scss";
import loadingImg from "../../../Assets/2412274-min.png";
import { AiOutlineReload } from "react-icons/ai";
import { useHistory } from "react-router-dom";

const LoadingScreen = () => {
    const _isMounted = useRef(true);
    const timeouts = useRef(null);
    const [showAnim, setShowingAnim] = useState(false);
    const history = useHistory();
    useEffect(() => {
        if(_isMounted?.current){
            timeouts.current = setTimeout(() => {
                setShowingAnim(true);
                window.clearTimeout(timeouts.current);
            },19000);
            document.body.style.overflow = "hidden";
        }
        return() => {             
            document.body.style.overflow = "visible";
            window.clearTimeout(timeouts.current);
            _isMounted.current = false;
        }
    },[]);
    const reloadPage = () => {
        history.replace("/");
        window.location.reload();
    }
    if(_isMounted?.current){
        return(
            <Fragment>
                <div id="loadingScreen" className="flex-column">
                    <div className="loading--backdrop"></div>
                        {
                            !showAnim ?
                            <div className="flex-column loading--screen--inner">
                                <img loading="lazy" className="boundingEffect unselectable" src={loadingImg} alt="Loading..." />
                            </div> 
                            :
                            <div className="flex-column loading--screen--inner loading--timeout--bg fadeEffect">
                                <h2>Your session has timed out</h2>
                                <p>Make sure you have healthy internet and try again.</p>
                                <button onClick={() => reloadPage()} className="profile__btn prof__btn__unfollowed fadeEffect">Reload <AiOutlineReload /></button>
                            </div>
                        }
                </div> 
            </Fragment>
    
        ) 
    }


}

export default memo(LoadingScreen);