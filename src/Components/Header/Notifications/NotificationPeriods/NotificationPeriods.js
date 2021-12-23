import React, { Fragment } from "react";
import { withinPeriod } from "../../../../Utilities/WithinPeriod";
import NotificationPeriod from "./NotificationPeriod/NotificationPeriod";
import PropTypes from "prop-types";

const NotificationPeriods = ({list = [],closeNotificationOnClick}) => {
    const today = list?.filter(noti => (withinPeriod({ date: noti?.date?.seconds, period: 86400000})));
    const yesterday = list?.filter(noti => (withinPeriod({ date: noti?.date?.seconds, period: 172800000, min: 86400000 })));
    const thisWeek = list?.filter(noti => (withinPeriod({ date: noti?.date?.seconds, period: 604800016, min: 172800000 })));
    const thisMonth = list?.filter(noti => (withinPeriod({ date: noti?.date?.seconds, period: 2629800000, min: 604800016 })));
    const earlier = list?.filter(noti => (withinPeriod({ date: noti?.date?.seconds, min:2629800000 })));
    return(
        <Fragment>
            <div onClick={(s) => closeNotificationOnClick && closeNotificationOnClick(s)}>
            <ul
              
              className="noti--popup--ul flex-column"
            >
            {today && today?.length > 0 && <NotificationPeriod list={today} title="Today" />}
            {yesterday  && yesterday?.length > 0 && <NotificationPeriod list={yesterday} title="Yesterday" />}
            {thisWeek && thisWeek?.length > 0 && <NotificationPeriod list={thisWeek} title="This Week" />}
            {thisMonth && thisMonth?.length > 0 && <NotificationPeriod list={thisMonth} title="This Month" />}
            {earlier && earlier?.length > 0 && <NotificationPeriod list={earlier} title="Earlier" />}
            </ul>
            </div>
        </Fragment>
    )
};
NotificationPeriods.propTypes = {
    list: PropTypes.array,
    closeNotificationOnClick: PropTypes.func
}

export default NotificationPeriods;