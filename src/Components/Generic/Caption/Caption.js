import React, { useState } from "react";
import Auxiliary from "../../HOC/Auxiliary";
import PropTypes from "prop-types";
import { trimText } from "../../../Utilities/TrimText";
import { linkifyText } from "../../../Utilities/ReplaceHashes";

const Caption = ({ caption, userName = "", isFullCaption = false }) => {
  const [viewFullCaption, setViewFullCap] = useState(isFullCaption || false);
  return (
    <Auxiliary>
      <span className="post__caption flex-row">
        {userName && <strong>{userName}</strong>}
        {!viewFullCaption ? (
          <p
            style={{ cursor: "pointer" }}
            onClick={() => setViewFullCap(true)}
            dangerouslySetInnerHTML={{
              __html: trimText(linkifyText(caption), 350)
            }}
          />
        ) : (
            <p
              className="article__post"
              dangerouslySetInnerHTML={{ __html: linkifyText(caption) }}
            />
          )}
      </span>
    </Auxiliary>
  );
};
Caption.propTypes = {
  caption: PropTypes.string,
  userName: PropTypes.string.isRequired,
  isFullCaption: PropTypes.bool
};
export default Caption;
