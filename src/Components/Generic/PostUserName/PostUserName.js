import React, { memo, useEffect, useRef } from 'react';
import { withBrowseUser } from '../../HOC/withBrowseUser';
import { GoVerified } from "react-icons/go";
import { trimText } from '../../../Utilities/TrimText';

function PostUserName({ changeModalState, browseUser, isVerified, postOwnerId, userName }) {
    const _isMounted = useRef(true);
    useEffect(() => () => _isMounted.current = false,[]);
    const directTo = () => {
        browseUser( postOwnerId, userName ).then(() => {
            if(_isMounted?.current){
                changeModalState("users", false, "", "");
            }
          })
    }
    return (
        <span tabIndex="0" aria-disabled="false" role="button" aria-label="Visit user page">
            <h5 className="flex-row">
            <span
                title={userName}
                onClick={() => directTo()}
                style={{
                whiteSpace: "nowrap",
                wordBreak: "keep-all",
                display: "flex",
                flexWrap: "nowrap",
                }}
            >
                <span line={1} ellipsis="...">
                {trimText(userName, 24)}
                </span>
                {isVerified ? (
                <GoVerified className="verified_icon" />
                ) : null}{" "}
            </span>
            </h5>
        </span>
    )
}
export default withBrowseUser(memo(PostUserName));