import React, { Fragment, memo } from "react";
import {Avatar} from "@material-ui/core";
import {GoVerified} from "react-icons/go";
import PropTypes from "prop-types";
import { withBrowseUser } from "../HOC/withBrowseUser";
import Skeleton from "react-loading-skeleton";
import FollowUnfollowBtn from "../../Components/FollowUnfollowBtn/FollowUnfollowBtn";
import { trimText } from "../../Utilities/TrimText";
import { withinPeriod } from "../../Utilities/WithinPeriod";
import UserNameComp from "../../Components/UserName/UserName";

const SuggestItem =(props)=>{
    const { userName, isVerified, userUid, userAvatarUrl, browseUser, creationDate, followers, isOnline, user, loadingState, receivedData } = props;
    const mutuals = receivedData?.following && receivedData?.following?.length > 0 && receivedData?.following?.filter(el => el.receiverUid !== receivedData?.uid && followers?.sort((a,b) => b?.date?.seconds -  a?.date?.seconds).some(item => item?.senderUid === el?.receiverUid)).slice(0,1);

    return(
        <Fragment>
            <>
               {
                // SKELETON
                loadingState ?
                <li className="suggestion--item flex-row mb-3">
                    <div className="side--user--info flex-row">
                        <Skeleton count={1} circle={true} width={32} height={32} />
                        <span className="flex-column ml-2">
                             <Skeleton count={1} width={80} height={13} />
                             <Skeleton count={1} width={150} height={13} />
                        </span>
                    </div>
                    <Skeleton count={1} width={39} height={13} />
                </li>
                :
                // LOADED CONTENT
                <li className="suggestion--item flex-row">
                    <div onClick={()=> browseUser(userUid, userName)} className="side--user--info flex-row">
                        <Avatar src={userAvatarUrl} alt={userName} title={userName}/>
                        <span className="flex-column">
                            <span className="flex-row side--user--name">
                                <UserNameComp user={user}  />
                                {isVerified ?  <span><GoVerified className="verified_icon"/></span> : null} 
                                { isOnline && <span className="online__user"></span>}
                            </span>
                            <small>{ //if account creation's date is less than 2 weeks
                            (creationDate && (withinPeriod({date: creationDate?.seconds, period: 1209600000 }))) ? "New to Voxgram"
                            : mutuals?.length > 0 ?
                                (<span className="flex-row trim__txt" title={mutuals[0]?.receiverName}> 
                                        {trimText(`followed by ${mutuals[0]?.receiverName}`,20)}
                                </span>)
                            : "Suggested for you"
                            }</small>
                        </span>                       
                    </div>
                    <FollowUnfollowBtn shape="tertiary" userData={{userId: userUid, uName: userName,uAvatarUrl: userAvatarUrl, isVerified: isVerified}}/>
                </li> 
               } 
            </>
        </Fragment>
    )
}
SuggestItem.propTypes = {
    userName:PropTypes.string.isRequired,
    isVerified: PropTypes.bool.isRequired,
    userUid: PropTypes.string.isRequired,
    followers: PropTypes.array.isRequired,
    isOnline: PropTypes.bool,
    loadingState: PropTypes.bool.isRequired,
    creationDate: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string
    ])
}
export default withBrowseUser(memo(SuggestItem));