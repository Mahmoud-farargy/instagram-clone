import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { linkifyText } from "../../Utilities/ReplaceHashes";
import { trimText } from "../../Utilities/TrimText";

const TweetContent = ({text, doubleClickEvent}) => {
    const alteredTxt = typeof text === "string" ? (`${text.charAt(0).toUpperCase()}${text.slice(1)}`) : "";
    return (
        <Fragment>
            <div lang="en" dir="auto" className="tweet__text" onClick={() => typeof doubleClickEvent === "function" && doubleClickEvent()}>
                <span dangerouslySetInnerHTML={{__html: linkifyText(trimText(alteredTxt, 283))}} />
            </div>

        </Fragment>
    )
};
TweetContent.propTypes = {
    text: PropTypes.string.isRequired,
    doubleClickEvent: PropTypes.func.isRequired
}
export default TweetContent;