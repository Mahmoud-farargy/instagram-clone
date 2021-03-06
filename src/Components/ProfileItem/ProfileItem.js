import React, { Fragment, useRef, useState, useEffect, memo } from "react";
import { FaHeart } from "react-icons/fa";
import { FaComment } from "react-icons/fa";
import PropTypes from "prop-types";
import igAudioImg from "../../Assets/ig-audio.jpeg";
import ScrollTrigger from 'react-scroll-trigger';
import LoadContentFail from "../../Components/LoadContentFail/LoadContentFail";
import Loader from "react-loader-spinner";
import reelPlaceholder from "../../Assets/reels-instagram-logo-white_1379-5039.jpeg";

const ProfileItem = React.forwardRef(({ itemType = "post" ,post, openPost, index, className, withOwnersName, isSavedPost , onLoadingFail }, ref) => {
  const videoPost = useRef(null);
  const [isBuffering, setBuffering] = useState(true);
  const [isVideoLoaded, setVidLoading] = useState(false);
  const [loadContentFailed, setFailingState] = useState(false);
  const [isVidPlaying, setPlayingState] = useState(false); 
  const [preLoad, setPreLoad] = useState("none");
  const handleVideoPlaying =(type) => {
    if(preLoad === "none") setPreLoad("metadata");
    if(isVideoLoaded && !isBuffering && videoPost && videoPost?.current && preLoad !== "none"){
        if(type.toLowerCase() === "on-view"){
          setPlayingState(true);
        }else if(type.toLowerCase() === "out-of-view"){
          setPlayingState(false);
        }
    }
  }
  useEffect(() => {
    if(isVideoLoaded && !isBuffering && videoPost && videoPost?.current && preLoad !== "none"){
      if(!isVidPlaying && typeof videoPost.current.play === "function"){
        videoPost.current.play();
      }else if(isVidPlaying && typeof videoPost.current.pause === "function"){
        videoPost.current.pause();
      }
  }
  },[preLoad, isBuffering, isVidPlaying, isVideoLoaded]);
  const onFailing = () => {
    if(isSavedPost) onLoadingFail(post?.postOwnerId, post?.id);
    setFailingState(true);
  }
  return (
        <Fragment>
      <div ref={ref} className={`profile--posts--container w-100 ${className ? className : ""}`}>
        
     {
       itemType.toLowerCase() === "post" ?
       //POST
        <div
            onClick={() => openPost({type: itemType.toLowerCase(), postId: post?.id, postOwnerId: post?.postOwnerId})}
            className="user--img--container flex-column fadeEffect"
          >
            {post?.contentType === "image" ? (
              <>
              <img
                loading="lazy"
                className={`users__profile__image ${isBuffering && "blurry_img"}`}
                src={post?.contentURL}
                alt={`post #${index}`}
                onLoad={(x) => {setBuffering(false); x.persist()}}
                onError={() => onFailing()}/>

                {isBuffering &&
                  <div className="buffererror flex-column">
                      {
                          loadContentFailed &&
                        <LoadContentFail contentType="image" /> 
                      }
                  </div>
                  }
              </>
            ) : post?.contentType === "video" ? (
              <ScrollTrigger onEnter={() => handleVideoPlaying("on-view")} onExit={() => handleVideoPlaying("out-of-view")} >
              <video
                className="users__profile__image"
                muted
                disabled
                ref={videoPost}
                loop
                contextMenu="users__profile__image"
                onContextMenu={() => false}
                src={post?.contentURL}
                onCanPlay={(x) => {setBuffering(false); x.persist()}}
                onLoadedData={(k)=> {setVidLoading(true); (loadContentFailed && setFailingState(false)); k.persist()}}
                onError={() => onFailing()}
              />
                {isBuffering &&
                  <div className="buffererror flex-column">
                      {
                          loadContentFailed ?
                        <LoadContentFail contentType="video" />
                          :
                          <div className="vid--buffer">
                              <Loader
                              type="ThreeDots"
                              color="var(--light-black)"
                              height={30}
                              width={30}/>
                          </div>
                          
                      }
                  </div>
                  }
              </ScrollTrigger>
            ) : post?.contentType === "audio" ?
              <img className="users__profile__image" src={post?.songInfo?.artwork || igAudioImg} loading="lazy" alt={`post #${index}`} />
              : (
              <h4>Not found</h4>
            )}

            <div className="user--img--cover flex-column fadeEffect">
              {
                !isSavedPost &&
                <div className="flex-row">
                <span className="mr-3">
                  <FaHeart /> {post?.likes?.people?.length.toLocaleString()}
                </span>
                <span>
                  <FaComment />{" "}
                  {post?.comments?.length &&
                    post?.comments?.length.toLocaleString()}{" "}
                </span>

              </div>
              }
              {
                  withOwnersName &&
                  <span className="owner--post--name mt-1">
                    By {post?.userName}
                  </span>
              }
            </div>
          </div>
          :  itemType.toLowerCase() === "reel" ?
          //REEL
          <div
          onClick={() => post?.id && openPost({type: itemType.toLowerCase(), reelId: post?.id, groupId: post?.groupId , reelUid: post?.reelOwnerId})}
          className="user--img--container flex-column"
        >
          <img
              loading="lazy"
              src={reelPlaceholder}
              className={`users__profile__image`}
              alt={`A Reel by ${post?.userName}`}
             />
          <div className="user--img--cover flex-column fadeEffect">
            {
              <div className="flex-row">
                <span className="mr-3">
                  <FaHeart /> {post?.likes?.length.toLocaleString()}
                </span>
                <span>
                  <FaComment />{" "}
                  {post?.comments?.length &&
                    post?.comments?.length.toLocaleString()}{" "}
                </span>

              </div>
            }
          </div>
        </div>
          : <h4>Not Found</h4>
     }   

      </div>
    </Fragment>
  )

});
ProfileItem.propTypes = {
  itemType: PropTypes.string,
  post: PropTypes.object.isRequired,
  openPost: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  withOwnersName: PropTypes.bool,
  isSavedPost: PropTypes.bool,
  onLoadingFail: PropTypes.func
};
export default memo(ProfileItem);
