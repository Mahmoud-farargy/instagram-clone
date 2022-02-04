import React, { useContext } from "react";
import { AppContext } from "../../../../../Context";
import NotificationOutput from "../../../../../Components/NotificationsOutput/NotificationsOutput";
import "./NotificationPeriod.scss";
import PropTypes from "prop-types";

const NotificationPeriod = ({list = [], title= ""}) => {
    const {receivedData,
        igVideoImg,
        igAudioImg,
        changeMainState} = useContext(AppContext);
    return list && list.length > 0 &&(
      <div className="noti__period">
        <h3 className="noti__period__title">{title}</h3>
            {list
            ?.slice(0, 250)
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
      </div>
       

    )
}
NotificationPeriod.propTypes = {
    list: PropTypes.array.isRequired,
    title: PropTypes.string
}
export default NotificationPeriod;