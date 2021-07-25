import React, { Fragment, useContext } from "react";
import { AppContext } from "../../Context";
import ModalListItem from "./ModalListItem/ModalListItem";
import * as Consts from "../../Utilities/Consts";
import { BsPersonPlus } from "react-icons/bs";
const UsersModal =()=>{
    const { changeModalState, modalsState, usersModalList } = useContext(AppContext);
    let renderedModal;
    switch(usersModalList?.type){
        
        case Consts.FOLLOWERS:
           renderedModal =  usersModalList?.list && usersModalList?.list.map((user, i) =>{
                    return (user && user?.senderUid) && (
                        <ModalListItem key={user?.senderUid + i} uid={user?.senderUid} userName={user?.senderName} avatarUrl={user?.senderAvatarUrl} isVerified={user?.isVerified || false} date={(user?.date ? user?.date : {})} type={usersModalList?.type}/>
                    )
                })
        break;
        case Consts.FOLLOWING:
            renderedModal = usersModalList?.list && usersModalList?.list.map((user, i) =>{
                           return (user && user?.receiverUid) && (
                                <ModalListItem key={user?.receiverUid + i} uid={user?.receiverUid} userName={user?.receiverName} avatarUrl={user?.receiverAvatarUrl} isVerified={user?.isVerified || false} date={(user?.date ? user?.date : {})} type={usersModalList?.type}/>
                            )
                })
        break;
        case Consts.LIKES:
              renderedModal = usersModalList?.list && usersModalList?.list.map((user, i) =>{
                           return (user && user?.id) && (
                                <ModalListItem key={user?.id + i} uid ={user?.id} userName={user?.userName} avatarUrl={user?.userAvatarUrl} date={(user?.date ? user?.date : {}) } isVerified={user?.isVerified || false} type={usersModalList?.type}/>
                            )
                })
        break;
        case Consts.MUTUALFRIENDS:
            renderedModal = usersModalList?.list && usersModalList?.list.map((user, i ) => {
                   return (user && user?.receiverUid) && (
                        <ModalListItem key={user?.receiverUid + i} uid ={user?.receiverUid} userName={user?.receiverName} avatarUrl={user?.receiverAvatarUrl} isVerified={user?.isVerified || false} date={(user?.date ? user?.date : {})} type={usersModalList?.type}/>
                   )
            })
        break;
        case Consts.NEWUSERS:
            renderedModal = usersModalList?.list && usersModalList?.list.map((user, i ) => {
                   return (user && user?.uid) && (
                        <ModalListItem key={user?.uid + i} uid ={user?.uid} userName={user?.userName} avatarUrl={user?.userAvatarUrl} isVerified={user?.isVerified || false} date={user?.profileInfo?.accountCreationDate || {}} type={usersModalList?.type}/>
                    )
            })
        break;
        case Consts.BIRTHDAYS:
            renderedModal = usersModalList?.list && usersModalList?.list.map((user, i ) => {
                   return (user && user?.uid) && (
                        <ModalListItem key={user?.uid + i} uid ={user?.uid} userName={user?.userName} avatarUrl={user?.userAvatarUrl} isVerified={user?.isVerified || false} date={user?.profileInfo?.birthday || {}} type={usersModalList?.type}/>
                    )
            })
        break;
        default: 
        renderedModal =  usersModalList?.list.map((user, i) =>{
           return (user && user?.senderUid) && (
                <ModalListItem key={user?.senderUid + i} uid={user?.senderUid} userName={user?.senderName} avatarUrl={user?.senderAvatarUrl} isVerified={user?.isVerified || false} date={(user?.date ? user?.date : {} )} type={usersModalList?.type}/>
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
                    <div className="usersModal--inner flex-column modalShow">
                        <div className="usersModal--card">
                            <div className="userModal--card--header flex-row">
                                    <h1>{usersModalList?.type}</h1>
                                    <h4 className="userModal__close" onClick={()=> changeModalState("users",false,"", "")}>&times;</h4>
                            </div>
                            <div className="userModal--card--body">
                                    {
                                        usersModalList?.list.length >=1 ?
                                            renderedModal
                                        :
                                        <div className="empty--card">
                                                <BsPersonPlus />
                                            {
                                                usersModalList?.type === Consts.FOLLOWERS ?
                                                <div>
                                                     <h2>People who follow this user</h2>
                                                     <h4>Once somebody follows this user, you'll see them here</h4>
                                                </div>
                                                :  usersModalList?.type === Consts.FOLLOWING ?
                                                <div>
                                                     <h2>People who have been followed by this user</h2>
                                                     <h4>Once this person follow people, they will appear here</h4>
                                                </div>
                                                :  usersModalList?.type === Consts.LIKES ?
                                                <div>
                                                     <h2>People who likes this</h2>
                                                     <h4>Once people likes this, you'll see them here</h4>
                                                </div>
                                                 :  usersModalList?.type === Consts.MUTUALFRIENDS ?
                                                 <div>
                                                      <h2>People who likes this</h2>
                                                      <h4>Once this use has similar friends, you'll see them here</h4>
                                                 </div>
                                                 : 
                                                 <div>
                                                    <h2>No users available</h2>
                                                </div>
                                            }
                                            
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