import React, {useEffect, useState, useContext} from "react";
import Auxiliary from "../../HOC/Auxiliary";
import {Avatar} from "@material-ui/core";
import ProTypes from "prop-types";
import { withBrowseUser } from "../../../Components/HOC/withBrowseUser";
import { AppContext } from "../../../Context";
import GetFormattedDate from "../../../Utilities/FormatDate";

const ModalListItem =(props)=>{
    const [isFollowed, setFollowingState] = useState(false);
    const {uid, userName, avatarUrl, date , browseUser} = props;
    const {changeModalState, receivedData, handleFollowing} = useContext(AppContext);
    const notMyItem = receivedData?.uid !== uid;
    useEffect(()=>{
        setFollowingState(receivedData?.following.filter(user  => user.receiverUid === uid)[0] ? true : false);
    },[receivedData?.following]);
    
    return(
        <Auxiliary>
            <div className="modal--user--item flex-row">
                <div className="modal--item--inner flex-row acc-action" >
                   <Avatar src={avatarUrl} alt={userName} />
                    <div className="modal--user--info flex-column" onClick={()=> { notMyItem && browseUser(uid, userName); notMyItem && changeModalState("users", false, "", "")}}>
                        <h3>{userName}</h3>
                        <span><GetFormattedDate date={date?.seconds && date?.seconds} /></span>
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
ModalListItem.propTypes = {
    uid: ProTypes.string.isRequired,
    userName: ProTypes.string.isRequired,
    avatarUrl: ProTypes.string.isRequired,
    date: ProTypes.object,
    browseUser: ProTypes.func.isRequired
}
export default withBrowseUser(ModalListItem);