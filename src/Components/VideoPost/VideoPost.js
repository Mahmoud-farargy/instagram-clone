import React, { Fragment, useState, useEffect, useContext } from "react";
import "./VideoPost.scss";
import { IoMdVideocam } from "react-icons/io";
import { FaPlay, FaVolumeMute } from "react-icons/fa";
import { ImVolumeMedium } from "react-icons/im";
import Loader from "react-loader-spinner";
import PropTypes from "prop-types";
import { AppContext } from "../../Context";
import $ from "jquery";
import LoadContentFail from "../LoadContentFail/LoadContentFail";

const VideoPost = React.forwardRef(
  (
    { className, whenLoadedData, whenEnded, whenCanPlay, isMuted = false, isVidPlaying, ...props },
    ref
  ) => {
    const [vid, setVideo] = useState({
      hasMuted:  false,
      isPlaying: false,
      hasLoaded: false,
      isBuffering: true,
      hasEnded: false,
      canPlay: false,
      hasError: false,
    });
    const { pauseMedia } = useContext(AppContext);
    useEffect(() => {
       $(document).ready(() => {
        typeof isMuted === "boolean" && setVideo({ ...vid, hasMuted: isMuted });
       });
    },[]);
    useEffect(() => {
      if(!vid.isBuffering && vid?.hasLoaded && ref && ref.current && ref.current?.preload !== "none"){
        if (vid?.isPlaying && typeof ref.current.pause === "function") {
           ref.current.pause();
        } else if(!vid?.isPlaying && typeof ref.current.play === "function"){
           ref.current.play();
        }
        if (!vid?.hasMuted) {
           ref.current.volume = 1;
        } else {
           ref.current.volume = 0.0;
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
    const triggerLoadedData = (event) => {
      event.persist();
      whenLoadedData && typeof whenLoadedData === "function" && whenLoadedData();
      setVideo({ ...vid, hasLoaded: true });
    };
    const triggerEnded = (event) => {
      event.persist();
      whenEnded && typeof whenEnded === "function" && whenEnded();
      setVideo({ ...vid, hasEnded: true });
    };
    const triggerCanPlay = (event) => {
      event.persist();
      whenCanPlay && typeof whenCanPlay === "function" && whenCanPlay(false);
      setVideo({ ...vid, isBuffering: false });
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
                    onLoadedData={(k) => triggerLoadedData(k)}
                    onEnded={(k) => triggerEnded(k)}
                    onCanPlay={(k) => triggerCanPlay(k)}
                    draggable="false"
                    className="post__card__content"
                    onError={(k) => triggerError(k)}
                    playsInline
                    // webkit-playsinline
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
                  {!vid?.hasMuted ? (
                      <ImVolumeMedium
                      data-cy="vid-unmuted"
                      onClick={(l) => handleVideo("mute", l)}
                      className="video__volume__icon"
                      />
                  ) : (
                      <FaVolumeMute
                      data-cy="vid-muted"
                      onClick={(l) => handleVideo("mute", l)}
                      className="video__volume__icon"
                      />
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
  whenEnded: PropTypes.func,
  whenCanPlay: PropTypes.func,
  isMuted: PropTypes.bool,
  isVidPlaying: PropTypes.bool
};
export default VideoPost;
