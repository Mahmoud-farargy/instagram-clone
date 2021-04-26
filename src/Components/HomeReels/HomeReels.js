import React, { Fragment, useContext, useState, useEffect } from "react";
import { AppContext } from "../../Context";
import "./HomeReels.scss";
import { auth } from "../../Config/firebase";
import { useAuthState } from "react-firebase-hooks/auth"; 
import reelDefaultIco from "../../Assets/reels.png";
import { Avatar } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import Loader from "react-loader-spinner";

const HomeReels = () => {
    const context = useContext(AppContext);
    const {homeReels, updateReelsProfile, changeMainState, notify} = context;
    const [,loading] = useAuthState(auth);
    const [newReelsArr, setReelsArr] = useState([]);
    const history = useHistory();
    const getRandom = (length) => {
        const newLength  = homeReels.length < 0 || length < 0 ? 0 : length;
        if(newLength >= 0){
             return  Math.floor(Math.random() * newLength);
        }
    };
    useEffect(() => {
        
        if(homeReels && homeReels.length > 0){
            function shuffleReels(array) {
              var j,x,i;
              for (i = array.length - 1; i > 0; i--) {
                  j = Math.floor(Math.random() * (i + 1));
                  x = array[i];
                  array[i] = array[j];
                  array[j] = x;    
                  return (array || []);
              }
          }           
            const arr = shuffleReels(homeReels?.map(reels => {
                if(reels && reels?.length > 0){
                    const randomGroup = reels?.[getRandom(reels?.length)];
                    return {
                            ...randomGroup?.reelItems?.[Math.floor(Math.random() * (randomGroup?.reelItems?.length > 0 ? randomGroup?.reelItems?.length : 0 ))],
                            groupId: randomGroup?.id
                        };
                }else{
                    return [];
                }
            }));
            setReelsArr((arr || []));
        }
    }, [homeReels]);
    const openReel = (reelId, groupId , uid ) => {
        updateReelsProfile(uid).then((res) => {
            //checks indices
            const checkGroupIndex = res?.reels?.length > 0 && res?.reels?.map(el => el.id).indexOf(groupId);
            if(checkGroupIndex !== -1){ 
                const checkReelIndex = res?.reels[checkGroupIndex]?.reelItems?.map(item => item.id).indexOf(reelId);
                if(checkReelIndex !== -1){
                    changeMainState("currentReel", {groupIndex: checkGroupIndex , groupId: groupId, reelIndex: checkReelIndex, reelId: reelId });
                    history.push("/reels");
                }else{
                    notify("Reel is not available or got deleted","error");
                }
               
            }else{
                notify("Reel is not available or got deleted","error");
            }
            
        })
    }
    return (
        <Fragment>
           {
               !loading && newReelsArr.length > 0 ? 
               <section id="homeReels">
                <div className="home--reels--inner">
                    <div className="home--reels--box flex-row">
                        <ul className="home--reels--ul flex-row">
                            {
                                newReelsArr.map((reel, i, ) => {
                                        return (
                                             <li key={reel.id + i} onClick={()=> {reel?.id && openReel(reel?.id,reel?.groupId ,reel?.reelOwnerId)}} className="home-reel-item flex-column" title={reel?.userName}>
                                                <div className=" home-reel-container flex-column">
                                                        <div className="reel--reel--inner flex-column" >
                                                            <Avatar className="reels__icon" src={(reel?.userAvatarUrl || reelDefaultIco)} alt={reel.userName}/>
                                                        </div>
                                                        <small className="home--reel--user--name">{reel?.userName}</small>
                                                </div>
                                            </li>
                                        )                                            
                                })
                            }
                          
                        </ul>  
                    </div>
                    
                </div>
            </section>
            : <div className="mx-auto text-align-center mb-3">
                <Loader
                    type="Bars"
                    color="var(--secondary-clr)"
                    height={40}
                    width={40}
                    timeout={3000} />
            </div>
           }
        </Fragment>
    )
}

export default HomeReels;