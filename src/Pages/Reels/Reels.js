import React, { Fragment, useEffect, useState, useRef, useCallback } from 'react'
import "./Reels.scss";
import {Link} from "react-router-dom";
import Loader from "react-loader-spinner";
import {auth} from "../../Config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import ReelItem from "./ReelItem/ReelItem";

function Reels(props) {
    const {reelsProfile = {}, changeMainState, currentReel} = props.context;
    const videoBox = useRef(null);
    const [pushFromTop, setTopPushing] = useState(0);
    useEffect(()=>{
        changeMainState("currentPage", "Reels");
    },[]);
    useEffect(() => {
            currentReel.reelIndex > 0 ? setTopPushing(500 * currentReel.reelIndex +1): setTopPushing(0);
    },[currentReel.reelIndex]);
    useEffect(() => {
        if(videoBox && videoBox.current ){
            videoBox.current.scrollBy({
                top: pushFromTop,
                left:0,
                behavior: 'smooth'
            })
        }
    },[pushFromTop]);
    const [,loading] = useAuthState(auth);
    const [currentPlayingReel, setCurrPlayingReel] = useState(0);
    const reelItems = reelsProfile?.reels?.[currentReel?.groupIndex]?.reelItems;
    const memoizedSettingReel = useCallback((val) => {
        setCurrPlayingReel(val)
    },[]);
    return (
        <Fragment>
            <section id="reels"> 
                <div className="reels--main--container flex-column">
                    <div className="reels--outer--header desktop-only flex-row">
                        <Link to="/">
                            <h1 className="logoText">Voxgram</h1>
                        </Link>
                        {/* redirect to user's profile */}
                        <span onClick={() => props.routeHistory.goBack()}className="reels--close--btn">
                            &times;
                        </span>
                    </div>
                    <div className="reel--video--inner flex-column">
                        <div ref={videoBox} className="reel--video--box flex-column" >
                        {
                            !loading ?
                           reelsProfile?.reels?.length > 0 && reelItems && reelItems.length > 0 && reelItems.sort((a,b) => b.date.seconds - a.date.seconds ).map((reel, i) => {
                                return reel ? (<ReelItem setCurrPlayingReel={ memoizedSettingReel } currentPlayingReel={currentPlayingReel} key={i} maxLength={(reelItems?.length ? reelItems?.length : NaN)} groupName={reelsProfile?.reels?.[currentReel?.groupIndex]?.groupName} index={i} item={reel}/>) : <p>Reel may got deleted.</p>
                                })
                            :
                            <div className="reels-loading flex-column">
                                <Loader
                                type="TailSpin"
                                color="var(--white)"
                                height={50}
                                arialLabel="loading-indicator"
                                width={50}/>
                            </div>
                        }                           
                        </div>
                    </div>
                </div>
            </section>
        </Fragment>
    )
}

export default Reels;