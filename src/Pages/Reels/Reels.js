import React, {Fragment, useEffect} from 'react'
import "./Reels.scss";
import {Link} from "react-router-dom";
import Loader from "react-loader-spinner";
import {auth} from "../../Config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import ReelItem from "./ReelItem/ReelItem";

function Reels(props) {
    const {reelsProfile, changeMainState} = props.context;
    useEffect(()=>{
        changeMainState("currentPage", "Reels");
        console.log(reelsProfile);
    },[]);
    const [_,loading] = useAuthState(auth);
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
                            reelsProfile?.reels && reelsProfile?.reels.length > 0 && reelsProfile?.reels.map(((reel, i) => {
                                return <ReelItem key={i} index={i} profile={reelsProfile} item={reel}/>
                                }))

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