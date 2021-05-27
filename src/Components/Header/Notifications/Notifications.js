import React, { useState, useEffect, useContext, useRef } from "react";
import PropTypes from "prop-types";
import { AppContext } from "../../../Context";
import { BsFillHeartFill } from "react-icons/bs";
import NotificationOutput from "../../../Components/NotificationsOutput/NotificationsOutput";
import { auth } from "../../../Config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Skeleton from "react-loading-skeleton";
import FollowRequestsList from "../../../Components/FollowRequestsList/FollowRequestsList";

const Notifications = ({ closeNotificationOnClick }) => {
  const {
    igVideoImg,
    igAudioImg,
    changeMainState,
    receivedData,
  } = useContext(AppContext);
  const [isLoading, setLoading] = useState(true);
  const [, loading] = useAuthState(auth);
  const _isMounted = useRef(true);
  var timeout;
  useEffect(() => {
    if (_isMounted) {
      timeout = setTimeout(() => {
        setLoading(false);
        window.clearTimeout(timeout);
      }, 500);
    }

    return () => {
      setLoading(false);
      window.clearTimeout(timeout);
      _isMounted.current = false;
    };
  }, []);
  return (
    <div>
      {!loading && !isLoading ? (
        <div>
         <FollowRequestsList />
          {receivedData?.notifications?.list.length >= 1 ? (
            <ul
              onClick={(s) => closeNotificationOnClick(s)}
              className="noti--popup--ul flex-column"
            >
              {receivedData?.notifications?.list
                ?.slice(0, 30)
                .sort((a, b) => {
                  return b.date.seconds - a.date.seconds;
                })
                .map((notification, i) => {
                  return (
                    <NotificationOutput
                      key={notification?.notiId}
                      notification={notification}
                      igVideoImg={igVideoImg}
                      myData={receivedData}
                      igAudioImg={igAudioImg}
                      changeMainState={changeMainState}
                      postIndex={i}
                    />
                  );
                })}
            </ul>
          ) : (
            <div className="empty--card">
              <div className="plus--icon--container flex-column">
                <BsFillHeartFill />
              </div>
              <h2>Activity On Your Posts</h2>
              <h4>
                When someone likes or comments on your posts. you'll see them
                here.
              </h4>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-column w-100 p-2">

         {
           Array.from({length: 3},(_,i) =>(
                <div key={i} className="flex-row  w-100 mt-2">
                <Skeleton
                  count={1}
                  circle={true}
                  height={40}
                  width={40}
                  className="mb-4 mr-2"
                />
                <div className="space__between  w-100">
                  <div className="flex-column">
                    <Skeleton count={1} height={14} width={80} />
                    <Skeleton count={1} height={15} width={150} />
                  </div>
                  <Skeleton count={1} height={40} width={40} />
                </div>
              </div>
           ))
         } 
        </div>
      )}
    </div>
  );
};
Notifications.propTypes = {
  closeNotificationOnClick: PropTypes.func.isRequired,
};
export default Notifications;
