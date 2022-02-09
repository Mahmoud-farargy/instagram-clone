import React, { Fragment, useRef, useState, useContext, useEffect} from "react";
import { useHistory } from "react-router-dom";
import { Avatar } from "@material-ui/core";
import {
  FaPlay,
  FaPause,
  FaVolumeMute,
  FaVolumeUp,
  FaHeart,
  FaCommentAlt,
} from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import GetFormattedDate from "../../../Utilities/FormatDate";
import { AppContext } from "../../../Context";
import PropTypes from "prop-types";
import CommentsBox from "./CommentsBox/CommentsBox";
import * as Consts from "../../../Utilities/Consts";
import { withBrowseUser } from "../../../Components/HOC/withBrowseUser";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import OptionsModal from "../../../Components/Generic/OptionsModal/OptionsModal";
import Loader from "react-loader-spinner";
import { trimText } from "../../../Utilities/TrimText";
import FollowUnfollowBtn from "../../../Components/FollowUnfollowBtn/FollowUnfollowBtn";
import { connect } from "react-redux";
import * as actionTypes from "../../../Store/actions/actions";

function ReelItem(props) {
  const reelVideo = useRef(null);
  const commentInputRef = useRef(null);
  const timeouts = useRef(null);
  const _isMounted = useRef(true);
  const context = useContext(AppContext);
  const [isVideoPlaying, setVideoPlaying] = useState(false);
  const [muteVolume, setVolumeState] = useState(false);
  const [comments, setComments] = useState(false);
  const [commentTxt, setCommentTxt] = useState("");
  const [buffering, setBuffering] = useState(true);
  const [showOptions, setShowingOptions] =useState(false);
  const [hasError, setErrorState] = useState(false);
  const { item, index, browseUser, groupName, setCurrPlayingReel, currentPlayingReel, maxLength, changeModalState } = props;
  const {
    handleReelsActions,
    receivedData = {},
    reelsProfile = {},
    currentReel,
    notify,
  } = context;

  const onVideoClick = () => {
    if(reelVideo?.current){
      if (!reelVideo.current?.paused) {
        reelVideo && reelVideo.current.pause();
        setVideoPlaying(false);
      } else {
        reelVideo && reelVideo.current.play();
        setVideoPlaying(true);
        setCurrPlayingReel(index);
      }
    }

  };
  const setVolume = (event) => {
    event && event.stopPropagation();
    if (reelVideo && reelVideo.current) {
      if (reelVideo.current?.muted) {
          setVolumeState(false);
          reelVideo.current.muted = false;
      } else {
          setVolumeState(true);
          reelVideo.current.muted = true;
      }
    }
  };
  const showLikes = (x) => {
    x.stopPropagation();
    changeModalState("users",true, item.likes, Consts.LIKES);
  }
  const history = useHistory();
  const reelLiked = item?.likes?.some((j) => j.id === receivedData?.uid);
  const { uid } = reelsProfile;
  const { userAvatarUrl, userName }= receivedData;
  const { groupIndex, groupId } = currentReel;
  const handleReels = ({type, state, comment}) => {
    handleReelsActions(type, {
      boolean: state,
      ownerUid: uid,
      itemIndex: index,
      itemId: item?.id,
      groupIndex,
      groupId,
      userName,
      userAvatarUrl,
      comment: comment
    });
  };
  const toggleComments = (state) => {
      setComments(state);
      if(isVideoPlaying){
        onVideoClick();
      }
  };
  const submitComment = (s) => {
      s.preventDefault();
      s.stopPropagation();
    handleReels({type: "comment", comment: commentTxt});
    timeouts.current = setTimeout(() => {
      if(_isMounted.current){
          setCommentTxt("");
          notify("Sent");
          window.clearTimeout(timeouts?.current); 
      }
    },500);
  }
  const eventDelegation =(k)=> {
    k.persist();
    if(k.target.tagName === "SPAN"){
      setShowingOptions(false);
    }
  }
  useEffect(() => {
    if((currentPlayingReel !== index) && reelVideo.current){
      reelVideo && reelVideo.current.pause();
      setVideoPlaying(false);
    }
  },[currentPlayingReel, index]);
  useEffect(() => {
    if(reelVideo?.current){
        reelVideo.current.addEventListener("loadedmetadata", () =>{
          if(_isMounted.current){
              setBuffering(false);
          }
        })  
    }
    return () => {
      _isMounted.current = false;
      reelVideo.current = false;
      window.clearTimeout(timeouts?.current);
    };
  }, []);
  const onKeyPressing = (e) => {
    if(document.activeElement.tagName !== "INPUT"){
      switch(e.code){
        case "KeyM":
          e.preventDefault();
          setVolume();
        break;
        case "Space":
          onVideoClick();
          e.preventDefault();
        break;
        default: {}
      }  
    }

  }

  return (
    <Fragment>
      {/* Modal(s) */}

      <div className="reel--video--content">
        <div className="reel--inner--container">
          {comments && (
            <CommentsBox
            showComments={comments}
            ownerUid={uid}
            groupId={groupId}
            groupIndex={groupIndex}
            userName={userName}
            userAvatarUrl={userAvatarUrl}
            itemIndex={index}
            itemId={item?.id}
            setComments={setComments}
            item={item} />
          )}
         {
           buffering &&
           <div className="buffer--loading">
             {
               hasError ?
               <div className="reel--loading--error flex-column">
                 <h4 className="loading__error">Failed to load Video. Please come back later.</h4>
               </div>
              :
              <div className="reels-loading w-100 h-100 flex-column">
                    <Loader
                      type="TailSpin"
                      color="var(--white)"
                      height={60}
                      width={60}
                      arialLabel="loading-indicator"
                      />
              </div>
             }
           </div> 
         }  
         <video
              onClick={() => onVideoClick()}
              ref={reelVideo}
              src={item?.contentURL}
              onKeyDown={(c) => onKeyPressing(c)}
              loop
              onError={() => setErrorState(true)}
              playsInline
              tabIndex="0"
            />
        {
          showOptions &&
          (<div>
            <OptionsModal>
              <div className="reel--items--inner" onClick={(q)=> eventDelegation(q)}>
                  <span className="text-danger font-weight-bold"
                  onClick={() => handleReelsActions("delete-reel", {
                      contentPath: item?.contentName,
                      ownerUid: receivedData?.uid,
                      itemIndex: index,
                      itemId: item?.id,
                      groupIndex,
                      groupId,
                      history: history
                      })} >
                  {" "}
                Delete reel
                </span>
                <span className="text-danger font-weight-bold"
                  onClick={() => handleReelsActions("delete-group", {
                      contentPath: item?.contentName,
                      ownerUid: receivedData?.uid,
                      itemIndex: index,
                      itemId: item?.id,
                      groupIndex,
                      groupId,
                      history: history
                      })} >
                  {" "}
                Delete "{groupName}" group
                </span>
                <span onClick={()=> history.goBack()}>
                Close Reels
                </span>
                <span >
                  {" "}
                  Cancel
                </span>
              </div>
              
           
          </OptionsModal>
          <div
            style={{
              opacity: showOptions ? "1" : "0",
              display: showOptions ? "block" : "none",
              transition: "all 0.5s ease",
            }}
            className="backdrop "
            onClick={() => setShowingOptions(false)}
          ></div>
          </div>)
        }
          <header className="reel--header flex-row">
                <div className="reel--header--left flex-row">
                  <Avatar loading="lazy" src={reelsProfile?.userAvatarUrl} alt={reelsProfile?.userName} title={ reelsProfile?.userName} />
                  <div className="reel--user--info flex-column">
                    <span className="reel__user__name" onClick={() => browseUser(uid, reelsProfile?.userName)} title={reelsProfile?.userName}>{trimText(reelsProfile?.userName,20)}</span>
                    {
                      reelsProfile?.uid !== receivedData?.uid &&
                      <div className="reel--follow--unfollow">
                        <FollowUnfollowBtn shape="tertiary" userData={{userId: reelsProfile?.uid, uName: reelsProfile?.userName, uAvatarUrl: reelsProfile?.userAvatarUrl, isVerified: reelsProfile?.isVerified}} />
                      </div>
                    }
                  </div>
                  <span className="reel__date">
                    <GetFormattedDate date={item?.date.seconds} />
                  </span>
                </div>
            <div className="reel--header--right flex-row">
              {isVideoPlaying ? (
                <div onClick={() => onVideoClick()}>
                  <FaPause />
                </div>
              ) : (
                <div onClick={() => onVideoClick()}>
                  <FaPlay />
                </div>
              )}
              {!muteVolume ? (
                <div onClick={(b) => setVolume(b)}>
                  <FaVolumeUp />
                </div>
              ) : (
                <div onClick={(b) => setVolume(b)}>
                  <FaVolumeMute />
                </div>
              )}
            </div>
          </header>
          <footer className="reel--footer w-100 flex-row">
            <form onSubmit={(s) => submitComment(s)} className="reel--comment w-100 flex-row">
                                <input type="text" ref={commentInputRef} value={commentTxt} onChange={(f) => setCommentTxt(f.target.value)} placeholder={`Replay to ${reelsProfile?.userName}...`} />  
                                {
                                    commentTxt && <span className="send__reel__comment">Send</span>
                                }

            </form>
          </footer>
          <div className="interaction--box flex-column">
            <div className="reel--num">
                  <span className="reel--num--inner">
                        {index +1}/{maxLength}
                  </span>
            </div>
         {
             uid === receivedData?.uid &&
             <div className="reel--comment reel--action--btn flex-column">
                 <span className="reels__options__ico">
                    <BiDotsHorizontalRounded onClick={() => setShowingOptions(true)} />
                 </span>
              
            </div>
         } 
            <div className="reel--likes reel--action--btn flex-column">
              {!reelLiked ? (
                <span data-cy="like" className="post--like--icon" onClick={() => handleReels({type: "like", state: true})}>
                  <FiHeart />
                </span>
              ) : (
                <span
                  data-cy="like"
                  onClick={() => handleReels({type: "like", state:false})}
                  style={{
                    animation: reelLiked && "boundHeart 0.5s forwards ease",
                  }}
                  className="liked__heart"
                >
                  <FaHeart />
                </span>
              )}

              <small onClick={(x) => showLikes(x)}>
                {item?.likes &&
                  item.likes.length > 0 &&
                  item.likes.length?.toLocaleString()}
              </small>
            </div>
            <div className="reel--comment reel--action--btn flex-column">
              <span onClick={() => toggleComments(true)}>
                <FaCommentAlt />
              </span>

                <small>{item?.comments && item?.comments.length > 0 && item?.comments.length.toLocaleString()}</small>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
ReelItem.propTypes = {
  item: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  browseUser: PropTypes.func.isRequired,
  groupName: PropTypes.string.isRequired,
  setCurrPlayingReel: PropTypes.func.isRequired,
  currentPlayingReel: PropTypes.number.isRequired,
  maxLength: PropTypes.number,
  changeModalState: PropTypes.func.isRequired
};
const mapDispatchToProps = dispatch => {
  return {
      changeModalState: (modalType, hasDataList, usersList, usersType) => dispatch({type: actionTypes.CHANGE_MODAL_STATE, payload: {modalType, hasDataList, usersList, usersType}})
  }
}
export default connect(null, mapDispatchToProps)(withBrowseUser(React.memo(ReelItem)));
