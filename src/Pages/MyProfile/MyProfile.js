import React, {useContext, Fragment, useState} from "react";
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
import { Link } from "react-router-dom";

const MyProfile =(props)=>{
    const [_,loading] = useAuthState(auth);
    const [grid, setGrid] = useState(true);
    const context = useContext(AppContext);
    const {receivedData,handleUsersModal, igVideoImg, authLogout} = context;
    const redirectToPost=(i, id)=>{
        // changeMainState("usersProfileData", receivedData);
        // changeMainState("currentPostIndex", {index: i, id: id});
        // props.history.push("/browse-post");
    }
    
    
     return(
        <Fragment>
            <section id="usersProfile" className="users--profile--container ">
                {/* Header */}
                {/* upper row */}
                
            <div className="desktop-comp">
                <div className="user--top--info flex-row">
                        <div className="user--pic--container flex-column">
                            <Avatar className="user__picture" src={receivedData?.userAvatarUrl} alt={receivedData?.userName} />
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
                                <button className="mobile-only" onClick={()=> {authLogout(); window.location.reload()}}>Log out</button>
                                </div>
                                
                            </div>
                            <div className="desktop--social--row flex-row">
                                <p><span>{receivedData?.posts?.length.toLocaleString()}</span> {receivedData?.posts?.length >1 ?"posts": "post"}</p>
                                <p className="acc-action" onClick={()=> handleUsersModal(true, receivedData?.followers, "followers")}><span>{receivedData?.followers?.length.toLocaleString()}</span> {receivedData?.followers?.length >1 ?"followers": "follower"}</p>
                                <p className="acc-action"  onClick={()=> handleUsersModal(true, receivedData?.following, "following")}><span>{receivedData?.following?.length.toLocaleString()}</span> following</p>
                            </div>
                            {/* bottom row */}
                            <div className="bottom--row--user-info flex-column">
                                    <span>{receivedData?.bio}</span>
                            </div>
                    </div>
                </div>
                
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
                                            <div key={post?.id+i}  className="profile--posts--container">                                                    
                                                    <img onClick={()=> redirectToPost(i, post?.id) } style={{width: grid ? "100%" : "auto"}} className="users__profile__image" src={post?.contentType === "image" ? post?.contentURL : post?.contentType === "video" ? igVideoImg : null} alt={`post #${i}`} />
                                            </div>
                                        )
                                })}
                    </div>
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
            </section>
            
        </Fragment>
    )
}
export default withRouter(MyProfile);