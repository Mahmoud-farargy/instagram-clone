import React, { useState } from "react";
import { MdContentCopy } from "react-icons/md";

const ShareLinkBox = ({link}) => {
    const [isLinkCopied, setLinkCopyingState] = useState(false);
    const copyLink = (linkToCopy) => {
        if (!linkToCopy) {
            return;
        }
        navigator.clipboard.writeText(linkToCopy);
        setLinkCopyingState(true);
    }
    return (
        <div className="link--container flex-row" title="Copy App Link to Clipboard" onClick={() => copyLink(link)}>
        <span className="link__url">{link}</span>
        {isLinkCopied ?
            <strong className="fadeEffect">Copied</strong>
            :
            <button className="link__copy__icon"><MdContentCopy /></button>

        }
    </div>
    )
}
export default ShareLinkBox;