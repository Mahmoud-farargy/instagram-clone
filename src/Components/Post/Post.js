import React, { Fragment, PureComponent, Suspense } from "react";
import "./Post.css";
import { HiDotsHorizontal } from "react-icons/hi";
import { Avatar } from "@material-ui/core";
import TruncateMarkup from "react-truncate";
import { FiSend } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { FaRegComment , FaRegCommentDots} from "react-icons/fa";
import { RiBookmarkLine, RiBookmarkFill } from "react-icons/ri";
import CommentsList from "./Comments/Comments";
import { updateObject } from "../../Utilities/Utility";
import OptionsModal from "../Generic/OptionsModal/OptionsModal";
import * as Consts from "../../Utilities/Consts";
import GetFormattedDate from "../../Utilities/FormatDate";
import ScrollTrigger from 'react-scroll-trigger';
import Caption from "../Generic/Caption/Caption";
import { insertIntoText } from "../../Utilities/InsertIntoText";
import AudioContent from "../AudioContent/AudioContent";
import NewMsgModal from "../NewMsgModal/NewMsgModal";
import MutualLikes from "../../Pages/UsersProfile/MutualFriendsList/MutualFriendsItem";
import {AppContext} from "../../Context";
import VideoPostComp from "../VideoPost/VideoPost";
import TweetContent from "../TweetContent/TweetContent";
import { retry } from "../../Utilities/RetryImport";
import PollContent from "../PollContent/PollContent";
import YoutubeContent from "../YoutubeContent/YoutubeContent";
import PostUserName from "../Generic/PostUserName/PostUserName";
import LikePost from "../Generic/LikePost/LikePost";
import FollowUnfollowBtn from "../FollowUnfollowBtn/FollowUnfollowBtn";
const EmojiPicker = React.lazy(() => retry(() => import("../Generic/EmojiPicker/EmojiPicker")));

