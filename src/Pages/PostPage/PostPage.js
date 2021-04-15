import React, { Fragment, useState, useContext , useEffect, useRef} from "react";
import "../../Components/Post/Post.css";
import { HiDotsHorizontal } from "react-icons/hi";
import { Avatar } from "@material-ui/core";
import TruncateMarkup from "react-truncate";
import { FiHeart, FiSend } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa";
import { IoMdVideocam } from "react-icons/io";
import { RiBookmarkLine } from "react-icons/ri";
import { AppContext } from "../../Context";
import Comment from "../../Components/Comment/Comment";
import { GoVerified } from "react-icons/go";
import { withRouter } from "react-router-dom";
import OptionsModal from "../../Components/Generic/OptionsModal/OptionsModal";
import { withBrowseUser } from "../../Components/HOC/withBrowseUser";

const PostPage  = (props) => {
  const context = useContext(AppContext);
  const {changeMainState, usersProfileData, currentPostIndex, uid,handlePeopleLikes, receivedData, handleSubmittingComments, handleSubComments, changeModalState, handleUserBlocking, modalsState,handleLikingComments, onCommentDeletion } = context;
  const [compState, setCompState] = useState({
        postLiked: false,
        insertedComment: "",
        viewFullCaption: false,
        btnClicks: 0,
        doubleLikeClicked: false,
        replayData: {},
  });
  //====================== 
  // REFS
  const inputField = useRef(null);
  const autoScroll = useRef(null);
  //----------------------

  
  // constructor(props) {
  //   super(props);
  //   this.inputField = React.createRef();
  //   this.state = {
  //     postLiked: false,
  //     insertedComment: "",
  //     viewFullCaption: false,
  //     btnClicks: 0,
  //     doubleLikeClicked: false,
  //     replayData: {},
  //   };
  // }

  // const convertSeconds=(s)=>{
  //         var sec = s % 60;
  //         var secInMinutes = (s- sec) /60;
  //         var min = secInMinutes %60;
  //         var hr = (secInMinutes - min) /60;
  //          if(sec<10){
  //             return hr + "h" + " " + min + "m" + " "+ 0+sec + "s";
  //          }
  //          return hr + "h" + " "+ min + "m" +" "+ sec + "s";
  // }
  // console.log(new Date(803980830.toDate()));
  useEffect(() => {
    changeMainState("currentPage", "Post");
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
      } = postsData[currentPostIndex?.index];
      handlePeopleLikes(
        boolean,
        currentPostIndex?.index,
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
      setTimeout(() => {
        setCompState({
          ...compState,
          doubleLikeClicked: false,
        });
      }, 1100);
    }
    setTimeout(() => {
      resetCounter();
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
        //subcomment
        if (
          compState.replayData !== {} &&
          /^[@]/.test(compState.insertedComment)
        ) {
          handleSubComments(
            compState.replayData,
            compState.insertedComment,
            receivedData?.userAvatarUrl,
            false,
            contentURL,
            contentType
          );
        } else {
          //comment
          handleSubmittingComments(
            "others",
            currentPostIndex?.index,
            uid,
            receivedData?.userName,
            compState.insertedComment,
            usersProfileData?.userAvatarUrl,
            new Date(),
            id,
            postOwnerId,
            contentURL,
            contentType
          );
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
  const replayFunc = (postOwnerName, commentIndex, postIndex, postId, postOwnerId, senderUid) => {
    inputField.current.focus();
    setCompState({
      ...compState,
      replayData: {
        postOwnerName,
        commentIndex,
        postIndex,
        postId,
        postOwnerId,
        senderUid
      },
      insertedComment: `@${postOwnerName} `,
    });
  }
  const blockUser = (blockedUid, userName, userAvatarUrl, profileName) => {
    changeModalState("options", false);
    handleUserBlocking(true, blockedUid, userName, userAvatarUrl, profileName).then(() => props.history.push("/"));
  }
    // var {
    //   usersProfileData,
    //   currentPostIndex,
    //   uid,
    //   receivedData,
    //   handleLikingComments,
    //   currentPostIndex,
    //   changeModalState,
    //   modalsState,
    // } = this.context;
    // if (usersProfileData?.posts) {
    //   var {caption = "",contentType = "",contentURL = "",comments = [],likes = [],location = "",date = "",postOwnerId = ""} = usersProfileData?.posts[currentPostIndex?.index];
    //   var isVerified = usersProfileData?.isVerified;
    // }
    // useEffect(() => {
        var {caption = "",contentType,contentURL = "",comments = [],likes= {},location = "",date = {},postOwnerId = ""} = usersProfileData?.posts[currentPostIndex?.index];       
        var isVerified = usersProfileData?.isVerified;
    // },[usersProfileData]);
    
  
    return (
      <Fragment>
        {
          modalsState?.options &&
          (<OptionsModal>
              <span
                onClick={() => blockUser(usersProfileData?.uid, usersProfileData?.userName, usersProfileData?.userAvatarUrl, usersProfileData?.profileInfo && usersProfileData.profileInfo?.name ? usersProfileData?.profileInfo?.name : "" )} >
                {" "}
                Block user
              </span>
              <span onClick={() => changeModalState("options",false)}>
                {" "}
                Cancel
              </span>
           
          </OptionsModal>)
        }
        {usersProfileData?.posts ? (
          <div id="post" className="post--card--container mobile--post post--page">
            <article className="post--card--article">
              <div className="post--card--header flex-row">
                <header className="post--header--avatar flex-row">
                  <Avatar
                    className="post__header__avatar"
                    src={usersProfileData?.userAvatarUrl}
                    alt={usersProfileData?.userName}
                  />
                  <div
                    className="post--header--user--info flex-column"
                    onClick={() =>
                      props.browseUser(usersProfileData?.uid, usersProfileData?.userName)
                    }
                  >
                    <span
                      tabIndex="0"
                      aria-disabled="false"
                      role="button"
                      className="flex-row"
                    >
                      <h5 className="flex-row w-100">
                        <TruncateMarkup line={1} ellipsis="...">
                          {usersProfileData?.userName}
                        </TruncateMarkup>
                        {isVerified ? (
                          <span>
                            <GoVerified className="verified_icon" />
                          </span>
                        ) : null}{" "}
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
                <span className="post--header--options" onClick={() => usersProfileData?.uid !== receivedData?.uid ? changeModalState("options", true) : null}>
                  <HiDotsHorizontal />
                </span>
              </div>
              <div className="post--card--body">
                {contentType === "image" ? (
                  <div>
                    <img
                      loading="lazy"
                      onClick={() => doubleClickEvent()}
                      className="post__card__content"
                      src={contentURL}
                      alt="post"
                      draggable="false"
                    />
                    {compState.doubleLikeClicked ? (
                      <div>
                        <div className="liked__double__click__layout"></div>
                        <span
                          className="liked__double__click"
                          style={{
                            animation: compState.doubleLikeClicked
                              ? "boundHeartOnDouble 0.9s forwards ease"
                              : null,
                          }}
                        >
                          <FaHeart />
                        </span>
                      </div>
                    ) : null}
                  </div>
                ) : contentType === "video" ? (
                  <div>
                    <video
                      className="post__card__content"
                      src={contentURL}
                      draggable="false"
                      controls
                    />
                    <IoMdVideocam className="video__top__icon" />
                  </div>
                ) : null}
              </div>
              <div className="post--card--footer flex-column">
                <div className="post--footer--upper--row flex-row">
                  <div className=" flex-row">
                    {!likesCheck() ? (
                      <span onClick={() => handleCurrLikes(true)}>
                        <FiHeart />
                      </span>
                    ) : (
                      <span
                        onClick={() => handleCurrLikes(false)}
                        style={{
                          animation: likesCheck()
                            ? "boundHeart 0.5s forwards ease"
                            : null,
                        }}
                        className="liked__heart"
                      >
                        <FaHeart />
                      </span>
                    )}
                    <span>
                      <FaRegComment />
                    </span>
                    <span>
                      <FiSend />
                    </span>
                  </div>
                  <div className="bookmark__icon">
                    <RiBookmarkLine />
                  </div>
                </div>
                {likes.people?.length >= 1 ? (
                  <div
                    className="likes__count"
                    onClick={() =>
                      changeModalState("users",true, likes?.people, "likes")
                    }
                  >
                    {likes?.people?.length.toLocaleString()}{" "}
                    {likes?.people?.length === 1 ? "like" : "likes"}
                  </div>
                ) : null}
                <span className="post__caption flex-row">
                  <strong>{usersProfileData?.userName}</strong>{" "}
                  {!compState.viewFullCaption ? (
                    <p>
                      <TruncateMarkup
                        line={4}
                        ellipsis="...more"
                        style={{ cursor: "pointer" }}
                        onClick={() => setCompState({...compState,viewFullCaption: true })}
                      >
                        {caption && caption}
                      </TruncateMarkup>
                    </p>
                  ) : (
                    <p className="article__post">{caption && caption}</p>
                  )}
                </span>
                {comments?.length >= 1 ? (
                  <div className="post--comments--layout" ref={autoScroll}>
                    {comments?.length > 1 ? (
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
                          myName={receivedData?.userName}
                          likes={likes}
                          userAvatar={receivedData?.userAvatarUrl}
                          uid={uid}
                          contentType={contentType}
                          contentURL={contentURL}
                          changeModalState={changeModalState}
                          deleteComment={onCommentDeletion}
                          posts={usersProfileData?.posts}
                        />
                      );
                    })}
                  </div>
                ) : null}

                <small className="post__date">
                  {new Date(date?.seconds * 1000).toLocaleString()}
                </small>
                <form
                  onSubmit={(e) => submitComment(e)}
                  className="post--bottom--comment--adding"
                >
                  <input
                    ref={inputField}
                    value={compState.insertedComment}
                    onChange={(event) =>
                      setCompState({...compState, insertedComment: event.target.value })
                    }
                    className="post__bottom__input"
                    type="text"
                    placeholder="Add a commment.."
                  />
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
                </form>
              </div>
            </article>
          </div>
        ) : (
          <h3>Sorry, page is not found.</h3>
        )}
      </Fragment>
    );
  
}
export default withBrowseUser(withRouter(PostPage));
