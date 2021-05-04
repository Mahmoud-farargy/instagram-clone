import React, {
  Fragment,
  useState,
  useContext,
  useEffect,
  useRef,
} from "react";
import "./DesktopPost.scss";
import "../../Components/Post/Post.css";
import { HiDotsHorizontal } from "react-icons/hi";
import { Avatar } from "@material-ui/core";
import TruncateMarkup from "react-truncate";
import { FiHeart, FiSend } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa";
import {
  IoMdVideocam,
  IoIosArrowBack,
  IoIosArrowForward,
} from "react-icons/io";
import { RiBookmarkLine } from "react-icons/ri";
import { AppContext } from "../../Context";
import Comment from "../../Components/Comment/Comment";
import { GoVerified } from "react-icons/go";
import OptionsModal from "../../Components/Generic/OptionsModal/OptionsModal";
import { withBrowseUser } from "../../Components/HOC/withBrowseUser";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import GetFormattedDate from "../../Utilities/FormatDate";
import Caption from "../../Components/Generic/Caption/Caption";

const DesktopPost = (props) => {
  const { browseUser, disableArrows } = props;
  const history = useHistory();
  const context = useContext(AppContext);
  const {
    changeMainState,
    usersProfileData,
    currentPostIndex,
    uid,
    handlePeopleLikes,
    receivedData,
    handleSubmittingComments,
    handleSubComments,
    changeModalState,
    handleUserBlocking,
    handleLikingComments,
    onCommentDeletion,
    handleFollowing,
    modalsState,
    deletePost
  } = context;
  const [compState, setCompState] = useState({
    postLiked: false,
    insertedComment: "",
    btnClicks: 0,
    doubleLikeClicked: false,
    replayData: {},
  });
  const inputField = useRef(null);
  const isFollowed = receivedData?.following?.some((item) => item?.receiverUid === usersProfileData?.uid);
  useEffect(() => {
    changeMainState("currentPage", "Post");
  }, []);
  
  var postLiked = usersProfileData?.posts && usersProfileData?.posts[currentPostIndex?.index]?.likes?.people?.some((el) => el.id === uid);
  const handleCurrLikes = (boolean) => {
    let postsData = usersProfileData?.posts;
    if (postsData) {
      const { postOwnerId, contentURL, contentType } = postsData[
        currentPostIndex?.index
      ];
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
            receivedData?.userAvatarUrl,
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
    ).then(() => history.push("/"));
  };
  var {
    caption = "",
    contentType,
    contentURL = "",
    comments = [],
    likes = {},
    location = "",
    date = {},
    postOwnerId = "",
  } = usersProfileData?.posts[currentPostIndex?.index];
  
  var isVerified = usersProfileData?.isVerified;

  const onPostMovement = (direction) => {
    if(usersProfileData?.posts.length > 1 && !disableArrows){
          const finalIndex = usersProfileData?.posts.length - 1;
          const currentIndex = currentPostIndex?.index;
          let currentDirection;

          if (direction === "left") {
            currentIndex > 0
              ? (currentDirection = currentIndex - 1)
              : (currentDirection = finalIndex);
          } else if (direction === "right") {
            currentIndex < finalIndex
              ? (currentDirection = currentIndex + 1)
              : (currentDirection = 0);
          }
          changeMainState("currentPostIndex", {
            ...currentPostIndex,
            index: currentDirection,
          });
    }
   
  };
  const navigate = (event) => {
    if (event.keyCode === 37) {
      onPostMovement("left");
    } else if (event.keyCode === 39) {
      onPostMovement("right");
    }
  };
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
                  <span className="text-danger font-weight-bold" onClick={() => deletePost( usersProfileData?.posts[currentPostIndex?.index]?.id, currentPostIndex?.index, usersProfileData?.posts[currentPostIndex?.index]?.contentName, usersProfileData?.posts[currentPostIndex?.index]?.contentURL )}>
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
                    <span className={`font-weight-bold ${isFollowed ? "text-danger" : "text-primary"}`} onClick={() => handleFollowing(
                                  isFollowed,
                                  usersProfileData?.uid,
                                  usersProfileData?.userName,
                                  usersProfileData?.userAvatarUrl,
                                  uid,
                                  receivedData?.userName,
                                  receivedData?.userAvatarUrl
                                  )}>
                              {isFollowed ? "Unfollow" : "Follow"}
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
            <div id="post" className="post--card--container post--page">
              <article className="post--card--article">
                <div className="post--card--body desktop--left">
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
                        autoPlay
                      />
                      <IoMdVideocam className="video__top__icon" />
                    </div>
                  ) : null}
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
                        onClick={() => {browseUser(usersProfileData?.uid, usersProfileData?.userName ); changeModalState("users", false, "", "")}}
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
                    <span
                      className="post--header--options"
                      onClick={() =>
                        changeModalState("options", true)
                      }
                    >
                      <HiDotsHorizontal />
                    </span>
                  </div>

                  {comments?.length >= 1 ? (
                    <div className="post--comments--layout">
                      {comments?.map((comment, i) => {
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
                          />
                        );
                      })}
                    </div>
                  ) : null}

                  <div className="post--card--footer flex-column">
                    <div className="post--footer--upper--row flex-row">
                      <div className=" flex-row">
                        {!postLiked ? (
                          <span onClick={() => handleCurrLikes(true)}>
                            <FiHeart />
                          </span>
                        ) : (
                          <span
                            onClick={() => handleCurrLikes(false)}
                            style={{
                              animation: postLiked
                                ? "boundHeart 0.5s forwards ease"
                                : null,
                            }}
                            className="liked__heart"
                          >
                            <FaHeart />
                          </span>
                        )}
                        <span onClick={() => inputField && inputField?.current && inputField?.current?.focus()}>
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
                          changeModalState(
                            "users",
                            true,
                            likes?.people,
                            "likes"
                          )
                        }
                      >
                        {likes?.people?.length.toLocaleString()}{" "}
                        {likes?.people?.length === 1 ? "like" : "likes"}
                      </div>
                    ) : null}
                  <Caption caption={caption} userName={usersProfileData?.userName} />

                    <small className="post__date">
                      <GetFormattedDate date={date?.seconds} /> • <time>{new Date(date?.seconds * 1000).toDateString()}</time>
                    </small>
                    <form
                      onSubmit={(e) => submitComment(e)}
                      className="post--bottom--comment--adding flex-row"
                    >
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
                </div>
              </article>
            </div>
            {/* post end */}
          </article>
        </div>
      </section>
    </Fragment>
  );
};
DesktopPost.propTypes = {
  browseUser: PropTypes.func.isRequired,
  disableArrows: PropTypes.bool
};
export default withBrowseUser(React.memo(DesktopPost));
