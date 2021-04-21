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

function ReelItem(props) {
  const reelVideo = useRef(null);
  const context = useContext(AppContext);
  const [isVideoPlaying, setVideoPlaying] = useState(false);
  const [muteVolume, setVolumeState] = useState(false);
  const [comments, setComments] = useState(false);
  const [commentTxt, setCommentTxt] = useState("");
  const [buffering, setBuffering] = useState(true);
  const [showOptions, setShowingOptions] =useState(false);
  const { item, index, browseUser, groupName, setCurrPlayingReel, currentPlayingReel } = props;
  const {
    handleReelsActions,
    receivedData = {},
    reelsProfile = {},
    currentReel,
    changeModalState,
    notify,
  } = context;

  const onVideoClick = () => {
    if (isVideoPlaying) {
      reelVideo && reelVideo.current.pause();
      setVideoPlaying(false);
    } else {
      reelVideo && reelVideo.current.play();
      setVideoPlaying(true);
      setCurrPlayingReel(index);
    }
  };
  const setVolume = (event) => {
    event.stopPropagation();
    if (muteVolume) {
      if (reelVideo) {
        setVolumeState(false);
        reelVideo.current.volume = 1;
      }
    } else {
      if (reelVideo) {
        setVolumeState(true);
        reelVideo.current.volume = 0.0;
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
    handleReels({type: "comment", comment: commentTxt});
    setTimeout(() => {
        setCommentTxt("");
        notify("Sent");
    },500);
   
  }
  const eventDelegation =(k)=> {
    k.persist();
    if(k.target.tagName === "SPAN"){
      setShowingOptions(false);
    }
  }
  const detectBuffering = (event) =>{
    event.persist();
    setBuffering(false);
  }
  useEffect(() => {
    if(currentPlayingReel !== index){
      reelVideo && reelVideo.current.pause();
      setVideoPlaying(false);
    }
  },[currentPlayingReel])
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
              <div className="reels-loading w-100 h-100 flex-column">
                    <Loader
                      type="TailSpin"
                      color="#fff"
                      height={60}
                      width={60}
                      timeout={5000}/>
              </div>
           </div> 
         }  
         <video
              onClick={() => onVideoClick()}
              onKeyPress={(event) => event.charCode === 32 && onVideoClick()}
              ref={reelVideo}
              src={item?.contentURL}
              loop
              onCanPlay={(k) => detectBuffering(k)}
            />
        {
          showOptions &&
          (<div>
            <OptionsModal>
              <div className="reel--items--inner" onClick={(q)=> eventDelegation(q)}>
                  <span
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
                <span
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
              <span className="reel__user__name" onClick={() => browseUser(uid, reelsProfile?.userName)} title={reelsProfile?.userName}>{reelsProfile?.userName}</span>
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
                                <input type="text" value={commentTxt} onChange={(f) => setCommentTxt(f.target.value)} placeholder={`Replay to ${reelsProfile?.userName}...`} />  
                                {
                                    commentTxt && <span className="send__reel__comment">Send</span>
                                }

            </form>
          </footer>
          <div className="interaction--box flex-column">
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
                <span onClick={() => handleReels({type: "like", state: true})}>
                  <FiHeart />
                </span>
              ) : (
                <span
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
  currentPlayingReel: PropTypes.number.isRequired
};
export default withBrowseUser(React.memo(ReelItem));
