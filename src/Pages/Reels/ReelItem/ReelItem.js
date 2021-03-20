import React, {Fragment, useRef, useState} from 'react'
import {Avatar} from "@material-ui/core";
import {FaPlay, FaPause, FaVolumeMute, FaVolumeUp, FaHeart, FaCommentAlt} from "react-icons/fa";

function ReelItem(props) {
    const reelVideo = useRef(null);
    const [isVideoPlaying, setVideoPlaying] = useState(false);
    const [muteVolume, setVolumeState] = useState(false);
    const [commentTxt, setCommentTxt] = useState("");
    const {item, profile} = props;
    const {userAvatarUrl, userName} = profile;
    
    const onVideoClick=()=>{
        if(isVideoPlaying){
            reelVideo && reelVideo.current.pause();
            setVideoPlaying(false);
        }else{
            reelVideo && reelVideo.current.play();
            setVideoPlaying(true);
        }
    };
    const setVolume = (event) => {
        event.stopPropagation();
        if(muteVolume){
            if(reelVideo){
                setVolumeState(false);
                reelVideo.current.volume = 1; 
                
            }
            
        }else{
            if(reelVideo){
                setVolumeState(true);
               reelVideo.current.volume = 0.0;
            }
           
        }
        
    }
    return (
        <Fragment>
            <div className="reel--video--content">
                <video  onClick={() => onVideoClick()} onKeyPress={(event)=> event.charCode === 32 && onVideoClick()} ref={reelVideo} src={item.contentURL} loop />
                    <header className="reel--header flex-row">
                        <div className="reel--header--left flex-row">
                            <Avatar src={userAvatarUrl} alt={userName} title={userName} />
                            <span className="reel__user__name">{userName}</span>
                            <span className="reel__date">{new Date(item?.date.seconds * 1000).toLocaleDateString()}</span>
                        </div>
                        <div className="reel--header--right flex-row">
                                {
                                    isVideoPlaying ?
                                    <div onClick={() => onVideoClick()}>
                                        <FaPause />
                                    </div>
                                    :
                                    <div onClick={() => onVideoClick()}>
                                       <FaPlay /> 
                                    </div>
                                    
                                }   
                                {
                                    !muteVolume ?
                                    <div  onClick={(b) => setVolume(b)}>
                                         <FaVolumeUp/>
                                    </div>
                                   
                                    :
                                    <div onClick={(b) => setVolume(b)}>
                                        <FaVolumeMute  />
                                    </div>
                                }
                            
                        </div>
                            
                    </header>
                    <footer className="reel--footer w-100 flex-row">

                        <div className="reel--comment w-100 flex-row">
                           <textarea value={commentTxt} onChange={(f) => setCommentTxt(f.target.value)} placeholder={`Replay to ${userName}...`} />  
                          {
                              commentTxt && <span className="send__reel__comment">Send</span>
                          } 
                        </div>
                       
                    </footer>  
                <div className="interaction--box flex-column">
                   <div className="reel--likes mb-3 flex-column">
                          <FaHeart />
                          <span>28,000</span>
                   </div>
                   <div className="reel--comment flex-column">
                          <FaCommentAlt />
                          <span>10,022</span>
                   </div>
                </div>
            </div>                          
        </Fragment>
    )
}

export default ReelItem;