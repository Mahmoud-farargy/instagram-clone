import React, { useContext, Fragment, useState, useEffect, useRef, memo } from "react";
import { AppContext } from "../../Context";
import { Avatar } from "@material-ui/core";
import { useHistory, Link, useParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { auth, firebase } from "../../Config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { GoVerified } from "react-icons/go";
import { IoMdGrid } from "react-icons/io";
import { MdOndemandVideo } from "react-icons/md";
import { RiLayoutRowLine } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { ImBlocked } from "react-icons/im";
import { VscLock } from "react-icons/vsc";
import { FiVideoOff } from "react-icons/fi";
import { IoIosArrowDown, IoIosArrowUp} from "react-icons/io";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import reelsIco from "../../Assets/reels.png";
import PostModal from "../../Components/DesktopPost/DesktopPost";
import OptionsModal from "../../Components/Generic/OptionsModal/OptionsModal";
import SuggList from "./SuggList/SuggList";
import MutualFriendsItem from "./MutualFriendsList/MutualFriendsItem";
import * as Consts from "../../Utilities/Consts";
import Moment from "react-moment";
import FollowUnfollowBtn from "../../Components/FollowUnfollowBtn/FollowUnfollowBtn";
import { trimText } from "../../Utilities/TrimText";
import ProfilePosts from "../../Components/ProfilePosts/ProfilePosts";
import { linkifyText } from "../../Utilities/ReplaceHashes";
import { connect } from "react-redux";
import * as actionTypes from "../../Store/actions/actions";

const UsersProfile = ({ changeModalState, modalsState, suggestionsList }) => {
  const [, loading] = useAuthState(auth);
  // STATES
  const [isFollowed, setFollowingState] = useState(false);
  const [isInitializingMsg, setMsgInitialization] = useState(false);
  const {userId} = useParams();
  const context = useContext(AppContext);
  const [openSuggestionsBox, setSuggestionsBox] = useState(false);
  const [randNum, setRandNum] = useState(0);
  const [connectivityStatus, setConnectivityStatus] = useState({});
  const [reelsList, setReelsList] = useState([]);
  const [profSections] = useState([
      {sectionId: "grid",title: "grid", logo: <IoMdGrid />},
      {sectionId: "stacked",title: "stacked", logo: <RiLayoutRowLine/>},
      {sectionId: "reels", title: "reels", logo: <MdOndemandVideo />}
  ]);
  // ---x---STATES---x---
  const [currentProfIndex, setCurrProfIndex] = useState({activeIndex: 0, activeID: "grid" });
  const history = useHistory();
  const {
    usersProfileData,
    changeMainState,
    initializeChatDialog,
    receivedData,
    handleUserBlocking,
    updateReelsProfile,
    isUserOnline,
    getUsersProfile,
    notify,
    handleSendingMessage
  } = context;
  const reelsData = usersProfileData?.reels;
  // REFS
  const _isMounted = useRef(true);
  const timeouts = useRef(null);
  const scrollToSuggs = useRef(null);
  //--x--REFS--x--
  const message = (uid, username, avatarUrl, isVerified) => {
    const newIndex = receivedData && receivedData.messages?.map(d => d.uid).indexOf(uid);
    if(newIndex !== -1){
      changeMainState("currentChat",{uid, index: newIndex});
    }
    setMsgInitialization(true);
    initializeChatDialog(uid, username, avatarUrl, isVerified).then(() => {
      if(_isMounted.current){
         history.push("/messages");
      }
      setMsgInitialization(false);
    }).catch(() => {
      if(_isMounted.current){
        setMsgInitialization(false);
      }
    });
  };
  useEffect(() => {
    receivedData?.following &&
      setFollowingState(
        receivedData?.following?.some(
          (item) => item?.receiverUid === usersProfileData?.uid
        )
      );
  }, [receivedData, usersProfileData]);

  useEffect(() => {
    changeMainState("currentPage", `${usersProfileData?.profileInfo && usersProfileData?.profileInfo?.name ? usersProfileData?.profileInfo?.name+" (" : ""}@${usersProfileData.userName}${usersProfileData?.profileInfo && usersProfileData?.profileInfo?.name ? ")" : ""}` || "User Profile");
  }, [usersProfileData, changeMainState]);
  useEffect(() => {
    if(!usersProfileData && userId){
      getUsersProfile(userId);
    }
    return () => {
      setCurrProfIndex({activeIndex: 0, activeID: "grid" });
      window.clearTimeout(timeouts?.current);
      _isMounted.current = false;
    }
  }, []);
  useEffect(() => {
   const reelArr = [];
   usersProfileData?.reels && usersProfileData.reels.length > 0 && usersProfileData.reels.map(reelGroup => {
     return reelGroup.reelItems.map( reel => 
        reelArr.push({
            ...reel,
          groupId: reelGroup.id
        })
     );
    });
   setReelsList(reelArr);
  },[reelsData]);
  useEffect(()=> {
    if(isUserOnline){
    firebase?.database() &&  firebase.database().ref(`/status/${usersProfileData?.uid}`).once('value').then((snapshot) => {
      if(_isMounted?.current){
          if(snapshot.val() && snapshot.val()?.state){
              const {state, last_changed} = snapshot.val();
              setConnectivityStatus({state, last_changed});
          }else{
            setConnectivityStatus({state: "", last_changed: ""});
          }
      }
      });
    }
    suggestionsList?.length > 0 ? setRandNum(Math.floor(Math.random() * suggestionsList?.length -6)) : setRandNum(0);
  },[suggestionsList, usersProfileData]);
 useEffect(() =>{
  if(openSuggestionsBox && scrollToSuggs && scrollToSuggs.current) scrollToSuggs.current.scrollIntoViewIfNeeded({behavior: "smooth"});
 },[openSuggestionsBox]);
  const blockUser = (blockedUid, userName, userAvatarUrl, profileName) => {
    handleUserBlocking(true, blockedUid, userName, userAvatarUrl, profileName).then(() =>  _isMounted?.current && history.push("/"));
  }

  const loadReels = ({currentGroupId, currentGroupIndex, currentReelIndex, currentReelId}) => {
    updateReelsProfile(usersProfileData?.uid).then(() => {
      if(_isMounted?.current){
        timeouts.current = setTimeout(() => {
          if(_isMounted?.current){
            changeMainState("currentReel",  {groupIndex: currentGroupIndex , groupId: currentGroupId, reelIndex: currentReelIndex, reelId: currentReelId });
            window.clearTimeout(timeouts?.current);
            history.push("/reels");
          }
        },250);
      } 
    });
  }

  const similarFollowers = (usersProfileData?.uid !== receivedData?.uid) && (receivedData?.blockList?.filter(w => w.blockedUid !== usersProfileData?.uid)) ? receivedData?.following.filter(el => el.receiverUid !== receivedData?.uid && usersProfileData?.followers.some(item => item.senderUid === el.receiverUid)) : [];
  const websiteToView = usersProfileData?.profileInfo?.website.replace(/^(?:https?:\/\/|www\.)/i, "") || "";
  const notBlockedOrBlockingUser = receivedData?.blockList && !receivedData?.blockList?.some(a => a.blockedUid === usersProfileData?.uid) && usersProfileData?.blockList && !usersProfileData?.blockList?.some(a => a.blockedUid === receivedData?.uid);
  const isPrivate = usersProfileData?.profileInfo?.professionalAcc?.private;
  const isBirthday = ((usersProfileData?.uid !== receivedData?.uid) && (usersProfileData?.profileInfo?.birthday) && (new Date().getMonth() + 1 === new Date(usersProfileData?.profileInfo?.birthday).getMonth() + 1) && (new Date().getDate() === new Date(usersProfileData?.profileInfo?.birthday).getDate()));
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
                      <span  dangerouslySetInnerHTML={{
                            __html: trimText(linkifyText(usersProfileData?.profileInfo?.bio), 1000),
                            }}
                            ></span>
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
                        <span className="similar__followers__more pl-1">+{ `${(similarFollowers.length - 3)}`} more</span>
                      }
                        </span></p>
                    }
                    {
                      isBirthday &&
                        <div className="prof--acc--name">
                              <h1>
                                Today is {(usersProfileData?.profileInfo?.name || usersProfileData?.userName)}'s Birthday 
                              </h1>
                              <span className="bd--wish" onClick={() => bdWish()}>Click here to tell {usersProfileData?.profileInfo?.gender?.toLowerCase() === "male" ? "him" : usersProfileData?.profileInfo?.gender?.toLowerCase() === "female" ? "her" : "them"} "Happy Birthday"</span>
                              <br />
                        </div>
                    }
 
        </div>
        : null
      }
    </div>
   
  )
  const openUsersModal = (list, name) =>{
    if(isPrivate ? isFollowed : true){
      changeModalState(
        "users",
        true,
        list,
        name
      )
    }
  }
  const bdWish = () =>{
    const UID = usersProfileData?.uid;
    initializeChatDialog(UID, usersProfileData?.userName, usersProfileData?.userAvatarUrl, usersProfileData?.isVerified).then(() => {
      if( _isMounted?.current){
              changeMainState("currentChat", { uid: UID,index: 0 });
              handleSendingMessage({content: `Hey, Happy birthday ${(usersProfileData?.profileInfo?.name || usersProfileData?.userName)}. I wish you the best.🎂`, uid: UID, type: "text", pathname: ""});
              window.clearTimeout(timeouts?.current);
              history.push("/messages");
          changeModalState("newMsg", false);
      }
    }).catch(() => {
      if( _isMounted?.current){
          notify("Failed to send","error");
      }
    });
  }
  return (
    <Fragment> 
       {/* Modals */}
      {
        modalsState?.post &&
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
                    {trimText(usersProfileData?.userName, 24)}
                    {usersProfileData?.isVerified ? (
                      <GoVerified className="verified_icon" />
                    ) : null}
                  </h5>
                  <div className="flex-row">
                    {(isFollowed && !receivedData?.blockList?.some(a => a.blockedUid === usersProfileData?.uid)) && (
                      <button
                        disabled={(!usersProfileData?.uid || isInitializingMsg)}
                        className={`profile__btn prof__btn__unfollowed ${isInitializingMsg ? "disabled": ""}`}
                        onClick={() =>
                          message(
                            usersProfileData?.uid,
                            usersProfileData?.userName,
                            usersProfileData?.userAvatarUrl,
                            usersProfileData?.isVerified
                          )
                        }
                      >
                        {
                          isInitializingMsg ? 
                            "Initializing message.."
                          :
                          "Message"
                        }
                       
                      </button>
                    )}

                 {
                   usersProfileData?.blockList && usersProfileData?.uid !== receivedData?.uid &&  !usersProfileData?.blockList?.some(a => a.blockedUid === receivedData?.uid) ?
                   receivedData?.blockList && !receivedData?.blockList?.some(a => a.blockedUid === usersProfileData?.uid) ?
                    <FollowUnfollowBtn shape="primary" userData={{userId: usersProfileData?.uid, uAvatarUrl: usersProfileData?.userAvatarUrl, uName: usersProfileData?.userName, isVerified: usersProfileData?.isVerified}}  />
                    :
                    <button onClick={(p) => {handleUserBlocking(false, usersProfileData?.uid, usersProfileData?.userName ); p.stopPropagation()}} className="profile__btn primary__btn">
                      Unblock
                    </button>
                    : null
                    
                    }
                    <button
                      className="sugg__btn profile__btn primary__btn"
                      style={{
                        backgroundColor: isFollowed ?
                          "transparent"
                          : openSuggestionsBox
                          ? "var(--sugg-btn-clr)"
                          : "var(--secondary-clr)",
                        transition: "all 0.5 linear",
                        border: `1px solid ${isFollowed ? "var(--gray)" : openSuggestionsBox ? "var(--sugg-btn-clr)" : "var(--secondary-clr)"}`,
                        color: isFollowed ? "var(--font-black)" : openSuggestionsBox ? "var(--white)" : "var(--white)",
                        fontSize: "13px"
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
                      className={`acc-action ${(isPrivate ? (isFollowed && "clickable") : "clickable")}`}
                      onClick={() =>
                        openUsersModal(
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
                      className={`acc-action ${(isPrivate ? (isFollowed && "clickable") : "clickable")}`}
                      onClick={() =>
                        openUsersModal(
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
              <div className="users--suggestions--container fadeEffect">
                <div className="user--sugg--header flex-row">
                  <span className="user__sugg__title__title">Suggestions</span>
                  <Link to="/explore/people"><span className="user__see__all__btn">see all</span></Link>
                </div>
                <div className="suggestions--list--container flex-row">
                  <ul ref={scrollToSuggs} className="suggestion--items flex-row">
                    {suggestionsList && suggestionsList.length > 0 &&
                      suggestionsList.filter(
                        (item) =>
                          item?.uid !== receivedData?.uid &&
                          item?.uid !== usersProfileData?.uid
                      ).slice(randNum, suggestionsList?.length -1).slice(0,15)
                      ?.map((item, i) => <SuggList key={(item?.uid || i)} item={item} receivedData={receivedData} setSuggestionsBox={setSuggestionsBox}/>)}
                  </ul>
                </div>
              </div>
            )}
          </div>
          <ul className="reels--ul flex-row">
                  {
                      usersProfileData?.blockList && !usersProfileData?.blockList?.some(a => a.blockedUid === receivedData?.uid) &&  usersProfileData?.reels && usersProfileData?.reels.length > 0 && receivedData?.blockList && !receivedData?.blockList?.some(a => a.blockedUid === usersProfileData?.uid) && //find an alternative to make data always updating
                              usersProfileData?.reels &&  usersProfileData?.reels.length > 0 &&
                              (isPrivate ? isFollowed : true) &&
                              usersProfileData.reels.map((reel, index) => (
                                  <li key={reel?.id + index}>
                                    <span  onClick={() => loadReels({currentGroupId: reel?.id, currentGroupIndex: index, currentReelIndex: 0, currentReelId: 0})} className="reel--bubble flex-column">
                                    <div className="reel--upper--container flex-column">
                                            <div className="reel--upper--inner flex-row" >
                                                <img className="reels__icon" src={reelsIco} alt="icon"/>
                                            </div>
                                      </div>
                                      
                                     <span className="mt-1">{reel.groupName}</span>
                                    </span>   
                                </li>
                              ))
                              
                      
                  }
          </ul>
          {/* body */}
      {
       usersProfileData?.blockList && !receivedData?.blockList.some(x => x.blockedUid === usersProfileData?.uid) ?
        usersProfileData?.blockList && !usersProfileData?.blockList?.some(f => f.blockedUid === receivedData?.uid) ?
        (isPrivate && !isFollowed) ?
        <div className="private-acc">
            <div className="users--profile--stripe flex-row"></div>
            <div className="empty--posts--container flex-column">
                              <div className="empty--posts--inner mx-auto flex-column">
                                <div className="plus--icon--container flex-column">
                                  <VscLock className="plus__icon" />
                                </div>
                                <h3>This Account is Private</h3>
                                <p>
                                Follow to see their photos, music and videos.
                                </p>
                                <span>Learn more</span>

                              </div>
            </div>
        </div>
        :
        <div>
          <div className="users--profile--stripe flex-row">
                      {usersProfileData?.posts?.length >= 1 ? (
                        <div className="profile--stripe--inner flex-row">
                          <div className="profile--stripe--inner flex-row">
                              {
                                  profSections?.map((item, index) => {
                                      return(
                                          <div key={index}>
                                              <span className="profile--section--item flex-row" style={{color: currentProfIndex?.activeIndex === index ? "var(--main-black)": "var(--second--gray)", borderTop: currentProfIndex?.activeIndex === index ? "1px solid var(--main-black)" : "none"}} onClick={()=> setCurrProfIndex(({activeIndex: index, activeID: item.sectionId }))} >{item.logo}<strong className="desktop-only">{profSections?.[index].title}</strong></span> 
                                          </div>
                                      )
                                  })
                              }
                          </div>
                        </div>
                      ) : null}
                    </div>
                  {currentProfIndex?.activeID.toLowerCase() === "grid" || currentProfIndex?.activeID.toLowerCase() === "stacked" ?
                  <>
                      {
                        
                        usersProfileData?.posts?.length >= 1 && !loading ? (
                              <div>
                                 <ProfilePosts listType="post" list={usersProfileData?.posts} parentClass={ currentProfIndex?.activeID.toLowerCase() === "grid" ? "users--profile--posts" : "users--profile--rowLine flex-column"}/>
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
                                        When this user shares photos, videos, or music they'll <br /> be appearing here.
                                      </p>
                                     <span>Learn more</span>
                                    </div>
                                  </div>
                                )
                            
                      }
                  </>
                  : 
                  currentProfIndex?.activeID.toLowerCase() === "reels" ?
                  <>
                  {
                    reelsList && reelsList?.length > 0 ?
                     <div>
                        <ProfilePosts listType="reel" list={reelsList} parentClass="users--profile--posts"/>
                    </div>
                    :
                    <div className="empty--posts--container flex-column">
                    <div className="empty--posts--inner mx-auto flex-column">
                      <div className="plus--icon--container flex-column">
                              <FiVideoOff className="plus__icon" />
                                      </div>
                                      <h3>No reels available</h3>
                                      <p>
                                      When this user shares reels, they'll <br /> be appearing here.
                                      </p>
                                     <span>Learn more</span>
                                    </div>
                  </div>
                  }
                  </>

                  : <h3>Not Found</h3>
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
const mapDispatchToProps = dispatch => {
  return {
      changeModalState: (modalType, hasDataList, usersList, usersType) => dispatch({type: actionTypes.CHANGE_MODAL_STATE, payload: {modalType, hasDataList, usersList, usersType}})
  }
}
const mapStateToProps = state => {
  return {
      modalsState: state[Consts.reducers.MODALS].modalsState,
      suggestionsList: state[Consts.reducers.USERSLIST].suggestionsList,
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(memo(UsersProfile));
