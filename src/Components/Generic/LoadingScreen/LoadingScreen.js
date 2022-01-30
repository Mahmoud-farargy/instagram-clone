import React, {useEffect, useRef, Fragment} from "react";
import "./LoadingStyling.scss";
import loadingImg from "../../../Assets/instagram-icon-logo-loading.e195cbde.svg";

const LoadingScreen = () => {
    const _isMounted = useRef(true);
    useEffect(() => {
        if(_isMounted?.current){
            document.body.style.overflow = "hidden";
        }
        return() => {             
            document.body.style.overflow = "visible";
            _isMounted.current = false;
        }
    },[]);
    if(_isMounted?.current){
        return(
            <Fragment>
                <div id="loadingScreen" className="flex-column">
                    <div className="loading--backdrop"></div>
                        <div className="flex-column loading--screen--inner">
                            <img loading="lazy" className="unselectable" src={loadingImg} alt="Loading..." />
                        </div>
                </div> 
            </Fragment>
    
        ) 
    }


}

export default LoadingScreen;