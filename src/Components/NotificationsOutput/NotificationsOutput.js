import React, {useEffect, useState} from "react";
import Auxiliary from "../HOC/Auxiliary";
import TruncateMarkup from "react-truncate";
import {Avatar} from "@material-ui/core";
import {withRouter} from "react-router-dom";

const NotificationOutput =(props)=>{
    const [isFollowed, setFollowingState] = useState(false);
    const {notification, igVideoImg, myData,handleFollowing, getUsersProfile, changeMainState, postIndex } = props;
    useEffect(()=>{
        if(notification?.type === "follow"){
            setFollowingState(myData?.following.some(user => user?.receiverUid === notification?.uid));
        }
    },[myData?.following]);
    const browseUser=()=>{
        
        getUsersProfile(notification.uid);
        props.history.push("/user-profile");
    }
    // const redirectMeToPost=()=>{
    //     getUsersProfile(notification.uid);
    //     changeMainState("currentPostIndex", {index: postIndex, id: notification?.uid});
    // }
    return(
        <Auxiliary >
            <li  key={notification?.notiId} className="space__between noti--popup-item">
                    <div className="flex-row noti--row">
                        <div><Avatar className="noti__user__img" src={notification?.userAvatarUrl} /></div>
                        <div className="flex-column noti--user--info" onClick={()=> browseUser()}>
                            <h6>{notification?.userName}</h6>
                        <p className="noti__text"><TruncateMarkup line={2} ellipsis="..">{notification?.notiText}</TruncateMarkup>  <time dateTime="date" style={{textOverflow: 'ellipsis'}}>{new Date(notification?.date?.seconds * 1000).toLocaleString()}</time></p>
                        </div> 
                    </div>
                    
                    <div className="noti--action">
                        {
                            notification?.type === "follow" && notification?.uid !== myData.uid ?
                           
                                  <button disabled={!notification?.uid} onClick={()=> handleFollowing(isFollowed, notification?.uid ,notification?.userName, notification?.userAvatarUrl, myData?.uid, myData?.userName, myData?.userAvatarUrl) } className={ isFollowed ? "profile__btn prof__btn__unfollowed": "profile__btn prof__btn__followed"}> {isFollowed ? "unfollow"  : "follow"}</button>
                              
                            : null
                        } 
                        {
                             notification?.type !== "follow"?
                                <img className="noti__bar__img" src={notification?.contentType ==="image" ? notification?.contentURL : notification?.contentType ==="video" ? igVideoImg : null } />
                             : null
                        }

                    </div>
                                                            
            </li>
        </Auxiliary>
    )
}
export default withRouter(NotificationOutput);