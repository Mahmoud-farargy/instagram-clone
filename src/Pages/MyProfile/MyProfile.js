import React, { useContext, Fragment, useState, useEffect, useRef, useCallback, memo } from "react";
import { AppContext } from "../../Context";
import { Avatar } from "@material-ui/core";
import { useHistory, Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { auth } from '../../Config/firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import { GoVerified } from "react-icons/go";
import { IoMdGrid } from "react-icons/io";
import { MdOndemandVideo } from "react-icons/md";
import { RiLayoutRowLine } from "react-icons/ri";
import { GiCog } from "react-icons/gi";
import { VscBookmark } from "react-icons/vsc";
import reelsIco from "../../Assets/reels.png";
import PostModal from "../../Components/DesktopPost/DesktopPost";
import * as Consts from "../../Utilities/Consts";
import emptyPostsImg from "../../Assets/6efc710a1d5a.jpg";
import appleStore from "../../Assets/get-app-apple.png";
import gpStore from "../../Assets/get-app-gp.png";
import { HiOutlinePlus } from "react-icons/hi";
import { FiLogOut, FiVideoOff } from "react-icons/fi";
import { trimText } from "../../Utilities/TrimText";
import { linkifyText } from "../../Utilities/ReplaceHashes";
import ProfilePosts from "../../Components/ProfilePosts/ProfilePosts";
import ProfileOptionsModal from "./ProfileOptionsModal";
import { connect } from "react-redux";
import * as actionTypes from "../../Store/actions/actions";

const MyProfile =({changeModalState, modalsState})=>{
    const _isMounted = useRef(true);
    const timeouts = useRef(null); 
    const history = useHistory();
    const [,loading] = useAuthState(auth);
    const [profSections] = useState([
        {sectionId: "grid",title: "grid", logo: <IoMdGrid />},
        {sectionId: "stacked",title: "stacked", logo: <RiLayoutRowLine/>},
        {sectionId: "reels", title: "reels", logo: <MdOndemandVideo />},
        {sectionId: "saved", title: "saved", logo: <VscBookmark />},
    ]);
    const [reelsList, setReelsList] = useState([]);
    const { receivedData, authLogout, usersProfileData, changeMainState, uid, currentPostIndex, updateReelsProfile, activeProfileSection, testStorageConnection } = useContext(AppContext);
    useEffect(()=>{
        changeMainState("currentPage", "Profile");
       
        return () => {
            changeMainState("activeProfileSection", {activeIndex: 0, activeID: "grid" });
            _isMounted.current = false;
            window.clearTimeout(timeouts?.current);
        }
    },[]);
    useEffect(() => {
        if(activeProfileSection?.activeIndex === 3){
            testStorageConnection();
        }
    },[activeProfileSection]);
    useEffect(() => {
        const reelArr = [];
        receivedData?.reels && receivedData.reels.length > 0 && receivedData.reels.map(reelGroup => {
          return (reelGroup.reelItems && reelGroup.reelItems.length > 0) && reelGroup.reelItems.map( reel => 
             reelArr.push({
                 ...reel,
               groupId: reelGroup.id
             })
          );
         });
        setReelsList(reelArr);
    },[receivedData?.reels]);
    const loadReels = ({currentGroupId, currentGroupIndex, currentReelIndex, currentReelId}) => {
        updateReelsProfile(uid).then(() => {
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
    const isEmailAndNotAnon = (receivedData?.profileInfo?.registrationMethod === "email" && !receivedData?.uid?.includes("L9nP3dEZpyTg7AMIg8JBkrGQIji2"));
    const changeDirection = useCallback((index, id) => {
        changeMainState("activeOption", {activeIndex: isEmailAndNotAnon ? index : index - 1, activeID:  id}); history.push("/edit-profile")
    },[]);
    const memoizedAuthLogout = useCallback(() => {
        authLogout(history);
    }, []);
    const websiteToView = receivedData?.profileInfo?.website.replace(/^(?:https?:\/\/|www\.)/i, "") || "";
    const isBirthday = ((receivedData?.profileInfo?.birthday) && (new Date().getMonth() + 1 === new Date(receivedData?.profileInfo?.birthday).getMonth() + 1) && (new Date().getDate() === new Date(receivedData?.profileInfo?.birthday).getDate()));

    const HeaderBottom = (
        <>
                                        {receivedData?.profileInfo && receivedData?.profileInfo?.name &&
                                    <div className="prof--acc--name">
                                        <h1>
                                        {receivedData?.profileInfo?.name}
                                        </h1>
                                        <br />
                                    </div>
                                }
                                {
                                receivedData?.profileInfo && receivedData?.profileInfo.professionalAcc && receivedData?.profileInfo.professionalAcc.show &&
                                    <div className="prof--acc--category">
                                        <span>{receivedData.profileInfo?.professionalAcc?.category}</span>
                                        <br />
                                    </div>
                                } 
                                {
                                    receivedData?.profileInfo && receivedData?.profileInfo?.bio &&
                                    <div className="bottom--row--user-info flex-column">
                                        <span dangerouslySetInnerHTML={{
                                            __html: trimText(linkifyText(receivedData?.profileInfo?.bio), 1000),
                                        }}></span>
                                    </div>
                                }
                                {
                                     receivedData?.profileInfo && receivedData?.profileInfo?.website &&
                                    <div className="prof--acc--website">
                                        <a rel="noopener noreferrer" target="_blank" href={receivedData?.profileInfo?.website}>{websiteToView}</a>
                                    </div>
                                }
                                {
                                    isBirthday &&
                                    <div className="prof--acc--name">
                                        <h1 style={{textTransform:"uppercase"}}>HAPPY BIRTHDAY TO YOU {(receivedData?.profileInfo?.name || receivedData?.userName)} 🎂</h1>
                                    </div>
                                }
        </>
    )
     return(
        <Fragment>
            {/* Modals */}
            {modalsState?.post && usersProfileData?.posts?.length > 0 && usersProfileData?.posts[currentPostIndex?.index] &&
                <PostModal/>
            }
            { modalsState?.options && !modalsState?.post &&
            <ProfileOptionsModal changeDirection={changeDirection} authLogout={memoizedAuthLogout} history={history} isEmailAndNotAnon={isEmailAndNotAnon}/>
            }
            <section id="usersProfile" className="users--profile--container ">
                {/* Header */}
                {/* upper row */}
                
            <div className="desktop-comp">
                <div className="user--top--info flex-column">
                <header className="user-top-inner flex-row">
                        <div className="user--pic--container flex-column">
                            <Avatar loading="lazy" className="user__picture" src={receivedData?.userAvatarUrl} alt={receivedData?.userName} />
                        </div>
                    <div className="desktop--inner--info flex-column">
                            <div className="users--action--row w-100 flex-row">
                                <h5 className="profile__display__name">{trimText(receivedData?.userName, 24)}
                               {
                                   receivedData?.isVerified ?
                                   <GoVerified className="verified_icon"/>
                                   : null
                               }
                                </h5>
                                <div className="flex-row">
                                <Link role="button" className="profile__btn prof__btn__unfollowed mr-2" to="/edit-profile" onClick={()=> changeMainState("activeOption", {activeIndex: 0, activeID: "Edit_Profile"})} >Edit profile</Link>
                                <button className="mobile-only profile__btn prof__btn__unfollowed" onClick={()=> authLogout(history)}><FiLogOut className="mr-1" /> Log out</button>
                                <button className="my__settings__btn" onClick={() => changeModalState("options", true)}><GiCog className="rotate__anim"/></button>
                                </div>
                                
                            </div>
                            <div className="desktop--social--row flex-row">
                                <p><span>{receivedData?.posts?.length.toLocaleString()}</span> {receivedData?.posts?.length >1 ? "posts": "post"}</p>
                                <p className="acc-action clickable" onClick={()=> changeModalState("users",true, receivedData?.followers, Consts.FOLLOWERS)}><span>{receivedData?.followers?.length.toLocaleString()}</span> {receivedData?.followers?.length >1 ?"followers": "follower"}</p>
                                <p className="acc-action clickable"  onClick={()=> changeModalState("users",true, receivedData?.following, Consts.FOLLOWING)}><span>{receivedData?.following?.length.toLocaleString()}</span> following</p>
                            </div>
                            {/* bottom row */}
                            <div className="desktop-only flex-column">
                               {HeaderBottom}
                            </div>

                    </div>
                    </header>
                     {/* profile info */}
                    <div className="profile--user--info mobile-only flex-column">
                            {HeaderBottom}
                    </div>          
                </div>
                <ul className="reels--ul flex-row">
                        {
                            receivedData?.reels && receivedData?.reels.length > 0 && 
                                <div className="flex-row">
                                <li className="reel--list--item">
                                    <Link to="/add-post" className="reel--bubble reels--new flex-column">
                                    <div className="reel--upper--container flex-column">
                                            <div className="reel--upper--inner flex-row" >
                                                <HiOutlinePlus  className="add__new__reels__ico"/>
                                            </div>
                                      </div>
                                      <span className="mt-1">New</span>
                                    </Link>
                                </li>
                                
                                {receivedData?.reels.map((reel, index) =>
                                <li key={reel?.id + index} className="reel--list--item">
                                  <span  onClick={() => loadReels({currentGroupId: reel?.id, currentGroupIndex: index, currentReelIndex: 0, currentReelId: 0})} className="reel--bubble flex-column">
                                      <div className="reel--upper--container flex-column">
                                            <div className="reel--upper--inner flex-row" >
                                                <img className="reels__icon" src={reelsIco} alt="icon"/>
                                            </div>
                                      </div>
                                      
                                     <span className="mt-1">{reel.groupName}</span>
                                   </span>   
                                </li>
                                )}
                               </div>         
                        }
                </ul>
                      
                {/* body */}
                <div className="users--profile--stripe flex-row">
                  {
                   <div className="profile--stripe--inner flex-row">
                       {
                           profSections?.map((item, index) => {
                               return (item.sectionId === "stacked" ? receivedData?.posts?.length > 0 : true) && (
                                   <div key={index}>
                                      <span className="profile--section--item flex-row" style={{color: activeProfileSection?.activeIndex === index ? "var(--main-black)": "var(--second--gray)", borderTop: activeProfileSection?.activeIndex === index ? "1px solid var(--main-black)" : "none"}} onClick={()=> changeMainState("activeProfileSection", {activeIndex: index, activeID: profSections[index].sectionId })} >{item.logo}<strong className="desktop-only">{profSections?.[index].title}</strong></span> 
                                   </div>
                               )
                           })
                       }
                    </div>
                } 
                    
                </div>
                {
                 activeProfileSection?.activeIndex === 0 || activeProfileSection?.activeIndex === 1 ?
                 (receivedData?.posts?.length >=1 && !loading ?
                    <div >
                        <ProfilePosts listType="post" list={receivedData?.posts} parentClass={activeProfileSection?.activeIndex === 0 ? "users--profile--posts" : "users--profile--rowLine flex-column"} />
                    </div>
                            : loading ?
                                (<Skeleton count={10} height={250} width={250} className="mt-4 mr-4 mx-auto"  />)
                        :
                        (
                            <div className="my-empty--posts--container flex-row">
                                <div className="my-empty--posts--img flex-row">
                                    <img className="unselectable" loading="lazy" style={{backgroundColor: "rgba(255,255,255,0.3)"}} src={emptyPostsImg} alt="logo" />
                                </div>
                                <div className="my-empty--posts--text--container flex-column">
                                    <h2>Start capturing and sharing your moments.</h2>
                                    <p>Get the app to share your first photo or video.</p>
                                    <div onClick={() => history.push("/add-post")} className="my--empty--posts--get--app flex-row">
                                        <img loading="lazy" src={appleStore} alt="apple store" />
                                        <img loading="lazy" src={gpStore} alt="google store" />
                                    </div>
                                </div>
                            </div>
                        )
                    ): activeProfileSection?.activeIndex === 2 ?
                        <>
                        {reelsList && reelsList?.length > 0 ?
                            <div>
                                <ProfilePosts listType="reel" list={reelsList} parentClass="users--profile--posts"/>
                            </div>
                            :
                            <div className="empty--posts--container flex-column">
                            <div className="empty--posts--inner mx-auto flex-column">
                              <div className="plus--icon--container flex-column">
                                      <FiVideoOff className="plus__icon" />
                                              </div>
                                              <h3>You haven't created reels yet</h3>
                                              <p>
                                              Share reels so others can watch them and admire your lifestyle.
                                              </p>
                                            <Link to="/add-post"> <span>Create new</span></Link>
                                            </div>
                          </div>
                        }
                        </>
                    :activeProfileSection?.activeIndex === 3 ?
                    (receivedData?.savedposts?.length >=1 && !loading ?
                        <div className="saved--posts--container">
                            <h6>Only you can see what you've saved</h6>
                            <div>
                               <ProfilePosts listType="post" list={receivedData?.savedposts} isSavedPost={true} parentClass="users--profile--posts" />
                            </div>  
                        </div>
                            : loading ?
                                    (<Skeleton count={10} height={250} width={250} className="mt-4 mr-4 mx-auto"  />)
                            :
                            (
                                <div className="empty--card mt-5 w-100 col-lg-6 col-md-12 mx-auto">
                                    <div className="plus--icon--container flex-column">
                                        <VscBookmark />
                                    </div>
                                    <h2>Save</h2>
                                    <h4>
                                    Save photos and videos that you want to see again. No one is notified, and only you can see what you've saved.
                                    </h4>
                                    </div>
                            )
                        )
                        : <h4 className="text-center">No items found</h4>
                    }
                </div>
            </section>
            
        </Fragment>
    )
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
export default connect(mapStateToProps, mapDispatchToProps)(memo(MyProfile));