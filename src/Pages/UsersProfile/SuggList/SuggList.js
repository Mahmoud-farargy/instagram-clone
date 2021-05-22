import React from "react";
import PropTypes from "prop-types";
import { Avatar } from "@material-ui/core";
import { withBrowseUser } from "../../../Components/HOC/withBrowseUser";
import FollowUnfollowBtn from "../../../Components/FollowUnfollowBtn/FollowUnfollowBtn";
import { GoVerified } from "react-icons/go";
import { trimText } from "../../../Utilities/TrimText";

const SuggList = (props) => {
    const {item, setSuggestionsBox, browseUser} = props;
    const closeBoxAndRedirect = ( ) => {
      browseUser(item?.uid, item?.userName);
      setSuggestionsBox(false);
    }
    return (
        <>
                <li className="suggestion--item flex-column">
                            <div className="suggestion--item-inner">
                              <div className="w-100">
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
                                  className="acc__name trim__txt"
                                >
                                  { trimText(item?.userName, 21)}
                                  {item?.isVerified && (
                                    <GoVerified className="verified_icon" />
                                  )} 
                                </span>
                                <span
                                  className="user__name mb-2"
                                  title={item?.userName}
                                >
                                  {item?.profileInfo?.name}
                                </span>
                              </div>
                               <FollowUnfollowBtn shape="secondary" userData={{userId: item?.uid, uName: item?.userName, uAvatarUrl: item?.userAvatarUrl, isVerified: item?.isVerified}} />
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
    browseUser: PropTypes.func,
}
export default withBrowseUser(SuggList);