import React, {useEffect, useState} from "react";
import Auxiliary from "../HOC/Auxiliary";
import TruncateMarkup from "react-truncate";
import {Avatar} from "@material-ui/core";
import PropTypes from "prop-types";

import { withBrowseUser } from "../../Components/HOC/withBrowseUser";

const NotificationOutput =(props)=>{
    const [isFollowed, setFollowingState] = useState(false);
    const {notification, igVideoImg, myData,handleFollowing, changeMainState, postIndex, browseUser, closeNotiBox } = props;
    useEffect(()=>{
        if(notification?.type === "follow"){
            setFollowingState(myData?.following.some(user => user?.receiverUid === notification?.uid));
        }
    },[myData?.following]);

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
                        <div className="flex-column noti--user--info" onClick={()=> {browseUser(notification?.uid, notification?.userName); closeNotiBox && closeNotiBox(false)}}>
                            <h6>{notification?.userName}</h6>
                        <p className="noti__text"><TruncateMarkup line={2} ellipsis="..">{notification?.notiText}</TruncateMarkup>  <time dateTime="date" style={{textOverflow: 'ellipsis'}}>{new Date(notification?.date?.seconds * 1000).toLocaleString()}</time></p>
                        </div> 
                    </div>
                    
                    <div className="noti--action">
                        {
                            notification?.type === "follow" && notification?.uid !== myData.uid ?
                           
                                  <button disabled={!notification?.uid} onClick={()=> handleFollowing(isFollowed, notification?.uid , notification?.userName, notification?.userAvatarUrl, myData?.uid, myData?.userName, myData?.userAvatarUrl) } className={ isFollowed ? "profile__btn prof__btn__unfollowed": "profile__btn prof__btn__followed"}> {isFollowed ? "unfollow"  : "follow"}</button>
                              
                            : null
                        } 
                        {
                             notification?.type !== "follow"?
                             <div onClick={(e)=> redirectMeToPost(e)}><img className="noti__bar__img" src={notification?.contentType ==="image" ? notification?.contentURL : notification?.contentType ==="video" ? igVideoImg : null } /></div>
                                
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
    closeNotiBox: PropTypes.func,
    handleFollowing: PropTypes.func.isRequired,
    changeMainState: PropTypes.func,
    postIndex: PropTypes.number
}
export default  withBrowseUser(React.memo(NotificationOutput));