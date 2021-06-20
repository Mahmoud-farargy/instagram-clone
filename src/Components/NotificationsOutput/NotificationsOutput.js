import React from "react";
import Auxiliary from "../HOC/Auxiliary";
import { Avatar } from "@material-ui/core";
import PropTypes from "prop-types";
import GetFormattedDate from "../../Utilities/FormatDate";
import { withBrowseUser } from "../../Components/HOC/withBrowseUser";
import reelDefaultPic from "../../Assets/reels-instagram-logo-white_1379-5039.jpeg"
import { trimText } from "../../Utilities/TrimText";
import { GoVerified } from "react-icons/go";
import FollowUnfollowBtn from "../../Components/FollowUnfollowBtn/FollowUnfollowBtn";

const NotificationOutput =(props)=>{
    const {notification, igVideoImg, igAudioImg, myData, browseUser } = props;
    const redirectMeToPost=(e)=>{
        e.stopPropagation();
        // getUsersProfile(notification.uid);
        // changeMainState("currentPostIndex", {index: i, id: id});
        // getUsersProfile(uid).then(() => {
        //     props.history.push("/browse-post");
        // });
    }
    return notification && (
        <Auxiliary >
            <li className="space__between noti--popup-item">
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
                                <FollowUnfollowBtn shape="secondary" userData={{userId: notification?.uid, uName: notification?.userName, uAvatarUrl: notification?.userAvatarUrl, isVerified: (notification?.isVerified || false)}} />
                            : null
                        } 
                        {
                             notification?.type !== "follow" ?
                             <div onClick={(e)=> redirectMeToPost(e)}><img loading="lazy" alt="Post" className="noti__bar__img unselectable" src={notification?.contentType ==="image" ? (notification?.contentURL) : notification?.contentType ==="video" ? igVideoImg : notification?.contentType === "reel" ? reelDefaultPic : notification?.contentType === "audio" ? igAudioImg: null } /></div>
                                
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
    changeMainState: PropTypes.func,
    postIndex: PropTypes.number,
    browseUser: PropTypes.func.isRequired
}
export default  withBrowseUser(React.memo(NotificationOutput));