class Post extends PureComponent {
  constructor(props) {
    super(props);
    this.inputField = React.createRef();
    this.videoPost = React.createRef();
    this.timeouts = React.createRef();
    this.isVidBuffering = true;
    this.state = {
      insertedComment: "",
      btnClicks: 0,
      doubleLikeClicked: false,
      showInputForm: false,
      replayData: {},
      openOptionsModal: false,
      openNewMsgModal: false,
      isVidLoaded: false,
      isVideoPlaying: false,
      isPostLoading: false,
      isPostingComment: false,
      alsoLiked: [],
      preLoad: (this.props.contentType === Consts.Video && this.props.index === 0) ? "metadata" : "none"
    };
    this._isMounted = true;
    this.similarsStr = (this.props.likes?.people?.some(el => el?.id === this.props.id) && this.props.likes?.people?.length >3) ? (this.props.likes?.people?.length?.toLocaleString() -3) : (this.props.likes?.people?.length?.toLocaleString() -2);
    this.updateUsersWhoLiked = this.updateUsersWhoLiked.bind(this);
    this.handleCurrLikes = this.handleCurrLikes.bind(this);
    this.openPost = this.openPost.bind(this);
    this.doubleClickEvent = this.doubleClickEvent.bind(this);
    this.submitComment = this.submitComment.bind(this);
    this.replayFunc = this.replayFunc.bind(this);
    this.onCommentBtnClick = this.onCommentBtnClick.bind(this);
    this.onEmojiClick = this.onEmojiClick.bind(this);
    this.closeAllModals = this.closeAllModals.bind(this);
    this.updateLikesNComments = this.updateLikesNComments.bind(this);
  }
  static contextType = AppContext;
  updateUsersWhoLiked(){
    const { likes } = this.props;
    var {  following } = this.props;
    this.setState({
      ...this.state,
      alsoLiked: following?.filter(user => likes?.people?.some((el) => (user?.receiverUid !== this.context.receivedData?.uid) && (user?.receiverUid === el?.id))).slice(0,2)
    })
  }
  componentDidMount() {
      this.updateUsersWhoLiked();
  }
  componentWillUnmount(){
    this.isVidBuffering = false;
    this.videoPost = false;
    this.inputField = false;
    window.clearTimeout(this.timeouts?.current);
    this._isMounted = false;
  }
  componentDidUpdate(prevProps) {
    if((prevProps.following !== this.props.following) || (prevProps.likes !== this.props.likes)){
       this.updateUsersWhoLiked();
    }
  }
  handlePostLoading = (loadState) => {
    typeof loadState === "boolean" && this.setState({...this.state, isPostLoading: loadState, ...(!loadState && this.state.isPostingComment) && { isPostingComment: false }});
  }
  handleCurrLikes(boolean){
    const { postId, handlePeopleLikes, postOwnerId , myName,myAvatar,id, contentURL,contentType } = this.props;
    (postOwnerId !== id) && this.handlePostLoading(true);
    handlePeopleLikes(boolean, postId, postOwnerId, myName, myAvatar, id, contentURL, contentType).then(() => {
      if(this._isMounted){
        this.updateLikesNComments({uid: postOwnerId, postID: postId});
      }
    }).catch(() => {
      if(this._isMounted){
        this.handlePostLoading(false);
        const { notify} = this.context;
        notify("Error has occurred. Please try again later","error");
      }
    });
  };
  // const update 
  openPost(postId){
    const { changeMainState, receivedData, notify, postOwnerId,id, getUsersProfile} = this.context;
    const { changeModalState } = this.props;
    if(postOwnerId === id && postId){
        getUsersProfile(receivedData?.uid).then((data) => {
          if(this._isMounted){
            const postsCopy = data?.posts;
            const postIndex = postsCopy?.map(post => post?.id).indexOf(postId);
            if(postIndex !== -1){
                changeMainState("currentPostIndex", { index:postIndex, id: postId });
                if((window.innerWidth || document.documentElement.clientWidth) >= 670){
                  this.props.history.push("/profile");
                  this.timeouts.current = setTimeout(() => {
                      changeModalState("post", true);
                      window.clearTimeout(this.timeouts?.current);
                  }, 350);
                }else{
                    this.props.history.push("/browse-post");
                }
            }else{
                notify("An error occurred", "error");
            } 
          }
      });
    }

  };
  doubleClickEvent(){
    let currCount = this.state.btnClicks;
    this.setState((prevState) => ({
      btnClicks: prevState.btnClicks + 1,
    }));
    const resetCounter = () => {
      this.setState({
        btnClicks: 0,
      });
    };
    if (currCount === 1) {
      this.handleCurrLikes(true);
      resetCounter();
      this.setState({
        doubleLikeClicked: true,
      });
      this.timeouts.current = setTimeout(() => {
        this.setState({
          doubleLikeClicked: false,
        });
        window.clearTimeout(this.timeouts?.current);
      }, 1000);
    }
    this.timeouts.current = setTimeout(() => {
      if(this._isMounted){
        resetCounter();
        window.clearTimeout(this.timeouts?.current);
      }
    }, 500);
  };
  resetCommentForm(){
    this.setState({
      insertedComment: "",
      replayData: {},
      ...(this.state.isPostLoading) && {isPostLoading: false},
      ...(this.state.isPostingComment) && {isPostingComment: false}
    });
  }
  submitComment(v) {
    v.preventDefault();
    const {
      id,
      myName,
      myAvatar,
      handleSubmittingComments,
      postId,
      postOwnerId,
      handleSubComments,
      contentURL,
      contentType
    } = this.props;
    if (this.state.insertedComment !== "") {
      this.setState({
        ...this.state,
        ...(postOwnerId !== id) && {isPostLoading: true},
        isPostingComment: true
      });
      this.handlePostLoading(true);
            //sub comment (nested comment)
        if (
          this.state.replayData &&
            Object.keys(this.state.replayData) &&
            /^[@]/.test(this.state.insertedComment)
        ) {

          handleSubComments(
                this.state.replayData,
                this.state.insertedComment,
                myAvatar,
                postOwnerId === id,
                contentURL,
                contentType
          ).then(() => {
            if(this._isMounted){
              this.updateLikesNComments({uid: postOwnerId, postID: postId});
              this.resetCommentForm();
            }
          }).catch(() => {
            if(this._isMounted){
              this.handlePostLoading(false);
            }
          })
        } else {   //regular comment
            handleSubmittingComments(
              id,
              myName,
              this.state.insertedComment,
              myAvatar,
              postId,
              postOwnerId,
              contentURL,
              contentType
            ).then(() => {
              if(this._isMounted){
                this.updateLikesNComments({uid: postOwnerId, postID: postId});
                this.resetCommentForm();
              }
            }).catch(() => {
              if(this._isMounted){
                this.handlePostLoading(false);
              }
            });
        }
  }
  }

