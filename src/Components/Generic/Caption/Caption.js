import React, { useState } from "react";
import Auxiliary from "../../HOC/Auxiliary";
import PropTypes from "prop-types";
import { trimText } from "../../../Utilities/TrimText";

const Caption = ({ caption, userName = "", isFullCaption = false }) => {
  const [viewFullCaption, setViewFullCap] = useState(isFullCaption || false);
  const findNReplaceHash = (txt) => {
    if (caption) {
      return txt.replace(
        /\B(#[a-zA-Z]+\b)(?!;)/g,
        `<span class="hashtag">$1</span>`
      );
    }
  };
  return (
    <Auxiliary>
      <span className="post__caption flex-row">
       {userName && <strong>{userName}</strong>}
        {!viewFullCaption ? (
          <p
            style={{ cursor: "pointer" }}
            onClick={() => setViewFullCap(true)}
            dangerouslySetInnerHTML={{
              __html: trimText(findNReplaceHash(caption), 200),
            }}
          ></p>
        ) : (
          <p
            className="article__post"
            dangerouslySetInnerHTML={{ __html: findNReplaceHash(caption) }}
          ></p>
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
