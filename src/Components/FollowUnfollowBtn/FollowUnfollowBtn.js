import React, { Fragment, useState, useContext, useEffect, memo } from "react";
import { VscLoading } from "react-icons/vsc";
import { AppContext } from "../../Context";
import { FaUserCheck } from "react-icons/fa";
import PropTypes from "prop-types";

const FollowUnfollowBtn = ({shape, userData}) => {
    const {userId, uName,uAvatarUrl, isVerified = false} = userData;
    const {receivedData, handleFollowing} = useContext(AppContext);
    const [isFollowLoading, setFollowLoad] = useState(false);
    const isFollower = receivedData?.followers && receivedData?.followers?.some((item) => item?.senderUid === userId );
    const isFollowRequested = receivedData?.followRequests?.sent?.some(d => d.uid === userId);
    const isFollowed = receivedData?.following?.some((item) => item?.receiverUid === userId);
    let tOut;
    const onFollowing = ( state, senderUid, senderUserName, senderUserAvatarUrl, k ) => {
        k.stopPropagation();
        setFollowLoad(true);
        handleFollowing(state, senderUid, senderUserName, senderUserAvatarUrl,(isVerified || false), receivedData?.uid,receivedData?.userName, receivedData?.userAvatarUrl)
        .then(() =>{
          tOut = setTimeout(() => {
              setFollowLoad(false);
              window.clearTimeout(tOut);
          },700);
        }).catch(() => {
          tOut = setTimeout(() => {
              setFollowLoad(false);
              window.clearTimeout(tOut);
          },700);
        });
      };
    useEffect(() =>{
      return () => {
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
            conditionalClass = `font-weight-bold option__modal__btn ${isFollowed ? "text-danger" : "text-primary"}`;
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
            );;
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
    shape: PropTypes.string.isRequired
}
export default memo(FollowUnfollowBtn);