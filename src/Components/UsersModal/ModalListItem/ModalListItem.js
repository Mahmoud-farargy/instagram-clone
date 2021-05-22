import React, { useContext } from "react";
import Auxiliary from "../../HOC/Auxiliary";
import { Avatar } from "@material-ui/core";
import ProTypes from "prop-types";
import { withBrowseUser } from "../../../Components/HOC/withBrowseUser";
import { AppContext } from "../../../Context";
import GetFormattedDate from "../../../Utilities/FormatDate";
import FollowUnfollowBtn from "../../../Components/FollowUnfollowBtn/FollowUnfollowBtn";
import { trimText } from "../../../Utilities/TrimText";
import { GoVerified } from "react-icons/go";

const ModalListItem =(props)=>{
    const {uid, userName, avatarUrl, date, isVerified , browseUser} = props;
    const {changeModalState, receivedData} = useContext(AppContext);
    const notMyItem = receivedData?.uid !== uid;
    return(
        <Auxiliary>
            <div className="modal--user--item flex-row">
                <div className="modal--item--inner flex-row acc-action clickable" >
                   <Avatar src={avatarUrl} alt={userName} />
                    <div className="modal--user--info flex-column" onClick={()=> { notMyItem && browseUser(uid, userName); notMyItem && changeModalState("users", false, "", "")}}>
                        <h3 className="flex-row trim__txt">{trimText(userName, 20)}{isVerified && (
                      <GoVerified className="verified_icon" />
                    ) }</h3>
                        
                        <span><GetFormattedDate date={date?.seconds && date?.seconds} /></span>
                    </div> 
                </div>
              {
                  uid !== receivedData.uid ?
                    <FollowUnfollowBtn shape="secondary" userData={{userId: uid, uName: userName,uAvatarUrl: avatarUrl, isVerified}} />
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