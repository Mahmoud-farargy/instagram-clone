import React, {useContext, Fragment, useState,useEffect, useRef} from "react";
import {AppContext} from "../../Context";
import {Avatar} from "@material-ui/core";
import {withRouter} from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import {auth} from '../../Config/firebase';
import {useAuthState} from "react-firebase-hooks/auth";
import {GoVerified } from "react-icons/go";
import {IoMdGrid} from "react-icons/io";
import {RiLayoutRowLine} from "react-icons/ri";
import {BsPlusSquare} from "react-icons/bs";


const UsersProfile =(props)=>{
    const [_,loading] = useAuthState(auth);
    const [isFollowed, setFollowingState] = useState(false);
    const [grid, setGrid] = useState(true);
    const context = useContext(AppContext);
    const {usersProfileData , changeMainState, initializeChatDialog, uid, handleFollowing, receivedData,handleUsersModal, igVideoImg} = context;
    // const scrollToPlace = useRef(null);

    const redirectToPost=(i, id)=>{
        changeMainState("currentPostIndex", {index: i, id: id});
        props.history.push("/browse-post");
    }
    const message=(uid, username, avatarUrl)=>{
        initializeChatDialog(uid, username, avatarUrl);
        props.history.push("/messages");
    }
    useEffect(()=>{
        setFollowingState(receivedData?.following?.filter(item => item?.receiverUid  === usersProfileData?.uid)[0] ? true : false);
    },[receivedData?.followers,usersProfileData?.followers]);
    
    useEffect(() => {
        window.scrollTo(0,0);
    }, []);
     return(
        <Fragment>
            <section id="usersProfile" className="users--profile--container ">
                {/* Header */}
                {/* upper row */}
                
            <div className="desktop-comp">
                <div className="user--top--info flex-row">
                        <div className="user--pic--container flex-column">
                            <Avatar className="user__picture" src={usersProfileData?.userAvatarUrl} alt={usersProfileData?.userName} />
                        </div>
                        <div className="desktop--inner--info flex-column">
                            <div className="users--action--row flex-row">
                                <h5 className="profile__display__name">{usersProfileData?.userName}
                               {
                                   usersProfileData?.isVerified ?
                                   <GoVerified className="verified_icon"/>
                                   : null
                               }
                                </h5>
                                <div className="flex-row">
                                    {
                                        isFollowed &&
                                        <button disabled={!usersProfileData?.uid} className="profile__btn prof__btn__unfollowed" onClick={()=> message(usersProfileData?.uid, usersProfileData?.userName , usersProfileData?.userAvatarUrl)}>Message</button>
                                    }
                                    
                                    <button disabled={!usersProfileData?.uid} onClick={()=> handleFollowing(isFollowed, usersProfileData?.uid, usersProfileData?.userName, usersProfileData?.userAvatarUrl, uid, receivedData?.userName, receivedData?.userAvatarUrl)} className={ !isFollowed ? "profile__btn prof__btn__followed" : "profile__btn prof__btn__unfollowed" }> {isFollowed ? "unfollow" : "follow"}</button>
                                </div>
                                
                            </div>
                            <div className="desktop--social--row flex-row">
                                <p><span>{usersProfileData?.posts?.length.toLocaleString()}</span> {usersProfileData?.posts?.length >1 ?"posts": "post"}</p>
                                <p className="acc-action" onClick={()=> handleUsersModal(true, usersProfileData?.followers, "followers")}><span>{usersProfileData?.followers?.length.toLocaleString()}</span> {usersProfileData?.followers?.length >1 ?"followers": "follower"}</p>
                                <p className="acc-action"  onClick={()=> handleUsersModal(true, usersProfileData?.following, "following")}><span>{usersProfileData?.following?.length.toLocaleString()}</span> following</p>
                            </div>
                    </div>
                </div>
                {/* bottom row */}
                <div className="bottom--row--user-info flex-column">
                        <p>{usersProfileData?.bio}</p>
                </div>
                {/* body */}
                <div className="users--profile--stripe flex-row">
                  {
                      usersProfileData?.posts?.length >=1 ?
                   <div className="profile--stripe--inner flex-row">
                        <span onClick={()=> setGrid(true)} style={{color: grid ? "#1d8cd6": "#8e8e8e", borderTop: grid ? "2px solid #363636" : "none"}}><IoMdGrid /></span>
                        <span onClick={()=> setGrid(false)} style={{color: !grid ? "#1d8cd6": "#8e8e8e",borderTop: !grid ? "2px solid #363636" : "none"}}><RiLayoutRowLine/></span> 
                    </div>
                    : null
                } 
                    
                </div>

                    <div className={grid ? "users--profile--posts" : "users--profile--rowLine flex-column"}>
                        {
                            usersProfileData?.posts?.length >=1 && !loading  ?
                                usersProfileData?.posts?.map((post, i)=>{
                                        return (
                                            <div key={post?.id+i}  className="profile--posts--container">                                                    
                                                    <img onClick={()=> redirectToPost(i, post?.id) } style={{width: grid ? "100%" : "auto"}} className="users__profile__image" src={post?.contentType === "image" ? post?.contentURL : post?.contentType === "video" ? igVideoImg : null} alt={`post #${i}`} />
                                            </div>
                                        )
                                })
                            : loading ?
                                (<CircularProgress
                                    variant="determinate"
                                    size={40}
                                    thickness={4}
                                    {...props}
                                    value={100}
                                  />)
                            :
                            (
                                <div className="empty--posts--container flex-column">
                                    <div className="empty--posts--inner flex-column">
                                        <div className="plus--icon--container flex-column"><BsPlusSquare className="plus__icon"/></div>
                                        <h3>Profile</h3>
                                        <p>When you share photos and videos, they'll <br/> be appear on your profile page</p>
    
                                        <span>Share your first photo or video</span>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </section>
            
        </Fragment>
    )
}
export default withRouter(UsersProfile);