import React, { useRef, useEffect, useContext } from "react";
import Auxiliary from "../../HOC/Auxiliary";
import { Avatar } from "@material-ui/core";
import PropTypes from "prop-types";
import { withBrowseUser } from "../../../Components/HOC/withBrowseUser";
import { AppContext } from "../../../Context";
import GetFormattedDate from "../../../Utilities/FormatDate";
import FollowUnfollowBtn from "../../../Components/FollowUnfollowBtn/FollowUnfollowBtn";
import { trimText } from "../../../Utilities/TrimText";
import { GoVerified } from "react-icons/go";
import * as Consts from "../../../Utilities/Consts";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import * as actionTypes from "../../../Store/actions/actions";

const ModalListItem =(props)=>{
    const {uid, userName, avatarUrl, date, isVerified , browseUser, type, changeModalState} = props;
    const _isMounted = useRef(true);
    useEffect(() => () => _isMounted.current = false, []);
    const { receivedData } = useContext(AppContext);
    const notMyItem = receivedData?.uid !== uid;
    const history = useHistory();
    const directTo = () => {
        if(notMyItem){
            browseUser(uid, userName).then(() => {
                if(_isMounted?.current){
                    changeModalState("users", false, "", "");
                }
            });
        }else{
            history.push("/profile");
            changeModalState("users", false, "", "");
        }
    }
    return(
        <Auxiliary>
            <div className="modal--user--item flex-row">
                <div className="modal--item--inner flex-row acc-action clickable" >
                   <Avatar src={avatarUrl} alt={userName} />
                    <div className="modal--user--info flex-column" onClick={()=> directTo()}>
                        <h3 className="flex-row trim__txt">{trimText(userName, 20)}{isVerified && (
                      <GoVerified className="verified_icon" />
                    ) }</h3>
                        
                        { type === Consts.BIRTHDAYS ? <span>BD: {date}</span> : date?.seconds && <span> {type === Consts.NEWUSERS && "Joined in: "} <GetFormattedDate date={date?.seconds && date?.seconds} /></span>}
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
    uid: PropTypes.string.isRequired,
    userName: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string.isRequired,
    date: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string
    ]),
    browseUser: PropTypes.func.isRequired,
    type: PropTypes.string,
    changeModalState: PropTypes.func.isRequired
}
const mapDispatchToProps = dispatch => {
    return {
        changeModalState: (modalType, hasDataList, usersList, usersType) => dispatch({type: actionTypes.CHANGE_MODAL_STATE, payload: {modalType, hasDataList, usersList, usersType}})
    }
}
export default connect(null, mapDispatchToProps)(withBrowseUser(ModalListItem));