import React, { useEffect } from "react";
import Auxiliary from "../../Components/HOC/Auxiliary";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../Config/firebase";
import PropTypes from "prop-types";
import FollowRequestsList from "../../Components/FollowRequestsList/FollowRequestsList";
import NotificationPeriods from "../../Components/Header/Notifications/NotificationPeriods/NotificationPeriods";
const MobileNotifications = (props) => {
  const  [, loading ] = useAuthState(auth);
  const {
    changeMainState,
    receivedData,
  } = props.context;
  useEffect(() => {
    changeMainState("currentPage", "Notifications");
  }, []);
  return (
    <Auxiliary>
      {!loading ? (
        <div className="mob--notifications--container noti--popup--inner desktop-comp">
          <div className="mob--noti--title">
            <h4>Activity</h4>
          </div>
          <FollowRequestsList />
          {receivedData?.notifications?.list.length >= 1 ? (
            <NotificationPeriods list={receivedData?.notifications?.list}/>
          ) : (
            <div>
              <h4 style={{ textAlign: "center" }}>
                No notifications available right now
              </h4>
            </div>
          )}
        </div>
      ) : (
        <h3>Loading...</h3>
      )}
    </Auxiliary>
  );
};

MobileNotifications.propTypes = {
  context: PropTypes.object.isRequired
}
export default MobileNotifications;
