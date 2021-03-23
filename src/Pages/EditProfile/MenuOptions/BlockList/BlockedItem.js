import React, {Fragment} from 'react';
import {Avatar} from "@material-ui/core";

function BlockedItem(props) {
    const {item, userblockingFunc, notify } = props;
    const onUnblock = (uid, userName) => {
        userblockingFunc( false, uid, userName )
    }
    return (
        <Fragment>
            <li className="block__li flex-row">
                <div className="flex-row">
                    <Avatar className="mr-2" src={item?.userAvatarUrl} alt={item?.userName} title={item?.userName} />
                    <div className="blocked--user--info flex-column">
                        <h3 className="blocked__name">{item?.userName}</h3>
                        <h5 className="blocked__profile__name">{item?.profileInfo}</h5>
                    </div>
                    
                </div>
                <button className="profile__btn prof__btn__followed px-2" onClick={() => onUnblock(item?.blockedUid, item?.userName)}>
                    Unblock
                </button>
            </li>
        </Fragment>
    )
}

export default BlockedItem;