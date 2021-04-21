import React, {Fragment} from "react";
import {Avatar} from "@material-ui/core";
import {GoVerified} from "react-icons/go";
import PropTypes from "prop-types";
import { withBrowseUser } from "../HOC/withBrowseUser";

const SuggestItem =(props)=>{
    const {userName, isVerified, userUid, userAvatarUrl, browseUser , handleFollowing, receivedData} = props;

    return(
        <Fragment>
            <div className="suggest--item--container">
                <li className="suggestion--item flex-row">
                    <div onClick={()=> browseUser(userUid, userName )} title={userName} className="side--user--info flex-row">
                        <Avatar src={userAvatarUrl} alt={userName} title={userName}/>
                        <span className="flex-column">
                              <h5 className="flex-row">{userName}{isVerified ?  <span><GoVerified className="verified_icon"/></span> : null} </h5>  
                              <small>Suggested for you</small>  
                        </span>
                                                      
                    </div>
                    <button className={receivedData?.following && receivedData?.following?.length > 0 && receivedData?.following?.some(item => item.receiverUid === userUid) ? "txt_unfollow mt-2": "txt_follow  mt-2"} color="primary" onClick={()=> handleFollowing(receivedData?.following && receivedData?.following?.length > 0 && receivedData?.following?.some(item => item?.receiverUid === userUid), userUid, userName, userAvatarUrl, receivedData?.uid, receivedData?.userName, receivedData?.userAvatarUrl)}>{receivedData?.following && receivedData?.following?.length > 0 && receivedData?.following?.some(item => item?.receiverUid === userUid) ?  "Following": "Follow"}</button>
                </li> 
            </div>
        </Fragment>
    )
}
SuggestItem.propTypes = {
    receivedData: PropTypes.object.isRequired,
    userName:PropTypes.string.isRequired,
    isVerified: PropTypes.bool.isRequired,
    userUid: PropTypes.string.isRequired,
    handleFollowing: PropTypes.func.isRequired
}
export default withBrowseUser(SuggestItem);