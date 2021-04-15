import React, {Fragment, useContext} from "react";
import {AppContext} from "../../Context";
import ModalListItem from "./ModalListItem/ModalListItem";
import * as Consts from "../../Utilities/Consts";

const UsersModal =(props)=>{
    // const { browseUser } = props;
    const {changeModalState,modalsState, usersModalList} = useContext(AppContext);
    let output;
    switch(usersModalList?.type){
        
        case Consts.FOLLOWERS:
           output =  usersModalList?.list && usersModalList?.list.map((user, i) =>{
                    return(
                        <ModalListItem key={user?.senderUid + i} uid={user?.senderUid} userName={user?.senderName} avatarUrl={user?.senderAvatarUrl} date={user?.date}/>
                    )
                })
        break;
        case Consts.FOLLOWING:
            output = usersModalList?.list && usersModalList?.list.map((user, i) =>{
                            return(
                                <ModalListItem key={user?.receiverUid + i} uid={user?.receiverUid} userName={user?.receiverName} avatarUrl={user?.receiverAvatarUrl} date={user?.date}/>
                            )
                })
        break;
        case Consts.LIKES:
              output = usersModalList?.list && usersModalList?.list.map((user, i) =>{
                            return(
                                <ModalListItem key={user?.id + i} uid ={user?.id} userName={user?.userName} avatarUrl={user?.userAvatarUrl} date={user?.date} />
                            )
                })
        break;
        case Consts.MUTUALFRIENDS:
            output = usersModalList?.list && usersModalList?.list.map((user, i ) => {
                    return(
                        <ModalListItem key={user?.receiverUid + i} uid ={user?.receiverUid} userName={user?.receiverName} avatarUrl={user?.receiverAvatarUrl} date={user?.date ? user?.date : ""} />
                    )
            })
        break;
        default: 
        output =  usersModalList?.list.map((user, i) =>{
            return(
                <ModalListItem key={user?.senderUid + i} uid={user?.senderUid} userName={user?.senderName} avatarUrl={user?.senderAvatarUrl} date={user?.date}/>
            )
        });
    }
    return(
        <Fragment>
            <section>
          {
              modalsState?.users ?
                <div
                className="usersModal--container flex-column">
                    <div className="usersModal--inner flex-column">
                        <div style={{
                                transform: modalsState?.users ? "translate(0)" : "translate(-150%)"
                            }} className="usersModal--card">
                            <div className="userModal--card--header flex-row">
                                    <h1>{usersModalList?.type}</h1>
                                    <h4 className="userModal__close" onClick={()=> changeModalState("users",false,"", "")}>&times;</h4>
                            </div>
                            <div className="userModal--card--body">
                                    {
                                        usersModalList?.list.length >=1 ?
                                            output
                                        :
                                        <div className="useModal--empty--users flex-column">
                                            <h3>No users available</h3>
                                        </div>
                                    }
                            </div>
                        </div>
                    </div>
                </div>
                : null
        }
            </section>
        </Fragment>
    )
}
export default UsersModal;