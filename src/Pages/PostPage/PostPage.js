import React, { Fragment, useState, useContext , useEffect, useRef, lazy, memo} from "react";
import "../../Components/Post/Post.css";
import { HiDotsHorizontal } from "react-icons/hi";
import { Avatar } from "@material-ui/core";
import TruncateMarkup from "react-truncate";
import { FiSend } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa";
import { RiBookmarkLine, RiBookmarkFill } from "react-icons/ri";
import { AppContext } from "../../Context";
import Comment from "../../Components/Comment/Comment";
import { withRouter } from "react-router-dom";
import OptionsModal from "../../Components/Generic/OptionsModal/OptionsModal";
import GetFormattedDate from "../../Utilities/FormatDate";
import Caption from "../../Components/Generic/Caption/Caption";
import { insertIntoText } from "../../Utilities/InsertIntoText";
import AudioContent from "../../Components/AudioContent/AudioContent";
import * as Consts from "../../Utilities/Consts";
import MutualLikes from "../../Pages/UsersProfile/MutualFriendsList/MutualFriendsItem";
import FollowUnfollowBtn from "../../Components/FollowUnfollowBtn/FollowUnfollowBtn";
import VideoPostComp from "../../Components/VideoPost/VideoPost";
import TweetContent from "../../Components/TweetContent/TweetContent";
import PollContent from "../../Components/PollContent/PollContent";
import PostUserName from "../../Components/Generic/PostUserName/PostUserName";
import YoutubeContent from "../../Components/YoutubeContent/YoutubeContent";
import LikePost from "../../Components/Generic/LikePost/LikePost";
import Loader from "react-loader-spinner";
import { retry } from "../../Utilities/RetryImport";
import { connect } from "react-redux";
import * as actionTypes from "../../Store/actions/actions";

const EmojiPicker = lazy(() => retry(() => import("../../Components/Generic/EmojiPicker/EmojiPicker")));

