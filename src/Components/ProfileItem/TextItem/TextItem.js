import React from 'react';
import { trimText } from "../../../Utilities/TrimText";
import { capFirstLetter } from "../../../Utilities/Utility";

function TextItem({ txt }) {
    return (
        <div className="users__profile__image">
            <div lang="en" dir="auto" className="profile--item--tweet">
                <span>{trimText(capFirstLetter(txt), 150)}</span>
            </div>
        </div>
    )
}

export default TextItem;