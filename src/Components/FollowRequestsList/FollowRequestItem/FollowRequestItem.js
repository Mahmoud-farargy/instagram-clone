import React from "react";
import Auxiliary from "../../HOC/Auxiliary";
import { Avatar } from "@material-ui/core";
import PropTypes from "prop-types";
// import GetFormattedDate from "../../Utilities/FormatDate";
import { withBrowseUser } from "../../../Components/HOC/withBrowseUser";
import { GoVerified } from "react-icons/go";
const FollowRequestItem =(props)=>{
    const { request, browseUser, handleFollowRequests } = props;
    return(
        <Auxiliary >
            <li className="reuqest-item space__between noti--popup-item">
                    <div className="flex-row noti--row">
                        <div><Avatar className="noti__user__img" src={request?.userAvatarUrl} alt={request?.userName} /></div>
                        <div className="flex-column noti--user--info" onClick={()=> browseUser(request?.uid, request?.userName)}>
                            <h6>{request?.userName} {request?.isVerified && <span><GoVerified className="verified_icon"/></span>}</h6>
                            <p className="noti__text">{request?.name}</p>
                        </div> 
                    </div>
                    
                    <div className="noti--action flex-row">
                            <button disabled={!request?.uid} onClick={()=> handleFollowRequests({type: "confirm",userId: request?.uid,userAvatarUrl: request?.userAvatarUrl ,userName: request?.userName,isVerified: (request?.isVerified || false)})} className="profile__btn primary__btn"> Confirm</button>
                            <button disabled={!request?.uid} onClick={()=> handleFollowRequests({type: "delete",userId: request?.uid,userAvatarUrl: request?.userAvatarUrl , userName: request?.userName,isVerified: (request?.isVerified || false)})} className="profile__btn prof__btn__unfollowed">Delete</button>
                    </div>
                                                            
            </li>
        </Auxiliary>
    )
}
FollowRequestItem.propTypes = {
    request: PropTypes.object.isRequired,
    browseUser: PropTypes.func.isRequired,
    handleFollowRequests: PropTypes.func.isRequired,
}
export default  withBrowseUser(React.memo(FollowRequestItem));