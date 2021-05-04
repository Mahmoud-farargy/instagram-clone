import React, { Fragment, useContext, useState, useEffect } from "react";
import { AppContext } from "../../Context";
import "./HomeReels.scss";
import { auth } from "../../Config/firebase";
import { useAuthState } from "react-firebase-hooks/auth"; 
import Loader from "react-loader-spinner";
import HomeReelItem from "./HomeReelItem/HomeReelItem";

const HomeReels = () => {
    const context = useContext(AppContext);
    const { homeReels } = context;
    const [,loading] = useAuthState(auth);
    const [newReelsArr, setReelsArr] = useState([]);
    const getRandom = (length) => {
        const newLength  = (homeReels.length < 0 || length < 0) ? 0 : length;
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
                            ...randomGroup?.reelItems?.[Math.floor(Math.random() * ((randomGroup?.reelItems?.length > 0) ? randomGroup?.reelItems?.length : 0 ))],
                            groupId: randomGroup?.id
                        };
                }else{
                    return [];
                }
            }));
            setReelsArr((arr || []));
        }
    }, [homeReels]);

    return (
        <Fragment>
           {
               !loading && newReelsArr.length > 0 ? 
               <section id="homeReels">
                <div className="home--reels--inner">
                    <div className="home--reels--box flex-row">
                        <ul className="home--reels--ul flex-row">
                            {newReelsArr.map((reel, i, ) => <HomeReelItem key={reel.id + i} reel={reel} />) }
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