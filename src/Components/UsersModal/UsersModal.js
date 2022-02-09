import React, { Fragment, memo } from "react";
import ModalListItem from "./ModalListItem/ModalListItem";
import * as Consts from "../../Utilities/Consts";
import { BsPersonPlus } from "react-icons/bs";
import { connect } from "react-redux";
import * as actionTypes from "../../Store/actions/actions";

const UsersModal = ({changeModalState, usersModalList, modalsState}) => {
    const renderList = () => {
        if(usersModalList?.type){
            switch (usersModalList.type) {
                case Consts.FOLLOWERS:
                   return usersModalList.list.map((user, i) => ((user?.senderUid) && <ModalListItem key={user?.senderUid + i} uid={user?.senderUid} userName={user?.senderName} avatarUrl={user?.senderAvatarUrl} isVerified={user?.isVerified || false} date={(user?.date ? user?.date : {})} type={usersModalList?.type} />));
                case Consts.FOLLOWING:
                   return usersModalList.list.map((user, i) => ((user?.receiverUid) &&<ModalListItem key={user?.receiverUid + i} uid={user?.receiverUid} userName={user?.receiverName} avatarUrl={user?.receiverAvatarUrl} isVerified={user?.isVerified || false} date={(user?.date ? user?.date : {})} type={usersModalList?.type} />));
                case Consts.LIKES:
                   return usersModalList.list.map((user, i) => ((user?.id) && <ModalListItem key={user?.id + i} uid={user?.id} userName={user?.userName} avatarUrl={user?.userAvatarUrl} date={(user?.date ? user?.date : {})} isVerified={user?.isVerified || false} type={usersModalList?.type} />));
                case Consts.MUTUALFRIENDS:
                   return usersModalList.list.map((user, i) => ((user?.receiverUid) &&<ModalListItem key={user?.receiverUid + i} uid={user?.receiverUid} userName={user?.receiverName} avatarUrl={user?.receiverAvatarUrl} isVerified={user?.isVerified || false} date={(user?.date ? user?.date : {})} type={usersModalList?.type} />));
                case Consts.NEWUSERS:
                   return usersModalList.list.map((user, i) => ((user?.uid) &&<ModalListItem key={user?.uid + i} uid={user?.uid} userName={user?.userName} avatarUrl={user?.userAvatarUrl} isVerified={user?.isVerified || false} date={user?.profileInfo?.accountCreationDate || {}} type={usersModalList?.type} />));
                case Consts.BIRTHDAYS:
                   return usersModalList.list.map((user, i) => ((user?.uid) && <ModalListItem key={user?.uid + i} uid={user?.uid} userName={user?.userName} avatarUrl={user?.userAvatarUrl} isVerified={user?.isVerified || false} date={user?.profileInfo?.birthday || {}} type={usersModalList?.type} />));
                default:
                   return usersModalList.list.map((user, i) => (user?.uid) && (<ModalListItem key={user?.senderUid + i} uid={user?.senderUid} userName={user?.senderName} avatarUrl={user?.senderAvatarUrl} isVerified={user?.isVerified || false} date={(user?.date ? user?.date : {})} type={usersModalList?.type} />));
            } 
        }
    };

    return (
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
                                        <h4 className="userModal__close" onClick={() => changeModalState("users", false, "", "")}>&times;</h4>
                                    </div>
                                    <div className="userModal--card--body">
                                        {
                                            usersModalList?.list?.length >= 1 ?
                                                renderList()
                                                :
                                                <div className="empty--card">
                                                    <BsPersonPlus />
                                                    {
                                                        usersModalList?.type === Consts.FOLLOWERS ?
                                                            <div>
                                                                <h2>People who follow this user</h2>
                                                                <h4>Once somebody follows this user, you'll see them here</h4>
                                                            </div>
                                                            : usersModalList?.type === Consts.FOLLOWING ?
                                                                <div>
                                                                    <h2>People who have been followed by this user</h2>
                                                                    <h4>Once this person follow people, they will appear here</h4>
                                                                </div>
                                                                : usersModalList?.type === Consts.LIKES ?
                                                                    <div>
                                                                        <h2>People who likes this</h2>
                                                                        <h4>Once people likes this, you'll see them here</h4>
                                                                    </div>
                                                                    : usersModalList?.type === Consts.MUTUALFRIENDS ?
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
const mapDispatchToProps = dispatch => {
    return {
        changeModalState: (modalType, hasDataList, usersList, usersType) => dispatch({type: actionTypes.CHANGE_MODAL_STATE, payload: {modalType, hasDataList, usersList, usersType}})
    }
}
const mapStateToProps = state => {
    return {
        usersModalList: state[Consts.reducers.MODALS].usersModalList,
        modalsState: state[Consts.reducers.MODALS].modalsState
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(memo(UsersModal));