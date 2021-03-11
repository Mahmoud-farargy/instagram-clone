import React, {Fragment} from "react";
import {Avatar} from "@material-ui/core";
import {GoVerified} from "react-icons/go";

const SuggestItem =(props)=>{
    const {userName, isVerified, userUid, userAvatarUrl, browseUser, handleFollowing, receivedData} = props;

    return(
        <Fragment>
            <div className="suggest--item--container">
                <li className="suggestion--item flex-row">
                    <div onClick={()=> browseUser(userUid, userName )} className="side--user--info flex-row">
                        <Avatar src={userAvatarUrl} alt={userName}/>
                        <h5 className="flex-row">{userName}{isVerified ?  <span><GoVerified className="verified_icon"/></span> : null} </h5>                                    
                    </div>
                    <button className={receivedData.following.some(item => item.receiverUid === userUid) ? "profile__btn prof__btn__unfollowed": "profile__btn prof__btn__followed"} color="primary" onClick={()=> handleFollowing(receivedData?.following.some(item => item?.receiverUid === userUid), userUid, userName, userAvatarUrl, receivedData?.uid, receivedData?.userName, receivedData?.userAvatarUrl)}>{!receivedData?.following.some(item => item?.receiverUid === userUid) ? "Follow": "Unfollow"}</button>
                </li> 
            </div>
        </Fragment>
    )
}
export default SuggestItem;