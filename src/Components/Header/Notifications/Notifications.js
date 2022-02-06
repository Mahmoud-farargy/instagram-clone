import React, { useState, useEffect, useContext, useRef } from "react";
import { AppContext } from "../../../Context";
import { BsFillHeartFill } from "react-icons/bs";
import { auth } from "../../../Config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Skeleton from "react-loading-skeleton";
import FollowRequestsList from "../../../Components/FollowRequestsList/FollowRequestsList";
import NotificationPeriods from "./NotificationPeriods/NotificationPeriods";

const Notifications = ({ closeNotificationOnClick }) => {
  const {
    receivedData,
  } = useContext(AppContext);
  const [isLoading, setLoading] = useState(true);
  const [, loading] = useAuthState(auth);
  const _isMounted = useRef(true);
  useEffect(() => {
    if (_isMounted?.current) {
     var timeout = setTimeout(() => {
        setLoading(false);
        window.clearTimeout(timeout);
      }, 200);
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
            <NotificationPeriods list={receivedData?.notifications?.list} closeNotificationOnClick={closeNotificationOnClick} />
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
export default Notifications;
