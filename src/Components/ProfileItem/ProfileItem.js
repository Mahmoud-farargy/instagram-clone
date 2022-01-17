import React, { Fragment, useRef, useState, useEffect, memo } from "react";
import { FaHeart } from "react-icons/fa";
import { FaComment } from "react-icons/fa";
import PropTypes from "prop-types";
import igAudioImg from "../../Assets/ig-audio.jpeg";
import ScrollTrigger from 'react-scroll-trigger';
import LoadContentFail from "../../Components/LoadContentFail/LoadContentFail";
import Loader from "react-loader-spinner";
import reelPlaceholder from "../../Assets/reels-instagram-logo-white_1379-5039.jpeg";
import * as Consts from "../../Utilities/Consts";
import { lowerCaseString } from "../../Utilities/Utility";
import YoutubeItem from "./YoutubeItem/YoutubeItem";
import TextItem from "./TextItem/TextItem";

const ProfileItem = ({ itemType = "post" ,post, openPost, index, className, withOwnersName, isSavedPost , onLoadingFail }) => {
  const videoPost = useRef(null);
  const _isMounted = useRef(true);
  const [isBuffering, setBuffering] = useState(true);
  const [hasVideoLoaded, setVidLoaded] = useState(false);
  const [loadContentFailed, setFailingState] = useState(false);
  const [isVidPlaying, setPlayingState] = useState(false); 
  const [preLoad, setPreLoad] = useState("none");
  const handleVideoPlaying =(type) => {
    if(preLoad === "none") setPreLoad("metadata");
    if(hasVideoLoaded && !isBuffering && videoPost && videoPost?.current && preLoad !== "none"){
        if(lowerCaseString(type) === "on-view"){
          setPlayingState(true);
        }else if(lowerCaseString(type) === "out-of-view"){
          setPlayingState(false);
        }
    }
  }
  useEffect(() => {
    if(videoPost.current && _isMounted.current){
      videoPost.current.addEventListener("loadedmetadata", () =>{
        if(_isMounted.current){
          setVidLoaded(true);
          setBuffering(false);
          loadContentFailed && setFailingState(false); 
        }
      });
    }
    return () => {
      _isMounted.current = false;
      videoPost.current = false;
    }
  }, []);
  useEffect(() => {
    if(hasVideoLoaded && !isBuffering && videoPost && videoPost?.current && preLoad !== "none"){
      if(!isVidPlaying && typeof videoPost.current.play === "function"){
        videoPost.current.play();
      }else if(isVidPlaying && typeof videoPost.current.pause === "function"){
        videoPost.current.pause();
      }
    }
  },[preLoad, isBuffering, isVidPlaying, hasVideoLoaded]);
  const onFailing = () => {
    if(isSavedPost) onLoadingFail(post?.postOwnerId, post?.id);
    setFailingState(true);
  }
  return post &&(
        <Fragment>
      <div className={`profile--posts--container w-100 ${className ? className : ""}`}>
        
     {
       lowerCaseString(itemType) === Consts.Post ?
       //POST
        <div
            onClick={() => openPost({type: lowerCaseString(itemType), postId: post?.id, postOwnerId: post?.postOwnerId})}
            className="user--img--container flex-column fadeEffect"
          >
            {post?.contentType === Consts.Image ? (
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
            ) : post?.contentType === Consts.Video ? (
              <ScrollTrigger onEnter={() => handleVideoPlaying("on-view")} onExit={() => handleVideoPlaying("out-of-view")} >
              <video
                ref={videoPost}
                src={post?.contentURL}
                className="users__profile__image"
                muted
                loop
                playsInline
                contextMenu="users__profile__image"
                onContextMenu={() => false}
                onError={() => onFailing()}
              />
                {isBuffering &&
                  <div className="buffererror flex-column">
                      {
                          loadContentFailed ?
                        <LoadContentFail contentType={Consts.Video} />
                          :
                          <div className="vid--buffer">
                              <Loader
                              type="ThreeDots"
                              color="var(--light-black)"
                              arialLabel="loading-indicator"
                              height={30}
                              width={30}/>
                          </div>
                          
                      }
                  </div>
                  }
              </ScrollTrigger>
            ) : post?.contentType === Consts.Audio ? (
              <img className="users__profile__image" src={post?.songInfo?.artwork || igAudioImg} loading="lazy" alt={`post #${index}`} />)
              : post?.contentType === Consts.Tweet?
                <TextItem txt={post.contentURL} />
              : (post?.contentType === Consts.Poll && post.pollData?.question) ?
                <TextItem txt={post.pollData.question} />
              : (post?.contentType === Consts.YoutubeVid && post.youtubeData) ?
                <YoutubeItem thumbnail={post.youtubeData.thumbnail} index={index}/>
              : <h4>Not found</h4>
            }

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
          :  lowerCaseString(itemType) === Consts.Reel ?
          //REEL
          <div
          onClick={() => post?.id && openPost({type: lowerCaseString(itemType), reelId: post?.id, groupId: post?.groupId , reelUid: post?.reelOwnerId})}
          className="user--img--container flex-column"
        >
          <img
              loading="lazy"
              src={reelPlaceholder}
              className={`users__profile__image`}
              alt={`A Reel by ${post?.userName}`}
              decoding="auto"
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

};
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
