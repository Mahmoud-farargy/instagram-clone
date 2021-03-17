import React, {Fragment, useContext} from "react";
import {AppContext} from "../../Context";
import ModalListItem from "./ModalListItem/ModalListItem";

const UsersModal =(props)=>{
    const {handleUsersModal,openUsersModal, usersModalList, receivedData, handleFollowing, getUsersProfile} = useContext(AppContext);
    let output;
    switch(usersModalList?.type){
        
        case "followers":
           output =  usersModalList?.list.map((user, i) =>{
                    return(
                        <ModalListItem key={user?.senderUid + i} uid={user?.senderUid} userName={user?.senderName} avatarUrl={user?.senderAvatarUrl} date={user?.date} receivedData={receivedData} handleFollowing={handleFollowing} getUsersProfile={getUsersProfile} handleUsersModal={handleUsersModal}/>
                    )
                })
        break;
        case "following":
            output = usersModalList?.list.map((user, i) =>{
                            return(
                                <ModalListItem key={user?.receiverUid + i} uid={user?.receiverUid} userName={user?.receiverName} avatarUrl={user?.receiverAvatarUrl} date={user?.date} receivedData={receivedData} handleFollowing={handleFollowing} getUsersProfile={getUsersProfile} handleUsersModal={handleUsersModal}/>
                            )
                })
        break;
        case "likes":
              output = usersModalList?.list.map((user, i) =>{
                            return(
                                <ModalListItem key={user?.id + i} uid ={user?.id} userName={user?.userName} avatarUrl={user?.userAvatarUrl} date={""}  receivedData={receivedData} handleFollowing={handleFollowing} getUsersProfile={getUsersProfile} handleUsersModal={handleUsersModal}/>
                            )
                })
        break;
        default: 
        output =  usersModalList?.list.map((user, i) =>{
            return(
                <ModalListItem key={user?.senderUid + i} uid={user?.senderUid} userName={user?.senderName} avatarUrl={user?.senderAvatarUrl} date={user?.date} receivedData={receivedData} handleFollowing={handleFollowing} getUsersProfile={getUsersProfile} handleUsersModal={handleUsersModal}/>
            )
        });
    }
    return(
        <Fragment>
            <section>
          {
              openUsersModal ?
                <div
                className="usersModal--container flex-column">
                    <div className="usersModal--inner flex-column">
                        <div style={{
                                transform: openUsersModal ? "translate(0)" : "translate(-150%)"
                            }} className="usersModal--card">
                            <div className="userModal--card--header flex-row">
                                    <h1>{usersModalList?.type}</h1>
                                    <h4 className="userModal__close" onClick={()=> handleUsersModal(false,"", "")}>&times;</h4>
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
            <div style={{
                        opacity: openUsersModal ? "1" : "0",
                        display: openUsersModal ? "block" : "none",
                        transition:"all 0.4s ease",
                    }} className="backdrop " onClick={()=> handleUsersModal(false,"")}>    
            </div>
            </section>
        </Fragment>
    )
}
export default UsersModal;