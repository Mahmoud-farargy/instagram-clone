import React, {useEffect, useState, useContext} from "react";
import Auxiliary from "../../HOC/Auxiliary";
import {Avatar} from "@material-ui/core";
import ProTypes from "prop-types";
import { withBrowseUser } from "../../../Components/HOC/withBrowseUser";
import { AppContext } from "../../../Context";

const ModalListItem =(props)=>{
    const [isFollowed, setFollowingState] = useState(false);
    const {uid, userName, avatarUrl, date , browseUser} = props;
    const {changeModalState, receivedData, handleFollowing} = useContext(AppContext);
    useEffect(()=>{
        setFollowingState(receivedData?.following.filter(user  => user.receiverUid === uid)[0] ? true : false);
    },[receivedData?.following]);
    
    return(
        <Auxiliary>
            <div className="modal--user--item flex-row">
                <div className="modal--item--inner flex-row acc-action" >
                   <Avatar src={avatarUrl} alt={userName} />
                    <div className="modal--user--info flex-column" onClick={()=> {browseUser(uid, userName); changeModalState("users", false, "", "")}}>
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
ModalListItem.propTypes = {
    uid: ProTypes.string.isRequired,
    userName: ProTypes.string.isRequired,
    avatarUrl: ProTypes.string.isRequired,
    date: ProTypes.object,
    receivedData: ProTypes.object.isRequired,
    handleFollowing: ProTypes.func.isRequired,
    browseUser: ProTypes.func.isRequired
}
export default withBrowseUser(ModalListItem);