const PostPage  = (props) => {
  const { changeModalState, modalsState, history } = props;
  const context = useContext(AppContext);
  const { changeMainState, usersProfileData, currentPostIndex, uid,handlePeopleLikes, receivedData, handleSubmittingComments, handleSubComments, handleUserBlocking, handleVoting, handleLikingComments, onCommentDeletion, deletePost, handleSavingPosts, loadingState } = context;
  const [isSendingComment, setSendingComment] = useState(false);
  const [compState, setCompState] = useState({
        postLiked: false,
        insertedComment: "",
        btnClicks: 0,
        doubleLikeClicked: false,
        replayData: {},
        alsoLiked: []
  });
  //====================== 
  // REFS
  const _isMounted = useRef(true);
  const inputField = useRef(null);
  const autoScroll = useRef(null);
  const timeouts = useRef(null);
  const vidRef = useRef(null);
  const scrollToBottom = useRef(null);
  //----------------------
  useEffect(() => {
    changeMainState("currentPage", "Post");
    return () => {
      window.clearTimeout(timeouts?.current);
      _isMounted.current = false;
    }
  }, []);

  const likesCheck = () => {
    if (usersProfileData?.posts) {//checks whether the user's post is liked or not
      var { likes } = usersProfileData?.posts[currentPostIndex?.index];
      return likes.people?.some(el => el.id === uid);
    }
  }
  const handleCurrLikes = (boolean) => {

    let postsData = usersProfileData?.posts;
    if (postsData) {
      const {
        postOwnerId,
        contentURL,
        contentType,
        id
      } = postsData[currentPostIndex?.index];
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
    }
  };
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
        setCompState({
          ...compState,
          doubleLikeClicked: false,
        });
        window.clearTimeout(timeouts?.current);
      }, 1100);
    }
    timeouts.current = setTimeout(() => {
      resetCounter();
      window.clearTimeout(timeouts?.current);
    }, 1000);
  };
  const submitComment = (v) => {
    v.preventDefault();

    let postsData = usersProfileData?.posts;
    if (postsData) {
      const { id, postOwnerId, contentURL, contentType } = postsData[
        currentPostIndex?.index
      ];
      if (compState.insertedComment !== "") {
        setSendingComment(true);
        //subcomment
        if ( compState.replayData &&
         Object.keys(compState.replayData).length >0 &&
          /^[@]/.test(compState.insertedComment)
        ) {
          handleSubComments(
            compState.replayData,
            compState.insertedComment,
            receivedData?.userAvatarUrl,
            false,
            contentURL,
            contentType
          ).then(() => {
            _isMounted.current && setSendingComment(false);
          }).catch(() =>{
            _isMounted.current && setSendingComment(false);
          });
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
            _isMounted.current && setSendingComment(false);
          }).catch(() => {
            _isMounted.current && setSendingComment(false);
          });
        }
        setCompState({
          ...compState,
          insertedComment: "",
          replayData: {},
        });
      }
      if(autoScroll?.current &&  autoScroll.current.scrollIntoView()){
        autoScroll.current.scrollIntoView();
      }
    }
  }
  const replayFunc = (postOwnerName, commentIndex, postIndex, postId, postOwnerId, senderUid, commentId) => {
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
  }
  const blockUser = (blockedUid, userName, userAvatarUrl, profileName) => {
    handleUserBlocking(true, blockedUid, userName, userAvatarUrl, profileName).then(() => _isMounted?.current && props.history.push("/"));
  }
  const onEmojiClick = (e, x) => {
    e.persist();
    if(inputField && inputField?.current?.blur()){
      inputField.current.blur();
    }
    setCompState({
      ...compState,
      insertedComment: insertIntoText(compState?.insertedComment, x.emoji)
    })
  }

    var {caption = "",contentType,contentURL = "",comments = [],likes= {},location = "",date = {},postOwnerId = "", id = "", pollData = {}, youtubeData = {},userName, contentName="", songInfo = {}, disableComments = false } = usersProfileData?.posts[currentPostIndex?.index];       
    var isVerified = usersProfileData?.isVerified;
    var following = receivedData?.following;
    const updateUsersWhoLiked = () => {
      setCompState({
        ...compState,
        alsoLiked: following?.filter(user => likes?.people?.some((el) => (user?.receiverUid !== receivedData?.uid) && (user?.receiverUid === el?.id))).slice(0,3)
      })
    }
    useEffect(()=> {
      updateUsersWhoLiked();
    },[following, likes]);
    useEffect(() => {
      (scrollToBottom && scrollToBottom.current && scrollToBottom.current?.scrollIntoView) && scrollToBottom.current.scrollIntoView({block: "end"});
    },[comments?.length]);
    const similarsStr = (likes?.people?.some(el => el?.id === uid) && likes?.people?.length >3) ? (likes?.people?.length?.toLocaleString() -3) : (likes?.people?.length?.toLocaleString() -2);
    const areCommentsDisabled = (usersProfileData?.profileInfo?.professionalAcc?.disableComments || disableComments);
    const deleteCurrentPost = () => {
      deletePost( id, currentPostIndex?.index, contentName, contentURL ).then(() => {
        if(_isMounted.current){
          changeModalState("comments", false);
          history.push("/");
        }
      });
    }
    return (
      <Fragment>
        {
          modalsState?.options &&
          (<OptionsModal>
            <div>
                {
                    usersProfileData?.uid === uid ?
                    <span className="text-danger font-weight-bold" onClick={() => deleteCurrentPost()}>
                            Delete post
                    </span>
                    :
                  <div>
                      <span className="text-danger font-weight-bold"
                      onClick={() => blockUser(usersProfileData?.uid, usersProfileData?.userName, usersProfileData?.userAvatarUrl, usersProfileData?.profileInfo && usersProfileData.profileInfo?.name ? usersProfileData?.profileInfo?.name : "" )} >
                      {" "}
                      Block this user
                    </span>
                    <span>
                      <FollowUnfollowBtn shape="quaternary" userData={{userId: usersProfileData?.uid, uName: usersProfileData?.userName, uAvatarUrl: usersProfileData?.userAvatarUrl, isVerified: usersProfileData?.isVerified}} />
                    </span>
                    
                </div>
              
              }
              <span> Cancel </span>
            </div>
            

           
          </OptionsModal>)
        }
        {usersProfileData?.posts ? (
          <div id="post" className="post--card--container mobile--post post--page">
            <article className="desktop-comp post--card--article">
              <div className="post--card--header flex-row">
                <header className="post--header--avatar flex-row">
                  <Avatar
                    loading="lazy"
                    className="post__header__avatar"
                    src={usersProfileData?.userAvatarUrl}
                    alt={usersProfileData?.userName}
                  />
                  <div
                    className="post--header--user--info flex-column">
                    <PostUserName changeModalState= {changeModalState} isVerified={isVerified} postOwnerId={usersProfileData?.uid} userName={usersProfileData?.userName} />
                    <span tabIndex="0" aria-disabled="false" role="button" aria-label="View location">
                      <p>
                        <TruncateMarkup line={1} ellipsis="...">
                          {location}
                        </TruncateMarkup>
                      </p>
                    </span>
                  </div>
                </header>
                <span className="post--header--options" onClick={() => changeModalState("options", true)}>
                  <HiDotsHorizontal />
                </span>
              </div>
              <div className="post--card--body">
                <div className="post__card__content__outer" >
                {contentType === Consts.Image ? (
                  <div className="post__card__content__middle" role="button" tabIndex="1" onClick={() => doubleClickEvent()}>
                    <img
                      loading="lazy"
                      className="post__card__content"
                      src={contentURL}
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
                ) : contentType === Consts.Video ? (
                  <div className="post__card__content__middle" >
                    <div className="post__card__content__video">
                      <VideoPostComp
                      src={contentURL}
                      isVidPlaying={true}
                      ref={vidRef}
                      isMuted={true}
                       /> 
                    </div>
                  </div>
                ) : contentType === Consts.Audio ? (
                  <AudioContent autoPlay url={contentURL} songInfo={songInfo || {}} userName={usersProfileData?.userName} doubleClickEvent={() => doubleClickEvent()} />
                ): 
                  contentType === Consts.Tweet ?
                  <TweetContent text={contentURL} doubleClickEvent={() => doubleClickEvent()}/>
                : 
                (contentType === Consts.Poll && pollData && Object.keys(pollData).length > 0) ?
                  <PollContent pollData={pollData} postId={id} postOwnerId={postOwnerId} uid={uid} handleVoting={handleVoting}/>
                :
                (contentType === Consts.YoutubeVid && youtubeData && Object.keys(youtubeData).length > 0) ?
                <YoutubeContent youtubeData={youtubeData} autoPlay={true} />
                : null
              }
                </div>
              </div>
              <div className="post--card--footer flex-column">
                <div className="post--footer--upper--row flex-row">
                  <div className=" flex-row">
                    <LikePost isPostLiked={likesCheck()} handleCurrLikes={handleCurrLikes} isLiking={loadingState.liking}/>
                   {
                     !areCommentsDisabled &&
                      <span onClick={() => inputField?.current && inputField.current?.focus()}>
                        <FaRegComment />
                      </span>
                   } 
                    <span>
                      <FiSend />
                    </span>
                  </div>
                  <div className="bookmark__icon">
                    {
                      receivedData?.savedposts?.some(sp => (sp.postOwnerId === postOwnerId && sp.id === id)) ?
                      <RiBookmarkFill onClick={() => handleSavingPosts({boolean:false,data: {postOwnerId, id, userName, contentName, contentURL,contentType, date}})} />
                      :
                      <RiBookmarkLine onClick={() =>handleSavingPosts({boolean:true,data: {postOwnerId, id, userName, contentName, contentURL,contentType, date}})}/>
                    }                    
                  </div>
                </div>
                {likes?.people?.length >= 1 && compState?.alsoLiked?.length > 0 ?
                  <div className="people--also--liked flex-row">
                    <Avatar src={compState?.alsoLiked?.[0]?.receiverAvatarUrl} alt="people who also liked this feed"/>
                        <p className="flex-row" onClick={() => changeModalState("users", true, (likes?.people?.length > 0 ? likes?.people : []), Consts.LIKES)}>Liked by
                          <span className="flex-row">
                            {
                                compState?.alsoLiked?.map(el => <MutualLikes key={el?.receiverUid}item={el}/> )
                            }
                            {
                              (likes?.people?.some(el => el?.id === uid) ? likes?.people?.length -1 : likes?.people?.length ) > compState?.alsoLiked?.length && similarsStr > 0 &&
                              <strong className="you--followed">
                              {likes?.people?.some(el => el?.id === uid) ? "" : " and"}<strong className="other__likers"> {similarsStr !== isNaN ? similarsStr : "many"} {similarsStr < 2 ? " person" : " others"}</strong>
                              </strong>
                            }
                            {
                              <strong className="you__followed">
                                 {likes?.people?.some(el => el?.id === uid) && ", and you"}
                              </strong>
                            }
                          </span>

                        </p>
                  </div>
              : likes?.people?.length >= 1 && compState?.alsoLiked?.length <= 0 ?(
                <div
                  className="likes__count"
                  onClick={() => changeModalState("users", true, (likes?.people?.length > 0 ? likes?.people : []), Consts.LIKES)}
                >
                  {likes?.people?.length.toLocaleString()}{" "}
                  {likes?.people?.length === 1 ? "like" : "likes"}
                </div>
              )  :  (likes?.people?.length <= 0 && postOwnerId !== id) ?
                    <span className="like__invitation">Be the first to <strong onClick={() => handleCurrLikes(true)}>like this</strong> </span>
                : null
              }
                <Caption caption={caption} userName={usersProfileData?.userName}/>

                {
                !areCommentsDisabled ?
                (comments?.length >= 1 ? (
                  <div className="post--comments--layout" ref={autoScroll}>
                    {comments?.length > 2 ? (
                      <h5
                        className="post__comments__count"
                        onClick={() => changeModalState("comments", true)}
                      >
                        View all {comments.length.toLocaleString()} comments
                      </h5>
                    ) : (
                      <h5 className="post__comments__count">Comments</h5>
                    )}
                    {comments?.slice(0, 3).map((comment, i) => {
                      return (
                        <Comment
                          key={i}
                          comment={comment}
                          handleLikingComments={handleLikingComments}
                          postOwnerId={postOwnerId}
                          commentIndex={i}
                          date={comment?.date}
                          replayFunc={replayFunc}
                          postIndex={currentPostIndex.index}
                          postId={usersProfileData?.posts[currentPostIndex?.index]?.id || ""}
                          myName={receivedData?.userName}
                          likes={likes}
                          userAvatar={receivedData?.userAvatarUrl}
                          uid={uid}
                          contentType={contentType}
                          contentURL={contentURL}
                          changeModalState={changeModalState}
                          deleteComment={onCommentDeletion}
                        />
                      );
                    })}
                    <span ref={scrollToBottom}></span>
                  </div>
                ) : null)
                  : <span className="disabled__comments">
                    Comments are disabled.
                  </span>
                }

                <small className="post__date">
                  <GetFormattedDate date={date?.seconds} /> • <time>{new Date(date?.seconds * 1000).toDateString()}</time>
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
                          setCompState({...compState, insertedComment: event.target.value })
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
                          className={`
                            mr-2
                            ${compState.insertedComment.length >= 1  ? "post__bottom__button" : "disabled post__bottom__button"}`}
                        >
                          Post
                        </button>
                    }

                  </form>
               } 
              </div>
            </article>
          </div>
        ) : (
          <h3>Sorry, page is not found.</h3>
        )}
      </Fragment>
    );
  
}
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
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(memo(PostPage)));
