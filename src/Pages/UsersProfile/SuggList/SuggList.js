import React from "react";
import PropTypes from "prop-types";
import { Avatar } from "@material-ui/core";

const SuggList = (props) => {
    const {item, receivedData, setSuggestionsBox,  getUsersProfile ,notify, history, handleFollowing} = props;
    const browseUser = (specialUid, name) => {
        if(specialUid, name){
              getUsersProfile(specialUid)
          .then(() => {
              setSuggestionsBox(false);
              history.push(`/user-profile/${name}`);
          })
          .catch((err) => {
              notify(
              (err && err.message) || "error has occurred. please try again later!",
              "error"
              );
          }); 
        }
      
    };
    return (
        <>
                <li className="suggestion--item flex-column">
                            <div className="suggestion--item-inner">
                              <Avatar
                                onClick={() =>
                                  browseUser(item?.uid, item?.userName)
                                }
                                src={item?.userAvatarUrl}
                                alt={item?.userName}
                                className="mb-2"
                              />
                              <span
                                onClick={() =>
                                  browseUser(item?.uid, item?.userName)
                                }
                                title={item?.userName}
                                className="acc__name"
                              >
                                {item?.userName}
                              </span>
                              <span
                                className="user__name"
                                title={item?.userName}
                              >
                                {item?.profileInfo?.name}
                              </span>
                              <button
                                className={
                                  receivedData?.following &&
                                  receivedData?.following?.length > 0 &&
                                  receivedData?.following?.some(
                                    (q) => q.receiverUid === item?.uid
                                  )
                                    ? "profile__btn prof__btn__unfollowed"
                                    : "profile__btn prof__btn__followed"
                                }
                                color="primary"
                                onClick={(e) => {
                                  handleFollowing(
                                    receivedData?.following &&
                                      receivedData?.following?.length > 0 &&
                                      receivedData?.following?.some(
                                        (el) => el?.receiverUid === item?.uid
                                      ),
                                    item?.uid,
                                    item?.userName,
                                    item?.userAvatarUrl,
                                    receivedData?.uid,
                                    receivedData?.userName,
                                    receivedData?.userAvatarUrl
                                  ); e.stopPropagation()
                                    }
                                }
                              >
                                {receivedData?.following &&
                                receivedData?.following?.length > 0 &&
                                receivedData?.following?.some(
                                  (user) => user?.receiverUid === item?.uid
                                )
                                  ? "Unfollow"
                                  : "Follow"}
                              </button>
                            </div>
                          </li>
        </>
    )
}

SuggList.propTypes = {
    item: PropTypes.object.isRequired,
    receivedData: PropTypes.object.isRequired,
    setSuggestionsBox:PropTypes.func,
    notify: PropTypes.func,
    history: PropTypes.object,
    handleFollowing: PropTypes.func
}
export default SuggList;