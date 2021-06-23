import React, { Fragment, PureComponent, Suspense } from "react";
import "./Post.css";
import { HiDotsHorizontal } from "react-icons/hi";
import { Avatar } from "@material-ui/core";
import TruncateMarkup from "react-truncate";
import { FiHeart, FiSend } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { FaRegComment , FaRegCommentDots} from "react-icons/fa";
import { RiBookmarkLine, RiBookmarkFill } from "react-icons/ri";
import Comment from "../../Components/Comment/Comment";
import { GoVerified } from "react-icons/go";
import { Link } from "react-router-dom";
import { updateObject } from "../../Utilities/Utility";
import OptionsModal from "../Generic/OptionsModal/OptionsModal";
import * as Consts from "../../Utilities/Consts";
import GetFormattedDate from "../../Utilities/FormatDate";
import ScrollTrigger from 'react-scroll-trigger';
import Caption from "../../Components/Generic/Caption/Caption";
import { insertIntoText } from "../../Utilities/InsertIntoText";
import AudioContent from "../../Components/AudioContent/AudioContent";
import NewMsgModal from "../../Components/NewMsgModal/NewMsgModal";
import MutualLikes from "../../Pages/UsersProfile/MutualFriendsList/MutualFriendsItem";
import {AppContext} from "../../Context";
import VideoPostComp from "../../Components/VideoPost/VideoPost";
const EmojiPicker = React.lazy(() =>  import("../../Components/Generic/EmojiPicker/EmojiPicker"));
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
      viewFullCaption: false,
      doubleLikeClicked: false,
      showFullComments: false,
      showInputForm: false,
      replayData: {},
      openOptionsModal: false,
      openNewMsgModal: false,
      isVidLoaded: false,
      isVidEnded: false,
      isVideoPlaying: false,
      alsoLiked: [],
      preLoad: (this.props.contentType === "video" && this.props.index === 0) ? "metadata" : "none"
    };
    this._isMounted = true;
    this.similarsStr = (this.props.likes?.people?.some(el => el?.id === this.props.id) && this.props.likes?.people?.length >3) ? (this.props.likes?.people?.length?.toLocaleString() -3) : (this.props.likes?.people?.length?.toLocaleString() -2);
  }
  static contextType = AppContext;
  updateUsersWhoLiked = () => {
    var { likes, following } = this.props;
    this.setState({
      ...this.state,
      alsoLiked: following?.filter(user => likes?.people?.some((el) => (user?.receiverUid !== this.context.receivedData?.uid) && (user?.receiverUid === el?.id))).slice(0,2) 
    })
  }
  componentDidMount() {
    this.updateUsersWhoLiked();
  }
  componentWillUnmount(){
    window.clearTimeout(this.timeouts?.current);
    this._isMounted = false;
  }
  componentDidUpdate(prevProps) {
    if(prevProps.following !== this.props.following){
       this.updateUsersWhoLiked();
    }
  }

  handleCurrLikes = (boolean) => {
    const { index, handleMyLikes, id, userName, userAvatar } = this.props;
    handleMyLikes(boolean, index, id, userName, userAvatar, true);
  };
  openPost = (postId) => {
    const { changeMainState,changeModalState, receivedData, notify, getUsersProfile} = this.context
    if(postId){
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
  doubleClickEvent = () => {
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
      }, 1100);
    }
    this.timeouts.current = setTimeout(() => {
      resetCounter();
      window.clearTimeout(this.timeouts?.current);
    }, 1000);
  };

  submitComment(v) {
    v.preventDefault();
    const {
      index,
      id,
      userName,
      userAvatar,
      handleSubmittingComments,
      postId,
      postOwnerId,
      handleSubComments,
    } = this.props;
    if (this.state.insertedComment !== "") {
      //sub comment (nested comment)
      if (
        this.state.replayData !== {} &&
        /^[@]/.test(this.state.insertedComment)
      ) {
        handleSubComments(
          this.state.replayData,
          this.state.insertedComment,
          userAvatar,
          true
        );
      } else {
        //regular comment
        handleSubmittingComments(
          index,
          id,
          userName,
          this.state.insertedComment,
          userAvatar,
          postId,
          postOwnerId
        );
      }
      this.setState({
        insertedComment: "",
        replayData: {},
      });
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
    this.setState(
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
  handleVideoPlaying =(type) => {
    if(this.state.preLoad === "none"){
      this.setState({...this.state, preLoad: "metadata"});
    }
    if(this.videoPost && this.state.isVidLoaded && !this.state.isVidEnded && this.videoPost?.current && this.state.preLoad === "metadata" && !this.isVidBuffering){
        if(type.toLowerCase() === "on-view" && !this.state.isVideoPlaying && typeof this.videoPost.current?.play === "function"){
          // this.videoPost.current.play();
          this.setState({...this.state, isVideoPlaying: true});
        }else if(type.toLowerCase() === "out-of-view" && this.state.isVideoPlaying){
          // this.videoPost.current.pause();
          this.setState({...this.state, isVideoPlaying: false });
        }
    }
  }
  componentWillUnmount = () => {
    this.videoPost = false;
    this.inputField = false;
  }
  onEmojiClick = (e, x) => {
    e.persist();
    if(this.inputField && this.inputField?.current && typeof this.inputField?.current.blur !== undefined){
        this.inputField.current.blur();
    }
    this.setState({
      ...this.state,
      insertedComment: insertIntoText( this.state.insertedComment,x.emoji)
    });
  }
  closeAllModals = () => {
    this.setState({...this.state, openOptionsModal: false, openNewMsgModal: false });
  }
  render() {
    const {
      userName,
      caption,
      contentType,
      contentURL,
      contentName,
      comments,
      likes,
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
      deletePost,
      index,
      postId,
      handleSavingPosts,
      savedPosts,
      songInfo
    } = this.props;
    return (
      <Fragment>
          {
            this.state.openNewMsgModal &&
              <NewMsgModal closeModal={this.closeAllModals} sendPostForm={{postOwnerId, userAvatar ,userName, caption, contentType, contentURL, location, postId, isVerified}} />
          }
        <div id="post" className="post--card--container">
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
                  <span tabIndex="0" aria-disabled="false" role="button">
                    <h5 className="flex-row">
                      <Link
                        to={`/profile`}
                        style={{
                          whiteSpace: "nowrap",
                          wordBreak: "keep-all",
                          display: "flex",
                          flexWrap: "nowrap",
                        }}
                      >
                        <TruncateMarkup line={1} ellipsis="...">
                          {userName}
                        </TruncateMarkup>
                        {isVerified ? (
                          <GoVerified className="verified_icon" />
                        ) : null}{" "}
                      </Link>{" "}
                    </h5>
                  </span>
                  <span tabIndex="0" aria-disabled="false" role="button">
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
              {contentType === "image" ? (
                <div className="w-100 h-100"> 
                  <img
                    loading="lazy"
                    onClick={() => this.doubleClickEvent()}
                    className="post__card__content"
                    src={contentURL}
                    alt={`Post by ${userName}`}
                    draggable="false"
                  />
                  {this.state.doubleLikeClicked ? (
                    <div>
                      <div className="liked__double__click__layout"></div>
                      <span
                        className="liked__double__click"
                        style={{
                          animation: this.state.doubleLikeClicked
                            ? "boundHeartOnDouble 0.9s forwards ease-out"
                            : null,
                        }}
                      >
                        <FaHeart />
                      </span>
                    </div>
                  ) : null}
                </div>
              ) : contentType === "video" ? (
                <div className="w-100 h-100">
                  <ScrollTrigger onEnter={() => this.handleVideoPlaying("on-view")} onExit={() => this.handleVideoPlaying("out-of-view")} >
                  <VideoPostComp
                      ref={this.videoPost}
                      clickEvent={() => this.doubleClickEvent()}
                      src={contentURL}
                      isMuted={true}
                      preload={this.state.preLoad}
                      isVidPlaying={ this.state.isVideoPlaying}
                      whenLoadedData={()=> this.setState( { ...this.state, isVidLoaded: true })}
                      whenEnded={()=> this.setState( { ...this.state, isVidEnded: true } )}
                      whenCanPlay={() => this.isVidBuffering = false} />
                  </ScrollTrigger>
                </div>
              ) : contentType === "audio" ? (
                  <AudioContent url={contentURL} songInfo={songInfo || {}} userName={userName} doubleClickEvent={() => this.doubleClickEvent()} />
              ): null}
            </div>
            <div className="post--card--footer flex-column">
              <div className="post--footer--upper--row flex-row">
                <div className="flex-row">
                  {!likes?.people?.some((el) => el.id === id) ? (
                    <span data-cy="like" className="post--like--icon" onClick={() => this.handleCurrLikes(true)}>
                      <FiHeart />
                    </span>
                  ) : (
                    <span
                    data-cy="like"
                      onClick={() => this.handleCurrLikes(false)}
                      style={{
                        animation: likes?.people?.some((el) => el.id === id)
                          ? "boundHeart 0.5s forwards ease"
                          : null,
                      }}
                      className="liked__heart"
                    >
                      <FaHeart />
                    </span>
                  )}
                  <span data-cy="comment" onClick={() => this.onCommentBtnClick()}>
                   {
                     this.state.showInputForm ?
                     <FaRegCommentDots />
                     :
                     <FaRegComment />
                   } 
                  </span>
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
                    <Avatar src={this.state.alsoLiked?.[0]?.receiverAvatarUrl} />
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
              {comments?.length >= 1 ? (
                <div>
                  {comments?.length > 1 ? (
                    <h5
                      className="post__comments__count"
                      onClick={() =>
                        this.setState({
                          showFullComments: !this.state.showFullComments,
                        })
                      }
                    >
                      {" "}
                      {!this.state.showFullComments
                        ? "View all"
                        : "Hide most of the "}{" "}
                      {comments.length.toLocaleString()} comments
                    </h5>
                  ) : (
                    <h5 className="post__comments__count">Comments</h5>
                  )}
                  {!this.state.showFullComments
                    ? comments?.slice(0, 2).map((comment, i) => {
                        return (
                          <Comment
                            key={i}
                            comment={comment}
                            handleLikingComments={handleLikingComments}
                            postOwnerId={postOwnerId}
                            commentIndex={i}
                            replayFunc={this.replayFunc.bind(this)}
                            postIndex={this.props.index}
                            myName={myName}
                            date={comment?.date}
                            likes={likes}
                            userAvatar={userAvatar}
                            contentType={contentType}
                            contentURL={contentURL}
                            changeModalState={changeModalState}
                            uid={id}
                            deleteComment={onCommentDeletion}
                          />
                        );
                      })
                    : comments?.map((comment, i) => {
                        return (
                          <Comment
                            key={i}
                            comment={comment}
                            handleLikingComments={handleLikingComments}
                            postOwnerId={postOwnerId}
                            commentIndex={i}
                            replayFunc={this.replayFunc.bind(this)}
                            postIndex={this.props.index}
                            myName={myName}
                            date={comment?.date}
                            likes={likes}
                            userAvatar={userAvatar}
                            contentType={contentType}
                            contentURL={contentURL}
                            changeModalState={changeModalState}
                            uid={id}
                            deleteComment={onCommentDeletion}
                          />
                        );
                      })}
                </div>
              ) : null}

              <small className="post__date pb-2 ">
                <GetFormattedDate date={postDate?.seconds} /> • <time>{new Date(postDate?.seconds * 1000).toDateString()}</time>
              </small>
              {this.state.showInputForm && (
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
                        name="add-comment"
                      />
                    </div>
                 </div>
                  <button
                    type="submit"
                    disabled={this.state.insertedComment.length < 1}
                    className={
                      this.state.insertedComment.length >= 1
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
              <span className="text-danger font-weight-bold"
                onClick={() => {
                  deletePost( postId, index, contentName, contentURL );
                  this.setState({...this.state, openOptionsModal:false})
                }}
              >
                {" "}
                Delete post
              </span>
              <span
                onClick={() => this.openPost(postId)} >
                Go to post
              </span>
              <span onClick={() => this.setState({openOptionsModal:false})}>
                {" "}
                Cancel
              </span>
            </OptionsModal>
          )}
          <div
            style={{
              opacity: (this.state.openOptionsModal || this.state.openNewMsgModal) ? "1" : "0",
              display: (this.state.openOptionsModal || this.state.openNewMsgModal) ? "block" : "none",
              transition: "all 0.5s ease",
            }}
            className="backdrop "
            onClick={() => this.closeAllModals()}
          ></div>
        </div>
      </Fragment>
    );
  }
}
export default Post;