  replayFunc(postOwnerName, commentIndex, postIndex, postId, postOwnerId, senderUid, commentId) {
    this.setState({
      ...this.state,
      showInputForm: true,
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
    if (this.state.showInputForm) {
      this.inputField.current.focus();
    }
  }

  onCommentBtnClick() {
    const {areCommentsDisabled, disableComments} = this.props;
    (!areCommentsDisabled && !disableComments) && this.setState(
      updateObject(this.state, { showInputForm: !this.state.showInputForm })
    );

   const tOut = setTimeout(() => {
      if (this.state.showInputForm) {
        this.inputField &&
          this.inputField.current &&
          this.inputField.current.focus();
      }
      window.clearTimeout(tOut);
    }, 150);
  }
  handleVideoPlaying(type){
    ( this.state.preLoad === "none" && type.toLowerCase() === "on-view") && this.setState({...this.state, preLoad: "metadata"});
    if(this.videoPost && this.state.isVidLoaded && this.videoPost?.current && this.state.preLoad === "metadata"){
        if(type.toLowerCase() === "on-view" && !this.state.isVideoPlaying && typeof this.videoPost.current?.play === "function"){
          this.setState({...this.state, isVideoPlaying: true});
        }else if(type.toLowerCase() === "out-of-view" && this.state.isVideoPlaying){
          this.setState({...this.state, isVideoPlaying: false });
        }
    }
  }
  onEmojiClick(e, x){
    e.persist();
    if(this.inputField && this.inputField?.current && typeof this.inputField?.current.blur !== undefined){
        this.inputField.current.blur();
    }
    this.setState({
      ...this.state,
      insertedComment: insertIntoText( this.state.insertedComment,x.emoji)
    });
  }
  closeAllModals(){
    this.setState({...this.state, openOptionsModal: false, openNewMsgModal: false });
  }
  delPost () {
      const {postId, index, contentName, contentURL, postOwnerId, id, deletePost, changeModalState} = this.props;
      if(postOwnerId === id){
          deletePost( postId, index, contentName, contentURL ).then(() => {
            if(this._isMounted){
              changeModalState("comments", false);
            }
          });
          this.setState({...this.state, openOptionsModal:false})
      }else{
        this.context.notify("This post is not yours to delete.","error");
      }
  }
  updateLikesNComments({uid, postID}){
    if(uid && postID && (uid !== this.props.id)){
          this.props.updateSuggestionsList().then(() => this._isMounted && this.handlePostLoading(false)).catch(() => this._isMounted && this.handlePostLoading(false));
    }else{
      this.handlePostLoading(false);
    }
  }

  render() {
    const {
      userName,
      comments,
      pollData,
      caption,
      contentType,
      likes,
      contentURL,
      contentName,
      location,
      postDate,
      handleLikingComments,
      postOwnerId,
      isVerified,
      myName,
      userAvatar,
      id,
      changeModalState,
      onCommentDeletion,
      index,
      postId,
      handleSavingPosts,
      savedPosts,
      youtubeData,
      songInfo,
      areCommentsDisabled,
      disableComments,
      loadingState
    } = this.props;
    const { openNewMsgModal, isPostLoading, doubleLikeClicked } = this.state;
    return (
      <Fragment>
        
          {
            openNewMsgModal &&
              <NewMsgModal closeModal={this.closeAllModals} sendPostForm={{postOwnerId, userAvatar ,userName, caption, contentType, contentURL, location, postId, isVerified}} />
          }
        <div id="post" className="post--card--container">
          {isPostLoading && <div id="postLoading"><span></span></div>}
          <article className="post--card--article">
            <div className="post--card--header flex-row">
              <header className="post--header--avatar flex-row">
                <Avatar
                  loading="lazy"
                  className="post__header__avatar"
                  src={userAvatar}
                  alt={userName}
                />
                <div className="post--header--user--info flex-column">
                  <PostUserName changeModalState= {changeModalState} isVerified={isVerified && (postOwnerId === id)} postOwnerId={postOwnerId} userName={userName} />
                  <span tabIndex="0" aria-disabled="false" role="button" aria-label="View location">
                    <p>
                      <TruncateMarkup line={1} ellipsis="...">
                        {location}
                      </TruncateMarkup>
                    </p>
                  </span>
                </div>
              </header>
              <span
                className="post--header--options"
                onClick={() => this.setState({openOptionsModal: true})}
              >
                <HiDotsHorizontal />
              </span>
            </div>
            <div className="post--card--body">
              <div className="post__card__content__outer" >
              {contentType === Consts.Image ? (
                
                  <div className="post__card__content__middle" role="button" tabIndex="-1" onClick={() => this.doubleClickEvent()}>
                    <img
                      loading="lazy"
                      className="post__card__content"
                      src={contentURL}
                      alt={`Shared by ${userName} on ${new Date(postDate?.seconds * 1000).toDateString()}`}
                      draggable="false"
                      decoding="auto"
                    />
                    {doubleLikeClicked ? (
                      <div>
                        <div className="liked__double__click__layout"></div>
                        <div className="liked__double__click">
                          <span
                            style={{
                              animation: doubleLikeClicked
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
                  <ScrollTrigger className="post__card__content__video" onEnter={() => this.handleVideoPlaying("on-view")} onExit={() => this.handleVideoPlaying("out-of-view")} >
                  <VideoPostComp
                      ref={this.videoPost}
                      src={contentURL}
                      isMuted={true}
                      preload={this.state.preLoad}
                      isVidPlaying={ this.state.isVideoPlaying}
                      whenLoadedData={()=> this.setState( { ...this.state, isVidLoaded: true })}
                      whenCanPlay={() => this.isVidBuffering = false} />
                  </ScrollTrigger>
                </div>
              ) : contentType === Consts.Audio ? (
                    <AudioContent url={contentURL} songInfo={songInfo || {}} userName={userName} doubleClickEvent={() => this.doubleClickEvent()} />
              ): contentType === Consts.Tweet ? 
                    <TweetContent text={contentURL} doubleClickEvent={() => this.doubleClickEvent()}/>
              : (contentType === Consts.Poll && pollData && Object.keys(pollData).length > 0) ?
                    <PollContent pollData={pollData} postId={postId} postOwnerId={postOwnerId} uid={id} handleVoting={this.context.handleVoting} handlePostLoading={this.handlePostLoading} updateLikesNComments={this.updateLikesNComments}/>
              : (contentType === Consts.YoutubeVid && youtubeData && Object.keys(youtubeData).length > 0) ?
                    <YoutubeContent youtubeData={youtubeData} />
              : null
            }
              </div>
          </div>
            <div className="post--card--footer flex-column">
              <div className="post--footer--upper--row flex-row">
                <div className="flex-row">
                  <LikePost isPostLiked={likes?.people?.some((el) => el.id === id)} handleCurrLikes={this.handleCurrLikes} isLiking={loadingState.liking}/>
                 {
                   (!areCommentsDisabled && !disableComments) &&
                    <span data-cy="comment" onClick={() => this.onCommentBtnClick()}>
                    {
                      this.state.showInputForm ?
                      <FaRegCommentDots />
                      :
                      <FaRegComment />
                    } 
                    </span>
                 } 
                  <span>
                    <FiSend onClick={() => this.setState({...this.state, openNewMsgModal: true})} />
                  </span>
                </div>
                <div className="bookmark__icon">
                  {
                    savedPosts?.some(sp => (sp.postOwnerId === postOwnerId && sp.id === postId)) ?
                    <RiBookmarkFill onClick={() => handleSavingPosts({boolean:false,data: {postOwnerId, id: postId, userName, contentName, contentURL,contentType, postDate}})} />
                    :
                    <RiBookmarkLine onClick={() => handleSavingPosts({boolean:true,data: {postOwnerId, id: postId, userName, contentName, contentURL,contentType, postDate}})} />
                  }
                </div>
              </div>
              {likes?.people?.length >= 1 && this.state.alsoLiked?.length > 0 ?
                  <div className="people--also--liked flex-row">
                    <Avatar src={this.state.alsoLiked?.[0]?.receiverAvatarUrl} alt="people who also liked this feed"/>
                        <p className="flex-row" onClick={() => changeModalState("users", true, (likes?.people?.length > 0 ? likes?.people : []), Consts.LIKES)}>Liked by
                          <span className="flex-row">
                            {
                                  this.state.alsoLiked?.map(el => <MutualLikes key={el?.receiverUid}item={el}/> )
                            }
                            {
                              (likes?.people?.some(el => el?.id === id) ? likes?.people?.length -1 : likes?.people?.length ) > this.state.alsoLiked?.length && this.similarsStr > 0 &&
                              <strong className="you--followed">
                              {likes?.people?.some(el => el?.id === id) ? "" : " and"}<strong className="other__likers"> {this.similarsStr !== isNaN ? this.similarsStr : "many"} {this.similarsStr < 2 ? " person" : " others"}</strong>
                              </strong>
                            }
                            {
                              <strong className="you__followed">
                                 {likes?.people?.some(el => el?.id === id) && ", and you"}
                              </strong>
                            }
                          </span>

                        </p>
                  </div>

              : likes?.people?.length >= 1 && this.state.alsoLiked?.length <= 0 ?(
                <div
                  className="likes__count"
                  onClick={() => changeModalState("users", true, (likes?.people?.length > 0 ? likes?.people : []), Consts.LIKES)}
                >
                  {likes?.people?.length.toLocaleString()}{" "}
                  {likes?.people?.length === 1 ? "like" : "likes"}
                </div>
              )  :  (likes?.people?.length <= 0 && postOwnerId !== id) ?
                    <span className="like__invitation">Be the first to <strong onClick={() => this.handleCurrLikes(true)}>like this</strong> </span>
                : null
              }
              <Caption caption={caption} userName={userName}  />
              <CommentsList
                areCommentsDisabled={(areCommentsDisabled || disableComments)}
                handleLikingComments={handleLikingComments}
                comments={comments}
                postOwnerId={postOwnerId}
                onCommentDeletion={onCommentDeletion}
                contentType={contentType}
                likes={likes}
                userAvatar={userAvatar}
                userId={id}
                updateHomePost={this.updateLikesNComments}
                handleHomePostLoading={this.handlePostLoading}
                myName={myName}
                changeModalState={changeModalState}
                contentURL={contentURL}
                postIndex={index}
                postId={postId} 
                replayFunc={this.replayFunc}
              />

              <small className="post__date pb-2 ">
                <GetFormattedDate date={postDate?.seconds} /> • <time>{new Date(postDate?.seconds * 1000).toDateString()}</time>
              </small>
              {(this.state.showInputForm && !areCommentsDisabled && !disableComments) && (
                <form
                  onSubmit={(e) => this.submitComment(e)}
                  className="post--bottom--comment--adding flex-row"
                  method="post"
                >
                 <div className="form--input--container w-100 flex-row">
                    <div className="form--input--container--inner flex-row">
                      <Suspense fallback={<div><div className="global__loading"><span className="global__loading__inner"></span></div></div>}>
                         <EmojiPicker onEmojiClick={this.onEmojiClick} />
                      </Suspense>
                      <input
                        ref={this.inputField}
                        value={this.state.insertedComment}
                        onChange={(event) =>
                          this.setState({ insertedComment: event.target.value })
                        }
                        className="post__bottom__input"
                        type="text"
                        placeholder="Add a commment.."
                        aria-label="Add a commment.."
                        autoComplete="off"
                        spellCheck="true"
                        name="add-comment"
                      />
                    </div>
                 </div>
                  <button
                    type="submit"
                    disabled={(this.state.insertedComment.length < 1 || this.state.isPostingComment)}
                    className={
                      (this.state.insertedComment.length >= 1 || this.state.isPostingComment)
                        ? "post__bottom__button"
                        : "disabled post__bottom__button"
                    }
                  >
                    Post
                  </button>
                </form>
              )}
            </div>
          </article>
        {/* Modals */}
          {this.state.openOptionsModal && (
            <OptionsModal>
             { postOwnerId === id ?
              <>  
                <span className="text-danger font-weight-bold"
                    onClick={() => this.delPost()}
                  >
                    {" "}
                    Delete post
                  </span>
                  
                  <span
                    onClick={() => this.openPost(postId)} >
                    Go to post
                  </span>
                </>
                :
                <FollowUnfollowBtn shape="quaternary" userData={{userId: postOwnerId, uName: userName, uAvatarUrl: userAvatar, isVerified: isVerified}} />
              }
              <span onClick={() => this.setState({openOptionsModal:false})}>
                {" "}
                Cancel
              </span>
             

            </OptionsModal>
          )}
          <div
            style={{
              display: (this.state.openOptionsModal || this.state.openNewMsgModal) ? "block" : "none",
              transition: "all 0.5s ease",
            }}
            className="backdrop"
            onClick={() => this.closeAllModals()}
          ></div>
        </div>
      </Fragment>
    );
  }
}
export default Post;
