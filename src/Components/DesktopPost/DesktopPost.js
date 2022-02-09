import React, {
  Fragment,
  useState,
  useContext,
  useEffect,
  useRef
} from "react";
import "./DesktopPost.scss";
import "../../Components/Post/Post.css";
import { HiDotsHorizontal } from "react-icons/hi";
import { Avatar } from "@material-ui/core";
import TruncateMarkup from "react-truncate";
import { FiSend } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa";
import Loader from "react-loader-spinner";
import {
  IoIosArrowBack,
  IoIosArrowForward,
} from "react-icons/io";
import { RiBookmarkLine, RiBookmarkFill } from "react-icons/ri";
import { AppContext } from "../../Context";
import Comment from "../../Components/Comment/Comment";
import { GoVerified } from "react-icons/go";
import OptionsModal from "../../Components/Generic/OptionsModal/OptionsModal";
import { withBrowseUser } from "../../Components/HOC/withBrowseUser";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import GetFormattedDate from "../../Utilities/FormatDate";
import Caption from "../../Components/Generic/Caption/Caption";
import { insertIntoText } from "../../Utilities/InsertIntoText";
import AudioContent from "../../Components/AudioContent/AudioContent";
import * as Consts from "../../Utilities/Consts";
import MutualLikes from "../../Pages/UsersProfile/MutualFriendsList/MutualFriendsItem";
import FollowUnfollowBtn from "../../Components/FollowUnfollowBtn/FollowUnfollowBtn";
import { trimText } from "../../Utilities/TrimText";
import VideoPostComp from "../../Components/VideoPost/VideoPost";
import { retry } from "../../Utilities/RetryImport";
import TweetContent from "../TweetContent/TweetContent";
import PollContent from "../PollContent/PollContent";
import YoutubeContent from "../YoutubeContent/YoutubeContent";
import LikePost from "../Generic/LikePost/LikePost";
import { connect } from "react-redux";
import * as actionTypes from "../../Store/actions/actions";
const EmojiPicker = React.lazy(() => retry(() => import("../../Components/Generic/EmojiPicker/EmojiPicker")));

