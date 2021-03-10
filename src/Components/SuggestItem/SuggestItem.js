import React, {useEffect, useState, Fragment} from "react";
import {Avatar} from "@material-ui/core";
import {GoVerified} from "react-icons/go";

const SuggestItem =(props)=>{
    const [followingState, setFollowingState] = useState(false);
    const {userName, isVerified, userUid, userAvatarUrl, browseUser, handleFollowing, receivedData} = props;
   
    useEffect(()=>{     
        if(receivedData !== {} && receivedData){
            setFollowingState(receivedData?.following.filter(item => item?.receiverUid  === userUid)[0] ? true : false); 
        }
            
       
    },[receivedData?.following]);

    return(
        <Fragment>
            <div className="suggest--item--container">
                <li className="suggestion--item flex-row">
                    <div onClick={()=> browseUser(userUid)} className="side--user--info flex-row">
                        <Avatar src={userAvatarUrl} alt={userName}/>
                        <h5 className="flex-row">{userName}{isVerified ?  <span><GoVerified className="verified_icon"/></span> : null} </h5>                                    
                    </div>
                    <button className={followingState? "profile__btn prof__btn__unfollowed": "profile__btn prof__btn__followed"} color="primary" onClick={()=> handleFollowing(followingState, userUid, userName, userAvatarUrl, receivedData?.uid, receivedData?.userName, receivedData?.userAvatarUrl)}>{!followingState ? "Follow": "Unfollow"}</button>
                </li> 
            </div>
        </Fragment>
    )
}
export default SuggestItem;