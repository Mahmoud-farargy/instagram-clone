import React, {useEffect, useState} from "react";
import Auxiliary from "../../HOC/Auxiliary";
import {Avatar} from "@material-ui/core";
import {withRouter} from "react-router-dom";

const ModalListItem =(props)=>{
    const [isFollowed, setFollowingState] = useState(false);
    const {uid, userName, avatarUrl, date , receivedData, handleFollowing, browseUser} = props;

    useEffect(()=>{
        setFollowingState(receivedData?.following.filter(user  => user.receiverUid === uid)[0] ? true : false);
    },[receivedData?.following]);

    return(
        <Auxiliary>
            <div className="modal--user--item flex-row">
                <div className="modal--item--inner flex-row acc-action" >
                   <Avatar src={avatarUrl} alt={userName} />
                    <div className="modal--user--info flex-column" onClick={()=> browseUser(uid, userName)}>
                        <h3>{userName}</h3>
                        {/* <span>{date}</span> */}
                    </div> 
                </div>
              {
                  uid !== receivedData.uid ?
                    <button disabled={!uid} onClick={(k)=> {handleFollowing(isFollowed, uid ,userName, avatarUrl, receivedData?.uid, receivedData?.userName, receivedData?.userAvatarUrl); k.stopPropagation()}} className={ isFollowed ? "profile__btn prof__btn__unfollowed": "profile__btn prof__btn__followed"}> {isFollowed ? "unfollow"  : "follow"}</button>
                : null
              }
            </div>
        </Auxiliary>
    )
}

export default withRouter(ModalListItem);