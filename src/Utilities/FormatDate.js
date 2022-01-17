import React, { memo } from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";
const GetFormattedDate = ({date = 0,...args}) => {
    return <Moment {...args} withTitle fromNow>{new Date(date * 1000).toISOString()}</Moment>
}
GetFormattedDate.propTypes = {
    date: PropTypes.number.isRequired
}
GetFormattedDate.defaultProps = {
    date: 0
}
export default memo(GetFormattedDate);