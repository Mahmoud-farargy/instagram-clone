import React, { memo, useState, useEffect } from "react";
import PropTypes from "prop-types";
import SuggestItem from "../SuggestItem/SuggestItem";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";

const HomeSuggList = (props) => {
  const [randNum, setRandNum] = useState(0);
  const { suggestionsList, loadingState, receivedData, onlineList } = props;
  useEffect(() => {
    setRandNum(Math.floor(Math.random() * suggestionsList?.length - 6));
  }, [suggestionsList]);

  if (receivedData && (Object.keys(receivedData).length > 0) && (suggestionsList.length) >= 1 && !loadingState) {
    return (
      <div className="suggestions--home--container">
        <div className="suggestions--header flex-row">
          <h6>Suggestions For you</h6>
          <Link to="/explore/people">
            <button className="user__see__all__btn">See all</button>
          </Link>
        </div>
        <div className="suggestions--list flex-column">
          <ul className="flex-column">
            {suggestionsList &&
              suggestionsList.length > 0 &&
              Array.from(new Set(suggestionsList.map((item) => item.uid)))
                .map((id) => suggestionsList.find((el) => el.uid === id))
                .filter((item) => item?.uid !== receivedData?.uid)
                .slice(randNum, suggestionsList?.length - 1)
                .slice(0, 5)
                .map((user, i) => {
                  return (
                    user &&
                    Object.keys(user).length > 0 && (
                      <SuggestItem
                        key={i}
                        userName={user?.userName}
                        isVerified={user?.isVerified}
                        userUid={user?.uid}
                        userAvatarUrl={user?.userAvatarUrl}
                        creationDate={
                          user?.profileInfo?.accountCreationDate
                            ? user?.profileInfo?.accountCreationDate
                            : ""
                        }
                        followers={user?.followers}
                        isOnline={onlineList?.some((c) => c.uid === user?.uid)}
                        user={user}
                        receivedData={receivedData}
                        loadingState={loadingState}
                      />
                    )
                  );
                })}
          </ul>
        </div>
      </div>
    );
  } else if (loadingState) {
    return (
      <div className="suggestions--home--container">
        <div className="suggestions--list">
          {Array.from({ length: 5 }, (_, i) => (
            <li key={i} className="suggestion--item flex-row mb-3">
              <div className="side--user--info flex-row">
                <Skeleton count={1} circle={true} width={32} height={32} />
                <span className="flex-column ml-2">
                  <Skeleton count={1} width={80} height={13} />
                  <Skeleton count={1} width={150} height={13} />
                </span>
              </div>
              <Skeleton count={1} width={39} height={13} />
            </li>
          ))}
        </div>
      </div>
    );
  } else {
    return (
      <div className="empty--box flex-column">
        <h4>No suggestions available.</h4>
      </div>
    );
  }
};
HomeSuggList.propTypes = {
  suggestionsList: PropTypes.array.isRequired,
  loadingState: PropTypes.bool.isRequired,
  receivedData: PropTypes.object.isRequired,
  onlineList: PropTypes.array.isRequired,
};
export default memo(HomeSuggList);
