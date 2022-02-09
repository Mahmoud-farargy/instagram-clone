import React, { Fragment, useState, useContext, useEffect, memo, useRef } from "react";
import { VscLoading } from "react-icons/vsc";
import { AppContext } from "../../Context";
import { FaUserCheck } from "react-icons/fa";
import { connect } from "react-redux";
import * as actionTypes from "../../Store/actions/actions";
import PropTypes from "prop-types";

const FollowUnfollowBtn = ({shape, userData, confirmed = false, isRequestAuthorized= false, changeModalState, isFollowUnfollowModal = false}) => {
    const {userId, uName,uAvatarUrl, isVerified = false} = userData;
    const {receivedData, handleFollowing, handleUnfollowingUsers } = useContext(AppContext);
    const [isFollowLoading, setFollowLoad] = useState(false);
    const isFollower = receivedData?.followers && receivedData?.followers?.some((item) => item?.senderUid === userId );
    const isFollowRequested = receivedData?.followRequests?.sent?.some(d => d.uid === userId);
    const isFollowed = receivedData?.following?.some((item) => item?.receiverUid === userId);
    const _isMounted = useRef(true);
    let tOut;
    const onFollowing = ( state, senderUid, senderUserName, senderUserAvatarUrl, k ) => {
        k.stopPropagation();
        setFollowLoad(true);
        confirmed && changeModalState("unfollow", false);
        handleFollowing(state, senderUid, senderUserName, senderUserAvatarUrl,(isVerified || false), receivedData?.uid,receivedData?.userName, receivedData?.userAvatarUrl, confirmed, isRequestAuthorized)
        .then(() =>{
          if(_isMounted?.current){
            isFollowUnfollowModal && handleUnfollowingUsers({user: {}, state: false});
            tOut = setTimeout(() => {
                setFollowLoad(false);
                window.clearTimeout(tOut);
            },500);
          }
        }).catch(() => {
          if(_isMounted?.current){
            tOut = setTimeout(() => {
                setFollowLoad(false);
                window.clearTimeout(tOut);
            },500);
          }
        });
      };
    useEffect(() =>{
      return () => {
        _isMounted.current = false;
        window.clearTimeout(tOut);
      }
    },[tOut]);
    let conditionalClass = "";
    let conditionalText = "";
    switch (shape){
        case "primary":
            conditionalClass = `profile__btn
            ${((!isFollowed && isFollowRequested && !isFollowLoading) || isFollowed) ?
                "prof__btn__unfollowed"
                :
                !isFollowed &&
            "primary__btn"
            }`;
            conditionalText = ( isFollowLoading ?
                <VscLoading className="rotate mx-3 follow__loading__ico" />
                :
                (!isFollowed && isFollowRequested && !isFollowLoading)?
                "requested"
                :
                (!isFollowed && isFollower  && !isFollowLoading)
                ? "follow back"
                : (!isFollowed && !isFollower && !isFollowLoading)
                ? "follow"
                : (isFollowed && !isFollowLoading) ?
                <FaUserCheck className="mx-3" />
                : null
            );
        break;
        case "secondary":
            conditionalClass = `profile__btn
            ${((!isFollowed && isFollowRequested && !isFollowLoading) || isFollowed) ?
                "prof__btn__unfollowed"
                :
                !isFollowed &&
            "primary__btn"
            }`;
            conditionalText = ( isFollowLoading ?
                <VscLoading className="rotate mx-3 follow__loading__ico" />
                :
                (!isFollowed && isFollowRequested && !isFollowLoading)?
                "requested"
                :
                (!isFollowed && isFollower  && !isFollowLoading)
                ? "follow back"
                : (!isFollowed && !isFollower && !isFollowLoading)
                ? "follow"
                : (isFollowed && !isFollowLoading) ?
                  "unfollow"
                : null
            );
        break;
        case "tertiary":
            conditionalClass = ` ${((!isFollowed && isFollowRequested && !isFollowLoading) || isFollowed) ?  "txt_unfollow" : !isFollowed && "txt_follow"}`;
            conditionalText = (
                isFollowLoading ?
                <VscLoading className="rotate mx-3 follow__loading__ico" />
              :
                (!isFollowed && isFollowRequested && !isFollowLoading)?
                "Requested"
              : (!isFollowed && !isFollowRequested && !isFollowLoading)
              ? "Follow"
              : (isFollowed && !isFollowLoading) ?
                "Unfollow"
              : null
            );
        break;
        case "quaternary":
            conditionalClass = `font-weight-bold option__modal__btn ${(isFollowed || (isFollowRequested && confirmed))  ? "text-danger" : "text-primary"}`;
            conditionalText = (
                isFollowLoading ?
                <VscLoading className="rotate mx-3 follow__loading__ico" />
              :
                (!isFollowed && isFollowRequested && !isFollowLoading && !confirmed)?
                "Requested"
              : (!isFollowed && !isFollowRequested && !isFollowLoading)
              ? "Follow"
              : ((isFollowed && !isFollowLoading) || (isFollowRequested && !isFollowLoading && confirmed)) ?
                "Unfollow"
              : null
            );
        break;
        default:
          conditionalClass = `profile__btn
          ${((!isFollowed && isFollowRequested && !isFollowLoading) || isFollowed) ?
              "prof__btn__unfollowed"
              :
              !isFollowed &&
          "primary__btn"
          }`;
          conditionalText = ( isFollowLoading ?
              <VscLoading className="rotate mx-3 follow__loading__ico" />
              :
              (!isFollowed && isFollowRequested && !isFollowLoading)?
              "requested"
              :
              (!isFollowed && isFollower  && !isFollowLoading)
              ? "follow back"
              : (!isFollowed && !isFollower && !isFollowLoading)
              ? "follow"
              : (isFollowed && !isFollowLoading) ?
                "unfollow"
              : null
          );
    }
    return (
        <Fragment>
                    <button
                        disabled={!userId || isFollowLoading}
                        onClick={(k) => onFollowing(
                            ((!isFollowed && isFollowRequested && !isFollowLoading) || (!isFollowLoading && isFollowed)),
                            userId,
                            uName,
                            uAvatarUrl,
                            k
                            )}
                        className={`
                            ${conditionalClass}
                            ${(!userId || isFollowLoading) && "disabled"}
                        `}
                        >
                        {" "}
                        {conditionalText}
                    </button>
        </Fragment>
    )
}
FollowUnfollowBtn.propTypes = {
    userData: PropTypes.object.isRequired,
    shape: PropTypes.string.isRequired,
    changeModalState: PropTypes.func.isRequired,
    confirmed: PropTypes.bool,
    isFollowUnfollowModal: PropTypes.bool,
}
FollowUnfollowBtn.defaultTypes = {
  shape: "",
  userData: {},
  confirmed:false,
  isRequestAuthorized: false,
  isFollowUnfollowModal: false
}
const mapDispatchToProps = dispatch => {
  return {
      changeModalState: (modalType, hasDataList, usersList, usersType) => dispatch({type: actionTypes.CHANGE_MODAL_STATE, payload: {modalType, hasDataList, usersList, usersType}})
  }
}
export default connect(null, mapDispatchToProps)(memo(FollowUnfollowBtn));