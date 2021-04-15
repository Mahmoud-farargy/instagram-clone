import React, {Fragment, useContext} from "react";
import {AppContext} from "../../Context";
import ModalListItem from "./ModalListItem/ModalListItem";

const UsersModal =(props)=>{
    // const { browseUser } = props;
    const {changeModalState,modalsState, usersModalList, receivedData, handleFollowing} = useContext(AppContext);
    let output;
    switch(usersModalList?.type){
        
        case "followers":
           output =  usersModalList?.list.map((user, i) =>{
                    return(
                        <ModalListItem key={user?.senderUid + i} uid={user?.senderUid} userName={user?.senderName} avatarUrl={user?.senderAvatarUrl} date={user?.date} receivedData={receivedData} handleFollowing={handleFollowing}/>
                    )
                })
        break;
        case "following":
            output = usersModalList?.list.map((user, i) =>{
                            return(
                                <ModalListItem key={user?.receiverUid + i} uid={user?.receiverUid} userName={user?.receiverName} avatarUrl={user?.receiverAvatarUrl} date={user?.date} receivedData={receivedData} handleFollowing={handleFollowing}/>
                            )
                })
        break;
        case "likes":
              output = usersModalList?.list.map((user, i) =>{
                            return(
                                <ModalListItem key={user?.id + i} uid ={user?.id} userName={user?.userName} avatarUrl={user?.userAvatarUrl} date={user?.date}  receivedData={receivedData} handleFollowing={handleFollowing}/>
                            )
                })
        break;
        default: 
        output =  usersModalList?.list.map((user, i) =>{
            return(
                <ModalListItem key={user?.senderUid + i} uid={user?.senderUid} userName={user?.senderName} avatarUrl={user?.senderAvatarUrl} date={user?.date} receivedData={receivedData} handleFollowing={handleFollowing}/>
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