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
import { IoIosArrowDown, IoIosArrowUp} from "react-icons/io";
import {HiOutlineDotsHorizontal} from "react-icons/hi";
import reelsIco from "../../Assets/reels.png";
import PostModal from "../../Components/DesktopPost/DesktopPost";
import OptionsModal from "../../Components/Generic/OptionsModal/OptionsModal";
import SuggList from "./SuggList/SuggList";
import MutualFriendsItem from "./MutualFriendsList/MutualFriendsItem";
import * as Consts from "../../Utilities/Consts";
import { firebase } from "../../Config/firebase";
import Moment from "react-moment";
import ProfileItem from "../../Components/ProfileItem/ProfileItem";

const UsersProfile = (props) => {
  const [, loading] = useAuthState(auth);
  const [isFollowed, setFollowingState] = useState(false);
  const [isFollower, setFollowerState] = useState(false);
  const [grid, setGrid] = useState(true);
  const context = useContext(AppContext);
  const [openSuggestionsBox, setSuggestionsBox] = useState(false);
  const [randNum, setRandNum] = useState(0);
  const [connectivityStatus, setConnectivityStatus] = useState({});

  const {
    usersProfileData,
    changeMainState,
    initializeChatDialog,
    uid,
    handleFollowing,
    receivedData,
    changeModalState,
    modalsState,
    suggestionsList,
    handleUserBlocking,
    currentPostIndex,
    updateReelsProfile,
    isUserOnline
  } = context;

  const message = (uid, username, avatarUrl, isVerified) => {
    const newIndex = receivedData && receivedData.messages?.map(d => d.uid).indexOf(uid);
    if(newIndex !== -1){
      changeMainState("currentChat",{uid, index: newIndex});
    }
    initializeChatDialog(uid, username, avatarUrl, isVerified);
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
    changeMainState("currentPage", `${usersProfileData?.profileInfo && usersProfileData?.profileInfo?.name ? usersProfileData?.profileInfo?.name+" (" : ""}@${usersProfileData.userName}${usersProfileData?.profileInfo && usersProfileData?.profileInfo?.name ? ")" : ""}` || "User Profile");
  }, [usersProfileData, changeMainState]);
  useEffect(() => {   
    window.scrollTo(0, 0);
  }, []);
  useEffect(()=> {
    if(isUserOnline){
    firebase?.database() &&  firebase.database().ref(`/status/${usersProfileData?.uid}`).once('value').then((snapshot) => {
        if(snapshot.val() && snapshot.val()?.state){
            const {state, last_changed} = snapshot.val();
            setConnectivityStatus({state, last_changed});
        }else{
          setConnectivityStatus({state: "", last_changed: ""});
        }
      });
    }
    
    suggestionsList?.length > 0 ? setRandNum(Math.floor(Math.random() * suggestionsList?.length -6)) : setRandNum(0);
  },[suggestionsList, usersProfileData]);

  const openPost = (postId, index) =>{
    changeMainState("currentPostIndex", { index: index, id: postId });
    if((window.innerWidth || document.documentElement.clientWidth) >= 670){
      changeModalState("post", true);
    }else{
      props.history.push("/browse-post");
    }
    
  }

  const blockUser = (blockedUid, userName, userAvatarUrl, profileName) => {
    handleUserBlocking(true, blockedUid, userName, userAvatarUrl, profileName).then(() => props.history.push("/"));
  }

  const loadReels = ({currentGroupId, currentGroupIndex, currentReelIndex, currentReelId}) => {
    updateReelsProfile(usersProfileData?.uid).then(() => {
        changeMainState("currentReel",  {groupIndex: currentGroupIndex , groupId: currentGroupId, reelIndex: currentReelIndex, reelId: currentReelId });
    });
}
  const similarFollowers = (usersProfileData?.uid !== receivedData?.uid) && (receivedData?.blockList?.filter(w => w.blockedUid !== usersProfileData?.uid)) ? receivedData?.following.filter(el => el.receiverUid !== receivedData?.uid && usersProfileData?.followers.some(item => item.senderUid === el.receiverUid)) : [];
  const websiteToView = usersProfileData?.profileInfo?.website.replace(/^(?:https?:\/\/)?(?:www\.)?(?:http:\/\/)?/i, "").split("/")[0];
  const notBlockedOrBlockingUser = receivedData?.blockList && !receivedData?.blockList?.some(a => a.blockedUid === usersProfileData?.uid) && usersProfileData?.blockList && !usersProfileData?.blockList?.some(a => a.blockedUid === receivedData?.uid);
  const userProfileInfo = (
    <div>
       {
        notBlockedOrBlockingUser ?
        <div>
                  {
                     connectivityStatus && connectivityStatus?.state && isFollowed && (usersProfileData?.profileInfo?.professionalAcc?.status || receivedData?.profileInfo?.professionalAcc?.status) &&
                    <span className="activity--container">
                      {connectivityStatus?.state === "online" ?
                      <small className="online--status flex-row"><span>Active now</span><span className="online__user"></span></small>
                      : connectivityStatus?.last_changed &&
                      <small>
                        Active {<Moment fromNow withTitle>{new Date( connectivityStatus?.last_changed).toISOString()}</Moment>}
                      </small>
                   
                     }
                    </span>
                    }
          {usersProfileData?.profileInfo && usersProfileData?.profileInfo?.name &&
                      <div className="prof--acc--name">
                        <h1>
                          {usersProfileData?.profileInfo?.name}
                        </h1>
                        <br />
                      </div>
                    }
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
                          <br />
                        </div>
                      )}

                    <div className="bottom--row--user-info flex-column">
                      <span>{usersProfileData?.profileInfo?.bio}</span>
                    </div>
                    {
                        usersProfileData?.profileInfo && usersProfileData?.profileInfo?.website &&
                        <div className="prof--acc--website">
                              <a rel="noopener noreferrer" target="_blank" href={usersProfileData?.profileInfo?.website}>{websiteToView}</a>
                        </div>
                    }
                    {
                      similarFollowers && similarFollowers.length > 0 &&
                      <p onClick={()=> changeModalState("users",true, similarFollowers, Consts.MUTUALFRIENDS)}  className="similar__followers">Followed by <span>
                        {
                        similarFollowers.slice(0,3).map(q => <MutualFriendsItem key={q?.receiverUid} item={q} />)
                      }
                      {
                        similarFollowers.length > 3 && 
                        <span className="similar__followers__more pl-1">+{ `${similarFollowers.length - 3}`} more</span>
                      }
                        </span></p>
                    }
        </div>
        : null
      }
    </div>
   
  )
  return (
    <Fragment> 
       {/* Modals */}
      {
        modalsState?.post && usersProfileData?.posts[currentPostIndex?.index] &&
          <PostModal />
      }
      {
         modalsState?.options && !modalsState?.post &&
         (<OptionsModal>
             <span className="text-danger font-weight-bold"
               onClick={() => blockUser(usersProfileData?.uid, usersProfileData?.userName, usersProfileData?.userAvatarUrl, usersProfileData?.profileInfo && usersProfileData.profileInfo?.name ? usersProfileData?.profileInfo?.name : "" )} >
               {" "}
               Block this user
             </span>
             <span>
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
                  loading="lazy"
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
                            usersProfileData?.userAvatarUrl,
                            usersProfileData?.isVerified
                          )
                        }
                      >
                        Message
                      </button>
                    )}

                 {
                   usersProfileData?.blockList && usersProfileData?.uid !== receivedData?.uid &&  !usersProfileData?.blockList?.some(a => a.blockedUid === receivedData?.uid) ?
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
                        transition: "all 0.5 linear",
                        border: openSuggestionsBox ? "#63baf4" : "#0095f6",
                      }}
                      onClick={() => setSuggestionsBox(!openSuggestionsBox)}
                    >
                      {openSuggestionsBox ? <IoIosArrowUp /> : <IoIosArrowDown/>}
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
                      usersProfileData?.uid !== receivedData?.uid && notBlockedOrBlockingUser &&
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
                {userProfileInfo}
              </div>
              
              </div>
              {/* profile info */}
              <div className="profile--user--info mobile-only flex-column">
                {userProfileInfo}
              </div>
            </header>
            {openSuggestionsBox && (
              <div className="users--suggestions--container">
                <div className="user--sugg--header flex-row">
                  <span className="user__sugg__title__title">Suggestions</span>
                  <Link to="/explore/people/suggestions"><span className="user__see__all__btn">see all</span></Link>
                </div>
                <div className="suggestions--list--container flex-row">
                  <ul className="suggestion--items flex-row">
                    {suggestionsList && suggestionsList.length > 0 &&
                      suggestionsList.filter(
                        (item) =>
                          item?.uid !== receivedData?.uid &&
                          item?.uid !== usersProfileData?.uid
                      ).slice(randNum, suggestionsList?.length -1).slice(0,10)
                      .map((item, i) => <SuggList key={(item?.uid || i)} item={item} receivedData={receivedData} setSuggestionsBox={setSuggestionsBox} handleFollowing={handleFollowing}/>)}
                  </ul>
                </div>
              </div>
            )}
          </div>
          <ul className="reels--ul flex-row">
                  {
                      usersProfileData?.blockList && !usersProfileData?.blockList?.some(a => a.blockedUid === receivedData?.uid) &&  usersProfileData?.reels && usersProfileData?.reels.length > 0 && receivedData?.blockList && !receivedData?.blockList?.some(a => a.blockedUid === usersProfileData?.uid) && //find an alternative to make data always updating
                              usersProfileData?.reels &&  usersProfileData?.reels.length > 0 &&
                              usersProfileData.reels.map((reel, index) => (
                                  <li key={reel?.id + index}>
                                    <Link  onClick={() => loadReels({currentGroupId: reel?.id, currentGroupIndex: index, currentReelIndex: 0, currentReelId: 0})}  to="/reels" className="reel--bubble flex-column">
                                    <div className="reel--upper--container flex-column">
                                            <div className="reel--upper--inner flex-row" >
                                                <img className="reels__icon" src={reelsIco} alt="icon"/>
                                            </div>
                                      </div>
                                      
                                     <span className="mt-1">{reel.groupName}</span>
                                    </Link>   
                                </li>
                              ))
                              
                      
                  }
          </ul>
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
                               <ProfileItem key={post?.id + i} post={post} openPost={openPost} index={i}/>
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

                              <Link to="/add-post"><span>Share your first photo or video</span></Link>
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
export default withRouter(React.memo(UsersProfile));
