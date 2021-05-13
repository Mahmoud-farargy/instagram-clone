import React, { useEffect, useState } from "react";
import Auxiliary from "../HOC/Auxiliary";
import { Avatar } from "@material-ui/core";
import PropTypes from "prop-types";
import GetFormattedDate from "../../Utilities/FormatDate";
import { withBrowseUser } from "../../Components/HOC/withBrowseUser";
import reelDefaultPic from "../../Assets/reels-instagram-logo-white_1379-5039.jpeg"
import { trimText } from "../../Utilities/TrimText";
import { GoVerified } from "react-icons/go";

const NotificationOutput =(props)=>{
    const [isFollowed, setFollowingState] = useState(false);
    const {notification, igVideoImg, igAudioImg, myData, handleFollowing, browseUser } = props;
    const {following} = myData;
    useEffect(()=>{
        if(notification?.type === "follow"){
            setFollowingState(myData?.following.some(user => user?.receiverUid === notification?.uid));
        }
    },[following]);

    const redirectMeToPost=(e)=>{
        e.stopPropagation();
        // getUsersProfile(notification.uid);
        // changeMainState("currentPostIndex", {index: i, id: id});
        // getUsersProfile(uid).then(() => {
        //     props.history.push("/browse-post");
        // });
    }
    return(
        <Auxiliary >
            <li  key={notification?.notiId} className="space__between noti--popup-item">
                    <div className="flex-row noti--row">
                        <div><Avatar className="noti__user__img" src={notification?.userAvatarUrl} alt={notification?.userName} /></div>
                        <div className="flex-column noti--user--info" onClick={()=> browseUser(notification?.uid, notification?.userName)}>
                            <h6>{notification?.userName} {notification?.isVerified && <span><GoVerified className="verified_icon"/></span>}</h6>
                        <p className="noti__text">{trimText(notification?.notiText,200)} <span style={{textOverflow: 'ellipsis'}}><GetFormattedDate date={notification?.date?.seconds} /></span></p>
                        </div> 
                    </div>
                    
                    <div className="noti--action">
                        {
                            notification?.type === "follow" && notification?.uid !== myData.uid ?
                           
                                  <button disabled={!notification?.uid} onClick={()=> handleFollowing(isFollowed, notification?.uid , notification?.userName, notification?.userAvatarUrl, myData?.uid, myData?.userName, myData?.userAvatarUrl) } className={ isFollowed ? "profile__btn prof__btn__unfollowed": "profile__btn primary__btn"}> {isFollowed ? "unfollow"  : "follow"}</button>
                              
                            : null
                        } 
                        {
                             notification?.type !== "follow"?
                             <div onClick={(e)=> redirectMeToPost(e)}><img alt="Post" className="noti__bar__img" src={notification?.contentType ==="image" ? (notification?.contentURL) : notification?.contentType ==="video" ? igVideoImg : notification?.contentType === "reel" ? reelDefaultPic : notification?.contentType === "audio" ? igAudioImg: null } /></div>
                                
                             : null
                        }

                    </div>
                                                            
            </li>
        </Auxiliary>
    )
}
NotificationOutput.propTypes = {
    notification: PropTypes.object.isRequired,
    igVideoImg: PropTypes.string.isRequired,
    myData: PropTypes.object.isRequired,
    handleFollowing: PropTypes.func.isRequired,
    changeMainState: PropTypes.func,
    postIndex: PropTypes.number
}
export default  withBrowseUser(React.memo(NotificationOutput));