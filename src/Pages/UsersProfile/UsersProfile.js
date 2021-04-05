import React, { useContext, Fragment, useState, useEffect } from "react";
import { AppContext } from "../../Context";
import { Avatar } from "@material-ui/core";
import { withRouter, Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { auth } from "../../Config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { GoVerified } from "react-icons/go";
import { IoMdGrid } from "react-icons/io";
import { RiLayoutRowLine } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { ImBlocked } from "react-icons/im";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaHeart } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa";
import {HiOutlineDotsHorizontal} from "react-icons/hi";
import reelsIco from "../../Assets/reels.png";
import PostModal from "../../Components/DesktopPost/DesktopPost";
import OptionsModal from "../../Components/Generic/OptionsModal/OptionsModal";
import SuggList from "./SuggList/SuggList";

const UsersProfile = (props) => {
  const [_, loading] = useAuthState(auth);
  const [isFollowed, setFollowingState] = useState(false);
  const [isFollower, setFollowerState] = useState(false);
  const [grid, setGrid] = useState(true);
  const context = useContext(AppContext);
  const [openSuggestionsBox, setSuggestionsBox] = useState(false);
  const [randNum, setRandNum] = useState(0);

  const {
    usersProfileData,
    changeMainState,
    initializeChatDialog,
    uid,
    handleFollowing,
    receivedData,
    changeModalState,
    igVideoImg,
    modalsState,
    suggestionsList,
    getUsersProfile,
    notify,
    handleUserBlocking,
    currentPostIndex
  } = context;

  const redirectToPost = (i, id) => {
    changeMainState("currentPostIndex", { index: i, id: id });
    props.history.push("/browse-post");
  };
  const message = (uid, username, avatarUrl) => {
    const newIndex = receivedData && receivedData.messages?.map(d => d.uid).indexOf(uid);
    if(newIndex !== -1){
      changeMainState("currentChatIndex", newIndex);
    }
    initializeChatDialog(uid, username, avatarUrl);
      props.history.push("/messages");
  };
  useEffect(() => {
    receivedData?.following &&
      setFollowingState(
        receivedData?.following?.some(
          (item) => item?.receiverUid === usersProfileData?.uid
        )
      );
    receivedData?.followers &&
      setFollowerState(
        receivedData?.followers?.some(
          (item) => item?.senderUid === usersProfileData?.uid
        )
      );
  }, [receivedData, usersProfileData]);

  useEffect(() => {
    changeMainState("currentPage", usersProfileData.userName || "User Profile");
  }, [usersProfileData, changeMainState]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(()=> {
    suggestionsList?.length > 0 ? setRandNum(Math.floor(Math.random() * suggestionsList?.length -6)) : setRandNum(0);
  },[suggestionsList, usersProfileData]);

  const openPostModal = (postId, index) =>{
    changeMainState("currentPostIndex", { index: index, id: postId });
    changeModalState("post", true);
  }

  const blockUser = (blockedUid, userName, userAvatarUrl, profileName) => {
    changeModalState("options", false);
    handleUserBlocking(true, blockedUid, userName, userAvatarUrl, profileName).then(() => props.history.push("/"));
  }
  return (
    <Fragment> 
       {/* Modals */}
      {
        modalsState?.post && usersProfileData?.posts[currentPostIndex?.index] &&
          <PostModal history={props.history} />
      }
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
      <section id="usersProfile" className="users--profile--container ">
        {/* Header */}
        {/* upper row */}
 
        <div className="desktop-comp">
          <div className="user--top--info flex-column">
            <header className="user-top-inner flex-row">
              <div className="user--pic--container flex-column">
                <Avatar
                  className="user__picture"
                  title={usersProfileData?.userName}
                  src={usersProfileData?.userAvatarUrl}
                  alt={usersProfileData?.userName}
                />
              </div>
              <div className="desktop--inner--info flex-column">
                <div className="users--action--row flex-row">
                  <h5
                    className="profile__display__name"
                    title={usersProfileData?.userName}
                  >
                    {usersProfileData?.userName}
                    {usersProfileData?.isVerified ? (
                      <GoVerified className="verified_icon" />
                    ) : null}
                  </h5>
                  <div className="flex-row">
                    {isFollowed && (
                      <button
                        disabled={!usersProfileData?.uid}
                        className="profile__btn prof__btn__unfollowed"
                        onClick={() =>
                          message(
                            usersProfileData?.uid,
                            usersProfileData?.userName,
                            usersProfileData?.userAvatarUrl
                          )
                        }
                      >
                        Message
                      </button>
                    )}

                 {
                   usersProfileData?.blockList && !usersProfileData?.blockList?.some(a => a.blockedUid === receivedData?.uid) ?
                   receivedData?.blockList && !receivedData?.blockList?.some(a => a.blockedUid === usersProfileData?.uid) ?
                    <button
                      disabled={!usersProfileData?.uid}
                      onClick={(k) =>
                        {handleFollowing(
                          isFollowed,
                          usersProfileData?.uid,
                          usersProfileData?.userName,
                          usersProfileData?.userAvatarUrl,
                          uid,
                          receivedData?.userName,
                          receivedData?.userAvatarUrl
                        ); k.stopPropagation()}
                      }
                      className={
                        !isFollowed
                          ? "profile__btn prof__btn__followed"
                          : "profile__btn prof__btn__unfollowed"
                      }
                    >
                      {" "}
                      {!isFollowed && isFollower
                        ? "follow back"
                        : !isFollowed && !isFollower
                        ? "follow"
                        : "unfollow"}
                    </button>
                    :
                    <button onClick={(p) => {handleUserBlocking(false, usersProfileData?.uid, usersProfileData?.userName ); p.stopPropagation()}} className="profile__btn prof__btn__followed">
                      Unblock
                    </button>
                    : null
                    
                    }
                    <button
                      className="sugg__btn profile__btn prof__btn__followed"
                      style={{
                        backgroundColor: openSuggestionsBox
                          ? "#63baf4"
                          : "#0095f6",
                        border: openSuggestionsBox ? "#63baf4" : "#0095f6",
                      }}
                      onClick={() => setSuggestionsBox(!openSuggestionsBox)}
                    >
                      <IoMdArrowDropdown />
                    </button>
                  </div>
                </div>
               {
                  usersProfileData?.blockList && !usersProfileData?.blockList?.some(a => a.blockedUid === receivedData?.uid) ?
                  <div className="desktop--social--row flex-row">
                    <p>
                      <span>
                        {usersProfileData?.posts?.length.toLocaleString()}
                      </span>{" "}
                      {usersProfileData?.posts?.length > 1 ? "posts" : "post"}
                    </p>
                    <p
                      className="acc-action"
                      onClick={() =>
                        changeModalState(
                          "users",
                          true,
                          usersProfileData?.followers,
                          "followers"
                        )
                      }
                    >
                      <span>
                        {usersProfileData?.followers?.length.toLocaleString()}
                      </span>{" "}
                      {usersProfileData?.followers?.length > 1
                        ? "followers"
                        : "follower"}
                    </p>
                    <p
                      className="acc-action"
                      onClick={() =>
                        changeModalState(
                          "users",
                          true,
                          usersProfileData?.following,
                          "following"
                        )
                      }
                    >
                      <span>
                        {usersProfileData?.following?.length.toLocaleString()}
                      </span>{" "}
                      following
                    </p>
                  {
                      usersProfileData?.uid !== receivedData?.uid && receivedData?.blockList && !receivedData?.blockList?.some(a => a.blockedUid === usersProfileData?.uid) && usersProfileData?.blockList && !usersProfileData?.blockList?.some(a => a.blockedUid === receivedData?.uid) &&
                    <p>
                      <span className="profile--more--btn" onClick={() => changeModalState("options", true)}>
                         <HiOutlineDotsHorizontal />
                      </span>
                    </p>

                  }  
                  </div>
                  :
                  <div>
                    <h5>User not found</h5>
                  </div>
               } 

                {/* bottom row */}
                <div className="desktop-only flex-column">
                  {usersProfileData?.profileInfo &&
                  usersProfileData?.profileInfo.professionalAcc &&
                  usersProfileData?.profileInfo.professionalAcc.show && (
                    <div className="prof--acc--category">
                      <span>
                        {
                          usersProfileData.profileInfo?.professionalAcc
                            ?.category
                        }
                      </span>
                    </div>
                  )}

                <div className="bottom--row--user-info flex-column">
                  <span>{usersProfileData?.profileInfo?.bio}</span>
                </div>
              </div>
              
              </div>
              {/* profile info */}
              <div className="profile--user--info mobile-only flex-column">
                  {usersProfileData?.profileInfo &&
                  usersProfileData?.profileInfo.professionalAcc &&
                  usersProfileData?.profileInfo.professionalAcc.show && (
                    <div className="prof--acc--category">
                      <span>
                        {
                          usersProfileData.profileInfo?.professionalAcc
                            ?.category
                        }
                      </span>
                    </div>
                  )}

                <div className="bottom--row--user-info flex-column">
                  <span>{usersProfileData?.profileInfo?.bio}</span>
                </div>
              </div>
            </header>
            {openSuggestionsBox && (
              <div className="users--suggestions--container">
                <div className="user--sugg--header flex-row">
                  <span className="user__sugg__title__title">Suggestions</span>
                  <span className="user__see__all__btn">see all</span>
                </div>
                <div className="suggestions--list--container flex-row">
                  <ul className="suggestion--items flex-row">
                    {suggestionsList && suggestionsList.length > 0 &&
                      suggestionsList.filter(
                        (item) =>
                          item?.uid !== receivedData?.uid &&
                          item?.uid !== usersProfileData?.uid
                      ).slice(randNum, suggestionsList?.length -1).slice(0,10)
                      .map((item, i) => <SuggList key={(item?.uid || i)} item={item} receivedData={receivedData} setSuggestionsBox={setSuggestionsBox} notify={notify} getUsersProfile={getUsersProfile} history={props.history} handleFollowing={handleFollowing}/>)}
                  </ul>
                </div>
              </div>
            )}
          </div>
          {
                                 usersProfileData?.blockList && !usersProfileData?.blockList?.some(a => a.blockedUid === receivedData?.uid) &&  usersProfileData?.reels && usersProfileData?.reels.length > 0 && receivedData?.blockList && !receivedData?.blockList?.some(a => a.blockedUid === usersProfileData?.uid) &&( //find an alternative to make data always updating
                                         <Link to="/reels" onClick={()=> changeMainState("reelsProfile", usersProfileData)} className="reel--bubble flex-column"><img className="reels__icon" src={reelsIco} />
                                            <span className="mt-1">Reels</span>
                                         </Link>
                                    )
                            }
          {/* body */}
      {
       usersProfileData?.blockList && !receivedData?.blockList.some(x => x.blockedUid === usersProfileData?.uid) ?
        usersProfileData?.blockList && !usersProfileData?.blockList?.some(f => f.blockedUid === receivedData?.uid) ? 
        <div>
          <div className="users--profile--stripe flex-row">
                      {usersProfileData?.posts?.length >= 1 ? (
                        <div className="profile--stripe--inner flex-row">
                          <span
                            onClick={() => setGrid(true)}
                            style={{
                              color: grid ? "#1d8cd6" : "#8e8e8e",
                              borderTop: grid ? "2px solid #363636" : "none",
                            }}
                          >
                            <IoMdGrid />
                          </span>
                          <span
                            onClick={() => setGrid(false)}
                            style={{
                              color: !grid ? "#1d8cd6" : "#8e8e8e",
                              borderTop: !grid ? "2px solid #363636" : "none",
                            }}
                          >
                            <RiLayoutRowLine />
                          </span>
                        </div>
                      ) : null}
                    </div>
                {
                    usersProfileData?.posts?.length >= 1 && !loading ? (
                                    <div
                            className={
                              grid
                                ? "users--profile--posts"
                                : "users--profile--rowLine flex-column"
                            }
                          >
                            {usersProfileData?.posts?.map((post, i) => {
                              return (
                                <div
                                  key={post?.id + i}
                                  className="profile--posts--container "
                                >
                                  {/* desktop */}
                                  <div
                                    onClick={() => openPostModal(post?.id,i)}
                                    className="user--img--container desktop-only flex-column"
                                  >
                                    <img
                                    loading="lazy"
                                      style={{ width: "100%" }}
                                      className="users__profile__image"
                                      src={
                                        post?.contentType === "image"
                                          ? post?.contentURL
                                          : post?.contentType === "video"
                                          ? igVideoImg
                                          : null
                                      }
                                      alt={`post #${i}`}
                                    />
                                    <div className="user--img--cover">
                                      <div className="flex-row">
                                        <span className="mr-3">
                                          <FaHeart /> {post?.likes?.people?.length}
                                        </span>
                                        <span>
                                          <FaRegComment />{" "}
                                          {post?.comments.length > 0
                                            ? post?.comments.length
                                            : post?.comments.length}{" "}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  {/* Mobile */}
                                  <div
                                    onClick={() => redirectToPost(i, post?.id)}
                                    className="user--img--container mobile-only flex-column"
                                  >
                                    <img
                                      loading="lazy"
                                      style={{ width: "100%" }}
                                      className="users__profile__image"
                                      src={
                                        post?.contentType === "image"
                                          ? post?.contentURL
                                          : post?.contentType === "video"
                                          ? igVideoImg
                                          : null
                                      }
                                      alt={`post #${i}`}
                                    />
                                    <div className="user--img--cover">
                                      <div className="flex-row">
                                        <span className="mr-3">
                                          <FaHeart /> {post?.likes?.people?.length}
                                        </span>
                                        <span>
                                          <FaRegComment />{" "}
                                          {post?.comments.length > 0
                                            ? post?.comments.length
                                            : post?.comments.length}{" "}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : loading ? (
                          <Skeleton
                            count={10}
                            height={250}
                            width={250}
                            className="mt-4 mr-4 mx-auto"
                          />
                        ) : (
                          <div className="empty--posts--container flex-column">
                            <div className="empty--posts--inner mx-auto flex-column">
                              <div className="plus--icon--container flex-column">
                                <CgProfile className="plus__icon" />
                              </div>
                              <h3>No posts yet</h3>
                              <p>
                                When you share photos and videos, they'll <br /> be appear on
                                your profile page
                              </p>

                              <span>Share your first photo or video</span>
                            </div>
                          </div>
                        )
                    
       }
        </div>
        : 
         <div>
          <div className="users--profile--stripe flex-row"></div>
          
          <div className="empty--posts--container flex-column">
                            <div className="empty--posts--inner mx-auto flex-column">
                              <div className="plus--icon--container flex-column">
                                <ImBlocked className="plus__icon" />
                              </div>
                              <h3>Cannot acess this page</h3>
                              <p>
                                You are blocked by {usersProfileData?.userName}.
                              </p>
                              <span>Learn more</span>

                            </div>
            </div>
        </div> 
        :
      <div>
          <div className="users--profile--stripe flex-row"></div>
          <div className="empty--posts--container flex-column">
                            <div className="empty--posts--inner mx-auto flex-column">
                              <div className="plus--icon--container flex-column">
                                <ImBlocked className="plus__icon" />
                              </div>
                              <h3>Cannot acess this page</h3>
                              <p>
                                You have blocked {usersProfileData?.userName}. Unblock them to see their posts again.
                              </p>
                              <span>Learn more</span>

                            </div>
            </div>
          
        </div>
      }
         
         
        </div>
      </section>
    </Fragment>
  );
};
export default withRouter(UsersProfile);
