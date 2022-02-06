import React, {Fragment} from 'react';
import {Avatar} from "@material-ui/core";
import GetFormattedDate from "../../../../Utilities/FormatDate";
import { withBrowseUser } from "../../../../Components/HOC/withBrowseUser";

function BlockedItem(props) {
    const {item, userblockingFunc, browseUser } = props;
    const onUnblock = (uid, userName) => {
        userblockingFunc( false, uid, userName )
    }
    const directToUser = () => {
        browseUser( item?.blockedUid, item?.userName );
    }
    return (
        <Fragment>
            <li className="block__li flex-row">
                <div className="flex-row" style={{cursor: "pointer"}} onClick={() => directToUser()}>
                    <Avatar className="mr-2" src={item?.userAvatarUrl} alt={item?.userName} title={item?.userName} />
                    <div className="blocked--user--info flex-column">
                        <h3 className="blocked__name">{item?.userName}</h3>
                        {item?.profileName ? <h5 className="blocked__profile__name">{item?.profileName}</h5>: item?.date?.seconds ? <GetFormattedDate date={item?.date.seconds} /> : null}
                    </div>
                    
                </div>
                <button className="profile__btn primary__btn px-2" onClick={() => onUnblock(item?.blockedUid, item?.userName)}>
                    Unblock
                </button>
            </li>
        </Fragment>
    )
}

export default withBrowseUser(BlockedItem);