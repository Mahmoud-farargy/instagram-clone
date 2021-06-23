import React, { Fragment, useContext, useState, useEffect, useRef } from "react";
import { AppContext } from "../../Context";
import "./HomeReels.scss";
import { auth } from "../../Config/firebase";
import { useAuthState } from "react-firebase-hooks/auth"; 
import Skeleton from "react-loading-skeleton";
import HomeReelItem from "./HomeReelItem/HomeReelItem";
import { IoIosArrowDropleftCircle, IoIosArrowDroprightCircle } from "react-icons/io";

const HomeReels = () => {
    const context = useContext(AppContext);
    const { homeReels, loadingState } = context;
    const [,loading] = useAuthState(auth);
    const [newReelsArr, setReelsArr] = useState([]);
    const [arrowsState, setArrowsState] = useState({
        left: false,
        right: true 
    });
    const getRandom = (length) => {
        const newLength  = (homeReels.length < 0 || length < 0) ? 0 : length;
        if(newLength >= 0){
             return  Math.floor(Math.random() * newLength);
        }
    };
    const scrollHorizontally = useRef(null);
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
    const onReelsScroll = (direction) => {
        if(scrollHorizontally && scrollHorizontally.current){
            scrollHorizontally.current.scrollBy({
                top:0,
                left: direction === "right" ? 300: direction === "left" ? -300 : 0,
                behavior: "smooth"
            })
            setArrowsState({
                left: scrollHorizontally.current.scrollLeft > 50,
                right: scrollHorizontally.current.scrollLeft + 350 <= scrollHorizontally.current.scrollWidth
            });
        }
    }
    return (
        <Fragment>
           {
               (!loading || !loadingState?.suggList) && newReelsArr.length > 0 ? 
               <section id="homeReels">
                <div className="home--reels--deck">
                    <div className="home--reels--inner">
                        <div className="home--reels--box flex-row">
                            <ul ref={scrollHorizontally} className="home--reels--ul flex-row">
                                {newReelsArr.map((reel, i, ) => <HomeReelItem key={reel.id + i} reel={reel} />) }
                            </ul>
                        </div>
                        
                    </div> 
                    <div className="home--reels--scroll--arrows">
                        { arrowsState.left && <button className="home--reel--left--arrow" onClick={() => onReelsScroll("left")}><IoIosArrowDropleftCircle/></button>}
                        { arrowsState.right && <button className="home--reel--right--arrow" onClick={() => onReelsScroll("right")}><IoIosArrowDroprightCircle /></button>}
                    </div>
                </div>
            </section>
            : (loading || loadingState?.suggList) && newReelsArr.length <= 0 ?
            <div  id="homeReels" >
                <div className="home--reels--inner">
                    <div className="home--reels--box flex-row">
                        <ul className="home--reels--ul flex-row">
                            <li className="flex-column">
                                <Skeleton count={7} height={62} width={62} circle={true} className="ml-4" />
                                <Skeleton count={7} height={7} width={62} className="ml-4 mt-2" />
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            : null
           }
        </Fragment>
    )
}

export default HomeReels;