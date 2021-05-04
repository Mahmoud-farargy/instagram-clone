import React, {Fragment, useEffect, useState} from 'react'
import "./Reels.scss";
import {Link} from "react-router-dom";
import Loader from "react-loader-spinner";
import {auth} from "../../Config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import ReelItem from "./ReelItem/ReelItem";

function Reels(props) {
    const {reelsProfile = {}, changeMainState, currentReel} = props.context;
    useEffect(()=>{
        changeMainState("currentPage", "Reels");
    },[]);
    const [,loading] = useAuthState(auth);
    const [currentPlayingReel, setCurrPlayingReel] = useState(0);
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
                        <div className="reel--video--box flex-column" >
                        {
                            !loading ?
                           reelsProfile?.reels?.length > 0 && reelsProfile?.reels?.[currentReel?.groupIndex]?.reelItems && reelsProfile?.reels[currentReel?.groupIndex]?.reelItems?.sort((a,b) => b.date.seconds - a.date.seconds ).map((reel, i) => {
                                return <ReelItem setCurrPlayingReel={setCurrPlayingReel} currentPlayingReel={currentPlayingReel} key={i} maxLength={(reelsProfile?.reels?.[currentReel?.groupIndex]?.reelItems?.length ? reelsProfile?.reels?.[currentReel?.groupIndex]?.reelItems?.length : NaN)} groupName={reelsProfile?.reels?.[currentReel?.groupIndex]?.groupName} index={i} item={reel}/>
                                })

                            :
                            <div className="reels-loading flex-column">
                                <Loader
                                type="TailSpin"
                                color="#fff"
                                height={50}
                                width={50}
                                timeout={5000}/>
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