const DesktopPost = (props) => {
  const { browseUser, disableArrows, changeModalState, modalsState } = props;
  const history = useHistory();
  const context = useContext(AppContext);
  const [currPost, setCurrPost] = useState({
    caption: "",
    contentType: "",
    contentURL: "",
    comments: [],
    likes: {},
    location: "",
    date: {},
    postOwnerId: "",
    id: "",
    contentName: "",
    userName: "",
    songInfo: {},
    pollData: {},
    youtubeData: {},
    disableComments: false
  });
  const {
    changeMainState,
    usersProfileData,
    currentPostIndex,
    uid,
    handlePeopleLikes,
    receivedData,
    handleSubmittingComments,
    handleSubComments,
    handleUserBlocking,
    handleLikingComments,
    onCommentDeletion,
    deletePost,
    handleVoting,
    isOpeningPost,
    loadingState
  } = context;
  const [ currentIDX, setCurrentIDX ] = useState(0);
  const [isSendingComment, setSendingComment] = useState(false);
  const [compState, setCompState] = useState({
    postLiked: false,
    insertedComment: "",
    btnClicks: 0,
    doubleLikeClicked: false,
    replayData: {},
    alsoLiked: []
  });
  // Refs
  const inputField = useRef(null);
  const _isMounted = useRef(true);
  const timeouts = useRef(null);
  const vidRef = useRef(null);
  const scrollToBottom = useRef(null);
  // xxxx-Refs--xxx
  var following = receivedData?.following;
  const currData = (typeof currentIDX === "number" && usersProfileData?.posts) ? usersProfileData?.posts[currentIDX] : {   
  caption: "",
  contentType: "",
  contentURL: "",
  comments: [],
  likes: {},
  location: "",
  date: {},
  postOwnerId: "",
  id: "",
  contentName: "",
  userName: "",
  songInfo: {},
  pollData: {},
  youtubeData: {},
  disableComments: false
};
  useEffect(() => {
    changeMainState("currentPage", "Post");
    return () => {
      inputField.current = false;
      timeouts.current = false;
      vidRef.current = false;
      scrollToBottom.current = false;
      _isMounted.current = false;
      window.clearTimeout(timeouts.current);
    };
  }, []);
  useEffect(() => { 
    updateUsersWhoLiked();
    setCurrentIDX(typeof currentPostIndex?.index === "number" ? currentPostIndex.index : 0);
    if(compState.insertedComment) setCompState({...compState, insertedComment: ""});
}, [((currentPostIndex && currentPostIndex.index) && currentPostIndex.index)]);
useEffect(() => {
  (scrollToBottom && scrollToBottom.current && scrollToBottom.current?.scrollIntoView) && scrollToBottom.current.scrollIntoView({block: "end"});
},[currPost?.comments?.length]);
useEffect(() => {
  setCurrPost(currData);
}, [currData]);
  var postLiked = usersProfileData?.posts && currPost?.likes?.people?.some((el) => el.id === uid);
  const areCommentsDisabled = (usersProfileData?.profileInfo?.professionalAcc?.disableComments || currPost?.disableComments);
  const handleCurrLikes = (boolean) => {
      const { postOwnerId, contentURL, contentType, id } = currPost;
      handlePeopleLikes(
        boolean,
        id,
        postOwnerId,
        receivedData?.userName,
        receivedData?.userAvatarUrl,
        uid,
        contentURL,
        contentType
      );
  };
  const directTo = () => {
    browseUser(usersProfileData?.uid, usersProfileData?.userName ).then(() => {
      if(_isMounted?.current){
          changeModalState("users", false, "", "");
      }
    })
  }
  const doubleClickEvent = () => {
    let currCount = compState.btnClicks;
    setCompState({
      ...compState,
      btnClicks: compState.btnClicks + 1,
    });
    const resetCounter = () => {
      setCompState({
        ...compState,
        btnClicks: 0,
      });
    };
    if (currCount === 1) {
      handleCurrLikes(true);
      resetCounter();
      setCompState({
        ...compState,
        doubleLikeClicked: true,
      });
      timeouts.current = setTimeout(() => {
        if(_isMounted){
            setCompState({
              ...compState,
              doubleLikeClicked: false,
            });
            window.clearTimeout(timeouts.current);  
        }
      }, 1100);
    }
    timeouts.current = setTimeout(() => {
      if(_isMounted){
        resetCounter();
         window.clearTimeout(timeouts.current); 
      }
    }, 1000);
  };
  const updateUsersWhoLiked = () => {
    setCompState({
      ...compState,
      alsoLiked: following?.filter(user => currPost?.likes?.people?.some((el) => (user?.receiverUid !== receivedData?.uid) && (user?.receiverUid === el?.id))).slice(0,3) 
    })
  }
  useEffect(()=> {
    updateUsersWhoLiked();
  },[following]);
  const submitComment = (v) => {
    v.preventDefault();

    let postsData = usersProfileData?.posts;
    if (postsData) {
      const { id, postOwnerId, contentURL, contentType } =  currPost;
      if (compState.insertedComment !== "") {
        setSendingComment(true);
        // //subcomment
        if ( compState.replayData && 
          Object.keys(compState.replayData).length > 0 &&
          /^[@]/.test(compState.insertedComment)
        ) {
          if(compState){
              handleSubComments(
              compState.replayData,
              compState.insertedComment,
              receivedData?.userAvatarUrl,
              false,
              contentURL,
              contentType
            ).then(() => {
              if(_isMounted.current){
                setSendingComment(false);
              }
            }).catch(() =>{
              if(_isMounted.current){
                setSendingComment(false);
              }
            });
          }else{
            setSendingComment(false);
          }

        } else {
          //comment
          handleSubmittingComments(
            uid,
            receivedData?.userName,
            compState.insertedComment,
            receivedData?.userAvatarUrl,
            id,
            postOwnerId,
            contentURL,
            contentType
          ).then(() => {
            if(_isMounted?.current){
              setSendingComment(false);
            }
          }).catch(() => {
            if(_isMounted?.current){
              setSendingComment(false);
            }
          });
        }
        setCompState({
          ...compState,
          insertedComment: "",
          replayData: {},
        });
      }
    }
  };
  const replayFunc = (
    postOwnerName,
    commentIndex,
    postIndex,
    postId,
    postOwnerId,
    senderUid,
    commentId
  ) => {
    inputField.current.focus();
    setCompState({
      ...compState,
      replayData: {
        postOwnerName,
        commentIndex,
        postIndex,
        postId,
        postOwnerId,
        senderUid,
        commentId
      },
      insertedComment: `@${postOwnerName} `,
    });
  };
  const blockUser = (blockedUid, userName, userAvatarUrl, profileName) => {
    handleUserBlocking(
      true,
      blockedUid,
      userName,
      userAvatarUrl,
      profileName
    ).then(() => _isMounted?.current && history.push("/"));
  };
  
  var isVerified = usersProfileData?.isVerified;

  const onPostMovement = (direction) => {
    if(usersProfileData?.posts.length > 1 && !disableArrows){
          const finalIndex = usersProfileData?.posts.length - 1;
          let currentDirection;

          if (direction === "left") {
            currentIDX > 0
              ? (currentDirection = currentIDX - 1)
              : (currentDirection = finalIndex);
          } else if (direction === "right") {
            currentIDX < finalIndex
              ? (currentDirection = currentIDX + 1)
              : (currentDirection = 0);
          }
          changeMainState("currentPostIndex", {
            ...currentPostIndex,
            index: currentDirection,
            postId: usersProfileData?.posts?.[currentDirection]?.id || ""
          });
    }
   
  };
  const navigate = (event) => {
    if(document.activeElement !== inputField.current){
        if (event.keyCode === 37) {
          onPostMovement("left");
        } else if (event.keyCode === 39) {
          onPostMovement("right");
        }  
    }
  };
  const onEmojiClick = (e, x) => {
    e.persist();
    setCompState({
      ...compState,
      insertedComment: insertIntoText(compState?.insertedComment, x.emoji)
    })
  }
  const similarsStr = (currPost?.likes?.people?.some(el => el?.id === uid) && currPost?.likes?.people?.length >3) ? (currPost?.likes?.people?.length?.toLocaleString() -3) : (currPost?.likes?.people?.length?.toLocaleString() -2);
  return (
    <Fragment> 
        <span
          className="post--modal--close"
          onClick={() => changeModalState("users", false, "", "")}
        >
          &times;
        </span>
        
     {(modalsState?.comments || modalsState?.users) &&  <div
              style={{
                position: "fixed",
                zIndex: "1600",
                opacity: "1",
                display: ( modalsState?.comments ||modalsState?.users ) ? "block" : "none",
                transition: "all 0.5s linear",
              }}
              className="backdrop"
              onClick={() => changeModalState("users", false, "", "")}
          ></div>}
      <section className="desktopPost flex-column">

        {modalsState?.options && (
          <div>
              <OptionsModal>
               {
                  usersProfileData?.uid === receivedData?.uid ?
                  <span className="text-danger font-weight-bold" onClick={() => deletePost( currPost?.id, currentIDX, currPost?.contentName, currPost?.contentURL ).then(() => _isMounted.current && changeModalState("comments", false))}>
                          Delete post
                  </span>
                  :
                  <div>
                    <span className="text-danger font-weight-bold"
                      onClick={() =>
                        blockUser(
                          usersProfileData?.uid,
                          usersProfileData?.userName,
                          usersProfileData?.userAvatarUrl,
                          usersProfileData?.profileInfo &&
                            usersProfileData.profileInfo?.name
                            ? usersProfileData?.profileInfo?.name
                            : ""
                        )
                      }
                    >
                      {" "}
                      Block this user
                    </span>
                    <span style={{padding: 0}}>
                        <FollowUnfollowBtn shape="quaternary" userData={{userId: usersProfileData?.uid, uName: usersProfileData?.userName, uAvatarUrl: usersProfileData?.userAvatarUrl, isVerified: usersProfileData?.isVerified}} />
                    </span>
                </div>
               } 
              <span onClick={() => changeModalState("options", false)}>
                {" "}
                Cancel
              </span>
            </OptionsModal>
            <div
              style={{
                position: "fixed",
                zIndex: "1500",
                opacity: "1",
                height: "100vh",
                width: "100%",
                display:  "block",
                transition: "all 0.5s linear",
              }}
              className="backdrop"
              onClick={() => changeModalState("options", false)}
          ></div>
          </div>
          
        )}
        {
          isOpeningPost ? 
          <h1>Loading post..</h1>
          : usersProfileData?.posts?.[currentIDX] ?
            <div className="d--post--container flex-column">
              <span
                className={
                  (usersProfileData?.posts.length > 1 && !disableArrows)
                    ? "desktop__left__arrow"
                    : "desktop__left__arrow disabled"
                }
                onClick={() => onPostMovement("left")}
              >
                <IoIosArrowBack />
              </span>
              <span
                className={
                  (usersProfileData?.posts.length > 1 && !disableArrows)
                    ? "desktop__right__arrow"
                    : "desktop__right__arrow disabled"
                }
                onClick={() => onPostMovement("right")}
              >
                <IoIosArrowForward />
              </span>
              <article
                className="d--post--box flex-column"
                tabIndex="0"
                onKeyDown={navigate}
              >
                {/* post start */}
                <div id="post" className="post--card--container modalShow post--page">
                  <article className="post--card--article">
                  <div className="post--card--body desktop--left">
                      {currPost?.contentType === Consts.Image ? (
                        <div className="w-100 h-100" style={{position: "relative"}}>
                          <img
                            loading="lazy"
                            onClick={() => doubleClickEvent()}
                            className="post__card__content"
                            src={currPost?.contentURL}
                            alt="post"
                            draggable="false"
                          />
                          {compState.doubleLikeClicked ? (
                            <div>
                              <div className="liked__double__click__layout"></div>
                              <div className="liked__double__click">
                                <span
                                  style={{
                                    animation: compState.doubleLikeClicked
                                      ? "boundHeartOnDouble 0.9s forwards ease-out"
                                      : null,
                                  }}
                                >
                                  <FaHeart />
                                </span>
                              </div>

                            </div>
                          ) : null}
                        </div>
                      ) : currPost?.contentType === Consts.Video ? (
                        <div className="w-100 h-100" style={{position: "relative"}}>
                          <VideoPostComp
                            src={currPost?.contentURL}
                            isMuted={true}
                            ref={vidRef}
                            isVidPlaying={true}
                            />
                        </div>
                      ) :  currPost?.contentType === Consts.Audio ? (
                        <div className="post__card__content__outer">
                            <AudioContent autoPlay url={currPost?.contentURL} songInfo={currPost?.songInfo || {}} userName={usersProfileData?.userName} doubleClickEvent={() => doubleClickEvent()}/>
                        </div>
                      ) : currPost?.contentType === Consts.Tweet ?
                            <TweetContent text={currPost?.contentURL} doubleClickEvent={() => doubleClickEvent()}/>
                        : (currPost?.contentType === Consts.Poll && currPost?.pollData && Object.keys(currPost?.pollData).length > 0) ?
                            <PollContent pollData={currPost?.pollData} postId={currPost?.id} postOwnerId={currPost?.postOwnerId} uid={uid} handleVoting={handleVoting}/>
                        : (currPost?.contentType === Consts.YoutubeVid && currPost.youtubeData && Object.keys(currPost.youtubeData).length > 0) ?
                            <YoutubeContent youtubeData={currPost.youtubeData} autoPlay={true} />
                      : null}
                    </div>
                    <div className="desktop--right desktop-only">
                      <div className="post--card--header flex-row">
                        <header className="post--header--avatar flex-row">
                          <Avatar
                            loading="lazy"
                            className="post__header__avatar"
                            src={usersProfileData?.userAvatarUrl}
                            alt={usersProfileData?.userName}
                          />
                          <div
                            className="post--header--user--info flex-column"
                            onClick={() => directTo()}
                          >
                            <span
                              tabIndex="0"
                              aria-disabled="false"
                              role="button"
                              className="flex-row align-items-center"
                            >
                              <h5 className="flex-row trim__txt align-items-center">
                                <TruncateMarkup line={1} ellipsis="...">
                                  {trimText(usersProfileData?.userName,15)}
                                </TruncateMarkup>
                                <span>
                                {isVerified && (<GoVerified className="verified_icon" />)}
                                {(usersProfileData?.uid !== receivedData?.uid) && <FollowUnfollowBtn shape="tertiary" userData={{userId: usersProfileData?.uid, uName: usersProfileData?.userName, uAvatarUrl: usersProfileData?.userAvatarUrl, isVerified: usersProfileData?.isVerified}} />}
                              </span>
                              </h5>
                            </span>
                            <span tabIndex="0" aria-disabled="false" role="button" aria-label="View location">
                              <p style={{minHeight:"20px"}}>
                                <TruncateMarkup line={1} ellipsis="...">
                                  {currPost?.location}
                                </TruncateMarkup>
                              </p>
                            </span>
                          </div>
                        </header>
                        <span
                          className="post--header--options"
                          onClick={() =>
                            changeModalState("options", true)
                          }
                        >
                          <HiDotsHorizontal />
                        </span>
                      </div>

                      
                        <div className="post--comments--layout"> 
                          <div className="post--comment--item desktop--caption">
                                <div className="flex-row post--comment--row">
                                  <Avatar className="comment__user__avatar" loading="lazy" src={usersProfileData?.userAvatarUrl} alt={usersProfileData?.userName} />
                                      <span title={usersProfileData?.userName} className="post__top__comment">
                                        <h6  onClick={() => directTo()} className="comment__text mt-1"> <strong>{usersProfileData?.userName}</strong> 
                                          
                                        </h6>
                                        <Caption caption={currPost?.caption} isFullCaption={true} userName="" />
                                      </span>
                                </div>
                                <div className="post--comment--actions flex-row">
                                  <span><GetFormattedDate date={currPost?.date?.seconds} ago /></span>
                                </div>
                          </div>
                      
                        { 
                        !areCommentsDisabled ?
                        (currPost?.comments?.length >= 1 ? 
                        <div className="h-100 w-100">
                              {currPost?.comments?.map((comment, i) => {
                                return (
                                  <Comment
                                    key={i}
                                    comment={comment}
                                    handleLikingComments={handleLikingComments}
                                    postOwnerId={currPost?.postOwnerId}
                                    postId={currPost?.id}
                                    commentIndex={i}
                                    date={comment?.date}
                                    replayFunc={replayFunc}
                                    postIndex={currentPostIndex.index}
                                    myName={receivedData?.userName}
                                    likes={currPost?.likes}
                                    userAvatar={receivedData?.userAvatarUrl}
                                    uid={uid}
                                    contentType={currPost?.contentType}
                                    contentURL={currPost?.contentURL}
                                    changeModalState={changeModalState}
                                    deleteComment={onCommentDeletion}
                                  />
                                );
                              })}
                              <span ref={scrollToBottom}></span>
                          </div>
                          : null)
                          :
                          <span className="disabled__comments">
                            Comments are disabled.
                          </span>
                        }
                        </div>
                    

                      <div className="post--card--footer flex-column">
                        <div className="post--footer--upper--row flex-row">
                          <div className=" flex-row">
                            <LikePost isPostLiked={postLiked} handleCurrLikes={handleCurrLikes} isLiking={loadingState.liking}/>
                            { 
                              !areCommentsDisabled && 
                              <span onClick={() =>inputField && inputField?.current && inputField?.current?.focus()}>
                              <FaRegComment />
                            </span>
                            }
                            <span >
                              <FiSend />
                            </span>
                          </div>
                          <div className="bookmark__icon">
                          {
                          receivedData?.savedposts?.some(sp => (sp.postOwnerId === currPost?.postOwnerId && sp.id === currPost?.id)) ?
                          <RiBookmarkFill onClick={() => context.handleSavingPosts({boolean:false,data: {postOwnerId: currPost?.postOwnerId, id: currPost?.id, userName: currPost?.userName, contentName: currPost?.contentName, contentURL: currPost?.contentURL,contentType: currPost?.contentType, date: currPost?.date}})} />
                          :
                          <RiBookmarkLine onClick={() => context.handleSavingPosts({boolean:true,data: {postOwnerId: currPost?.postOwnerId, id: currPost?.id, userName: currPost?.userName, contentName: currPost?.contentName, contentURL: currPost?.contentURL,contentType: currPost?.contentType, date: currPost?.date}})}/>
                        }
                          </div>
                        </div>
                        {currPost?.likes?.people?.length >= 1 && compState?.alsoLiked?.length > 0 ?
                      <div className="people--also--liked flex-row">
                        <Avatar src={compState?.alsoLiked?.[0]?.receiverAvatarUrl} alt="people who also liked this feed"/>
                            <p onClick={() => changeModalState("users", true, (currPost?.likes?.people?.length > 0 ? currPost?.likes?.people : []), Consts.LIKES)}>Liked by
                              <span>
                                {
                                    compState?.alsoLiked?.map(el => <MutualLikes key={el?.receiverUid}item={el}/> )
                                }
                                {
                                  (currPost?.likes?.people?.some(el => el?.id === uid) ? currPost?.likes?.people?.length -1 : currPost?.likes?.people?.length ) > compState?.alsoLiked?.length && similarsStr > 0 &&
                                  <strong className="you--followed">
                                  {currPost?.likes?.people?.some(el => el?.id === uid) ? "" : " and"}<strong className="other__likers"> {similarsStr !== isNaN ? similarsStr : "many"} {similarsStr < 2 ? " person" : " others"}</strong>
                                  </strong>
                                }
                                {
                                  <strong className="you__followed">
                                    {currPost?.likes?.people?.some(el => el?.id === uid) && ", and you"}
                                  </strong>
                                }
                              </span>

                            </p>
                      </div>

                  : currPost?.likes?.people?.length >= 1 && compState?.alsoLiked?.length <= 0 ?(
                    <div
                      className="likes__count"
                      onClick={() => changeModalState("users", true, (currPost?.likes?.people?.length > 0 ? currPost?.likes?.people : []), Consts.LIKES)}
                    >
                      {currPost?.likes?.people?.length.toLocaleString()}{" "}
                      {currPost?.likes?.people?.length === 1 ? "like" : "likes"}
                    </div>
                  )  :  (currPost?.likes?.people?.length <= 0 && currPost?.postOwnerId !== currPost?.id) ?
                        <span className="like__invitation">Be the first to <strong onClick={() => handleCurrLikes(true)}>like this</strong> </span>
                    : null
                  }

                        <small className="post__date">
                          <GetFormattedDate date={currPost?.date?.seconds} /> • <time>{new Date(currPost?.date?.seconds * 1000).toDateString()}</time>
                        </small>
                        {
                          !areCommentsDisabled &&
                            <form
                              onSubmit={(e) => submitComment(e)}
                              className="post--bottom--comment--adding flex-row"
                            >
                              <div className="form--input--container flex-row">
                                  <div className="form--input--container--inner flex-row">
                                      <EmojiPicker onEmojiClick={onEmojiClick} />
                                      <input
                                        ref={inputField}
                                        value={compState.insertedComment}
                                        onChange={(event) =>
                                          setCompState({
                                            ...compState,
                                            insertedComment: event.target.value,
                                          })
                                        }
                                        className="post__bottom__input"
                                        type="text"
                                        placeholder="Add a commment.."
                                        spellCheck="true"
                                    />
                                  </div>
                              </div>
                              {
                                isSendingComment ?
                                <Loader
                                    className="post__bottom__button"
                                    type="TailSpin"
                                    color="#0095f6"
                                    arialLabel="loading-indicator"
                                    height={23}
                                    width={23}
                                  />
                                :
                                <button
                                  type="submit"
                                  disabled={compState.insertedComment.length < 1}
                                  className={
                                    compState.insertedComment.length >= 1
                                      ? "post__bottom__button"
                                      : "disabled post__bottom__button"
                                  }
                                >
                                Post
                              </button>
                              }

                            </form> 
                        }
                      </div>
                    </div>
                  </article>
                </div>
                {/* post end */}
              </article>
            </div>
            :
            <h1>Post is not available or might be got deleted.</h1>
        }
      </section>
    </Fragment>
  );
};
DesktopPost.propTypes = {
  browseUser: PropTypes.func.isRequired,
  disableArrows: PropTypes.bool,
  changeModalState: PropTypes.func.isRequired
};
const mapDispatchToProps = dispatch => {
  return {
      changeModalState: (modalType, hasDataList, usersList, usersType) => dispatch({type: actionTypes.CHANGE_MODAL_STATE, payload: {modalType, hasDataList, usersList, usersType}})
  }
}
const mapStateToProps = state => {
  return {
      modalsState: state[Consts.reducers.MODALS].modalsState
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(withBrowseUser(React.memo(DesktopPost)));
