import React, { useContext, Fragment, useState, useEffect } from "react";
import { AppContext } from "../../Context";
import { Avatar } from "@material-ui/core";
import { withRouter, Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { auth } from '../../Config/firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import { GoVerified } from "react-icons/go";
import { IoMdGrid } from "react-icons/io";
import { RiLayoutRowLine } from "react-icons/ri";
import { FaHeart } from "react-icons/fa";
import { FaComment } from "react-icons/fa";
import reelsIco from "../../Assets/reels.png";
import PostModal from "../../Components/DesktopPost/DesktopPost";
import * as Consts from "../../Utilities/Consts";
import emptyPostsImg from "../../Assets/6efc710a1d5a.jpg";
import appleStore from "../../Assets/get-app-apple.png";
import gpStore from "../../Assets/get-app-gp.png";
import { HiOutlinePlus } from "react-icons/hi";

const MyProfile =(props)=>{
    const [,loading] = useAuthState(auth);
    const [grid, setGrid] = useState(true);
    const {receivedData,changeModalState, authLogout, changeMainState, uid, getUsersProfile, currentPostIndex, modalsState, updateReelsProfile} = useContext(AppContext);
    const redirectToPost=(i, id)=>{
        changeMainState("currentPostIndex", {index: i, id: id});
        getUsersProfile(uid).then(() => {
            props.history.push("/browse-post");
        });
    }
    useEffect(()=>{
        changeMainState("currentPage", "Profile");
    },[]);
    const openPostModal = (postId,index) =>{
        changeMainState("currentPostIndex", { index: index, id: postId });
        getUsersProfile(uid).then(() => {
              changeModalState("post", true);
        });
    }
    const loadReels = ({currentGroupId, currentGroupIndex, currentReelIndex, currentReelId}) => {
        updateReelsProfile(uid).then(() => {
            changeMainState("currentReel",  {groupIndex: currentGroupIndex , groupId: currentGroupId, reelIndex: currentReelIndex, reelId: currentReelId });
        });
    
       
    }
    const websiteToView = receivedData?.profileInfo?.website.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split("/")[0];
     return(
        <Fragment>
            {/* Modals */}
            {modalsState?.post && receivedData?.posts[currentPostIndex?.index] &&
                <PostModal/>
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
                                <h5 className="profile__display__name">{receivedData?.userName}
                               {
                                   receivedData?.isVerified ?
                                   <GoVerified className="verified_icon"/>
                                   : null
                               }
                                </h5>
                                <div className="flex-row">
                                <Link role="button" className="profile__btn prof__btn__unfollowed mr-2" to="/edit-profile" >Edit profile</Link>
                                <button className="mobile-only" onClick={()=> authLogout(props.history)}>Log out</button>
                                </div>
                                
                            </div>
                            <div className="desktop--social--row flex-row">
                                <p><span>{receivedData?.posts?.length.toLocaleString()}</span> {receivedData?.posts?.length >1 ? "posts": "post"}</p>
                                <p className="acc-action" onClick={()=> changeModalState("users",true, receivedData?.followers, Consts.FOLLOWERS)}><span>{receivedData?.followers?.length.toLocaleString()}</span> {receivedData?.followers?.length >1 ?"followers": "follower"}</p>
                                <p className="acc-action"  onClick={()=> changeModalState("users",true, receivedData?.following, Consts.FOLLOWING)}><span>{receivedData?.following?.length.toLocaleString()}</span> following</p>
                            </div>
                            {/* bottom row */}
                            {/* TODO: refactor this to be only one piece of code */}
                            <div className="desktop-only flex-column">
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
                                        <span>{receivedData?.profileInfo?.bio}</span>
                                    </div>
                                }
                                {
                                     receivedData?.profileInfo && receivedData?.profileInfo?.website &&
                                    <div className="prof--acc--website">
                                        <a rel="noopener noreferrer" target="_blank" href={receivedData?.profileInfo?.website}>{websiteToView}</a>
                                    </div>
                                }

                            </div>

                    </div>
                    </header>
                     {/* profile info */}
                    <div className="profile--user--info mobile-only flex-column">
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
                                    <span>{receivedData?.profileInfo?.bio}</span>
                                </div>
                            }
                               
                            {
                                receivedData?.profileInfo && receivedData?.profileInfo?.website &&
                                <div className="prof--acc--website">
                                    <a rel="noopener noreferrer" target="_blank" href={receivedData?.profileInfo?.website}>{websiteToView}</a>
                                </div>
                            }
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
                                  <Link  onClick={() => loadReels({currentGroupId: reel?.id, currentGroupIndex: index, currentReelIndex: 0, currentReelId: 0})}  to="/reels" className="reel--bubble flex-column">
                                      <div className="reel--upper--container flex-column">
                                            <div className="reel--upper--inner flex-row" >
                                                <img className="reels__icon" src={reelsIco} alt="icon"/>
                                            </div>
                                      </div>
                                      
                                     <span className="mt-1">{reel.groupName}</span>
                                   </Link>   
                                </li>
                                )}
                               </div>         
                        }
                </ul>
                      
                {/* body */}
                <div className="users--profile--stripe flex-row">
                  {
                      receivedData?.posts?.length >=1 ?
                   <div className="profile--stripe--inner flex-row">
                        <span onClick={()=> setGrid(true)} style={{color: grid ? "#1d8cd6": "#8e8e8e", borderTop: grid ? "2px solid #363636" : "none"}}><IoMdGrid /></span>
                        <span onClick={()=> setGrid(false)} style={{color: !grid ? "#1d8cd6": "#8e8e8e",borderTop: !grid ? "2px solid #363636" : "none"}}><RiLayoutRowLine/></span> 
                    </div>
                    : null
                } 
                    
                </div>
                {
                 receivedData?.posts?.length >=1 && !loading ?
                    <div className={grid ? "users--profile--posts" : "users--profile--rowLine flex-column"}>
                        {receivedData?.posts?.map((post, i)=>{
                                        return (
                                            <div key={post?.id+i} className="profile--posts--container">   
                                            {/* TODO: refactor this to be only one piece of code */}
                                              {/* Desktop */}
                                                <div className="user--img--container desktop-only flex-column" onClick={() => openPostModal(post?.id,i)}>
                                                       {
                                                           post?.contentType === "image" ?
                                                            <img style={{width:"100%"}} loading="lazy"  className="users__profile__image" src={post?.contentURL} alt={`post #${i}`} />
                                                           : post?.contentType === "video" ?
                                                           <video disabled muted autoPlay loop src={post?.contentURL} className="users__profile__image" contextMenu="users__profile__image" onContextMenu={() => false} />
                                                           : <h4>Not found</h4>
                                                       }

                                                                <div className="user--img--cover">
                                                                        <div className="flex-row">
                                                                            <span className="mr-3"><FaHeart/> {post?.likes?.people?.length.toLocaleString()}</span>
                                                                            <span><FaComment/> {post?.comments.length && post?.comments.length?.toLocaleString() } </span>
                                                                        </div>
                                                                </div>
                                                </div>                                                
                                                {/* Mobile */}
                                                <div className="user--img--container mobile-only flex-column"  onClick={()=> redirectToPost(i, post?.id) } >
                                                        {
                                                           post?.contentType === "image" ?
                                                            <img style={{width:"100%"}} loading="lazy"  className="users__profile__image" src={post?.contentURL} alt={`post #${i}`} />
                                                           : post?.contentType === "video" ?
                                                           <video disabled muted autoPlay loop src={post?.contentURL} className="users__profile__image" contextMenu="users__profile__image" onContextMenu={() => false} />
                                                           : <h4>Not found</h4>
                                                       }
                                                                <div className="user--img--cover">
                                                                        <div className="flex-row">
                                                                            <span className="mr-3"><FaHeart/> {post?.likes?.people?.length.toLocaleString()}</span>
                                                                            <span><FaComment/> {post?.comments.length && post?.comments.length?.toLocaleString() } </span>
                                                                        
                                                                        </div>
                                                                
                                                                </div>
                                                </div>  
                                            </div>
                                        )
                                })}
                    </div>
                            : loading ?
                                (<Skeleton count={10} height={250} width={250} className="mt-4 mr-4 mx-auto"  />)
                        :
                        (
                            <div className="my-empty--posts--container flex-row">
                                <div className="my-empty--posts--img flex-row">
                                    <img loading="lazy" style={{backgroundColor: "rgba(255,255,255,0.3)"}} src={emptyPostsImg} alt="logo" />
                                </div>
                                <div className="my-empty--posts--text--container flex-column">
                                    <h2>Start capturing and sharing your moments.</h2>
                                    <p>Get the app to share your first photo or video.</p>
                                    <div onClick={() => props.history.push("/add-post")} className="my--empty--posts--get--app flex-row">
                                        <img loading="lazy" src={appleStore} alt="apple store" />
                                        <img loading="lazy" src={gpStore} alt="google store" />
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
            </section>
            
        </Fragment>
    )
}
export default withRouter(MyProfile);