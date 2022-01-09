import React, { Fragment, useState, useEffect, useContext, useRef } from "react";
import "./VideoPost.scss";
import { IoMdVideocam } from "react-icons/io";
import { FaPlay, FaVolumeMute } from "react-icons/fa";
import { ImVolumeMedium } from "react-icons/im";
import Loader from "react-loader-spinner";
import PropTypes from "prop-types";
import { AppContext } from "../../Context";
import LoadContentFail from "../LoadContentFail/LoadContentFail";

const VideoPost = React.forwardRef(
  (
    { className, whenLoadedData,  whenCanPlay, isMuted = true, isVidPlaying, ...props },
    ref
  ) => {
    const _isMounted = useRef(true);
    const [vid, setVideo] = useState({
      hasMuted:  false,
      isPlaying: false,
      hasLoaded: false,
      isBuffering: true,
      canPlay: false,
      hasError: false,
    });
    const { pauseMedia } = useContext(AppContext);
    useEffect(() => {
      // listeners
      if(ref.current && _isMounted.current){
          ref.current.addEventListener("loadedmetadata", () => {
              if(_isMounted.current){
                triggerLoadedData();
                whenCanPlay && typeof whenCanPlay === "function" && whenCanPlay(false);
              }
          });
      }
        if(typeof isMuted === "boolean"){
          setVideo({ ...vid, hasMuted: isMuted });
          ref.current.muted = true;
        }
        return () => { 
          ref.current = false;
          _isMounted.current = false;
        }
    },[]);
    useEffect(() => {
      if(!vid.isBuffering && vid?.hasLoaded && ref && ref.current && ref.current?.preload !== "none"){
        if (vid?.isPlaying && typeof ref.current.pause === "function") {
           ref.current.pause();
        } else if(!vid?.isPlaying && typeof ref.current.play === "function"){
           ref.current.play();
        }
        if (!vid?.hasMuted) {
           ref.current.muted = true;
        } else {
           ref.current.muted = false;
        }
      }
    },[vid, ref]);
    useEffect(() => {
        setVideo({ ...vid, isPlaying: !isVidPlaying });
    },[isVidPlaying]);
    useEffect(() => {
        if (pauseMedia && ref && ref.current){
          setVideo({ ...vid, isPlaying: true, hasMuted: true });
        } 
    },[pauseMedia]);
    const handleVideo = (type, event) => {
      event && event.stopPropagation();
      if (type === "play" && vid?.hasLoaded) {
        if (vid?.isPlaying) {
          setVideo({ ...vid, isPlaying: false });
        } else {
          setVideo({ ...vid, isPlaying: true });
        }
      } else if (type === "mute" && vid?.hasLoaded) { 
            if (vid?.hasMuted) {
              setVideo({ ...vid, hasMuted: false });
            } else {
              setVideo({ ...vid, hasMuted: true });
            }
      }
    };
    const triggerClick = (event) => {
      handleVideo("play", event);
    }
    const triggerLoadedData = () => {
      whenLoadedData && typeof whenLoadedData === "function" && whenLoadedData();
      setVideo({ ...vid, hasLoaded: true, isBuffering: false  });
    };
    const triggerError = (event) => {
      event.persist();
      setVideo({ ...vid, hasError: true });
    }
    return (
      <Fragment>
        <div id="videoElement">
            <video
                    onClick={(s) => triggerClick(s)}
                    ref={ref}
                    {...props}
                    draggable="false"
                    className="post__card__content"
                    onError={(k) => triggerError(k)}
                    playsInline
                />
            {
                vid?.isBuffering ?
                <div className="buffererror flex-column">
                    {
                        vid?.hasError ?
                       <LoadContentFail contentType="video"  shape="phrase" />
                        :
                        <div className="vid--buffer">
                            <Loader
                            type="TailSpin"
                            color="var(--light-black)"
                            arialLabel="loading-indicator"
                            height={60}
                            width={60}/>  
                        </div>
                        
                    }
                </div>
            :
             <>

                <IoMdVideocam className="video__top__icon" />
                {vid.isPlaying && <FaPlay onClick={(s) => handleVideo("play", s)} className="video__play__icon fadeEffect" />}
                <div className="video--volume--outer">
                  {(vid?.hasMuted) ? (
                    <span onClick={(l) => handleVideo("mute", l)}>
                      <ImVolumeMedium
                        data-cy="vid-unmuted"
                        className="video__volume__icon"
                      />
                    </span>
                  ) : (
                    <span onClick={(l) => handleVideo("mute", l)}>
                          <FaVolumeMute
                            data-cy="vid-muted"
                            className="video__volume__icon"
                          />  
                    </span>
                  )} 
                </div>
             </>
            }
            
        </div>
      </Fragment>
    );
  }
);
VideoPost.propTypes = {
  className: PropTypes.string,
  clickEvent: PropTypes.func,
  whenLoadedData: PropTypes.func,
  whenCanPlay: PropTypes.func,
  isMuted: PropTypes.bool,
  isVidPlaying: PropTypes.bool
};
export default VideoPost;
