import React from "react";
import PropTypes from "prop-types";
import { Avatar } from "@material-ui/core";
import { withBrowseUser } from "../../../Components/HOC/withBrowseUser";
const SuggList = (props) => {
    const {item, receivedData, setSuggestionsBox, handleFollowing, browseUser} = props;
    const closeBoxAndRedirect = ( ) => {
      browseUser(item?.uid, item?.userName);
      setSuggestionsBox(false);
    }
    return (
        <>
                <li className="suggestion--item flex-column">
                            <div className="suggestion--item-inner">
                              <Avatar
                                loading="lazy"
                                onClick={() => closeBoxAndRedirect()}
                                src={item?.userAvatarUrl}
                                alt={item?.userName}
                                className="mb-2"
                              />
                              <span
                                onClick={() => closeBoxAndRedirect()}
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
    handleFollowing: PropTypes.func,
    browseUser: PropTypes.func,

}
export default withBrowseUser(SuggList);