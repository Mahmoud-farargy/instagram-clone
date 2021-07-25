import React, { Fragment, memo } from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";
const GetFormattedDate = ({date,...args}) => {
    return (
       
        <Fragment>
            {
                // (new Date().getTime() - 8009900) <= (date * 1000) ?
                <Moment {...args} withTitle fromNow>{new Date(date * 1000).toISOString()}</Moment>
                // :
                // <small>{new Date(date * 1000).toDateString()}</small>
            }
            
           
        </Fragment>
    )
}
GetFormattedDate.propTypes = {
    date: PropTypes.number.isRequired
}
export default memo(GetFormattedDate);