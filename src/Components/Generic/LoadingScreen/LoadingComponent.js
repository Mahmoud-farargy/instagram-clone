import React, { Fragment } from "react";
import "./LoadingStyling.scss";
import Spinner from "../../../Assets/loadingGif.gif";

const LoadingComponent = () => {
    return (
        <Fragment>
            <div id="loadingScreen" className="flex-column loadingComponent">
                    <div className="loading--backdrop"></div>
                    <div className="flex-column loading--screen--inner">
                        <img loading="lazy" className="unselectable" src={Spinner} alt="Loading..." />
                    </div> 
                    
            </div>
        </Fragment>
    )
}
export default LoadingComponent;