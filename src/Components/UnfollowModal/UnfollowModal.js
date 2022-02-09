import React, { Fragment, useContext, useRef, useEffect } from "react";
import { AppContext } from "../../Context";
import "./UnfollowModal.scss";
import OptionsModal from "../../Components/Generic/OptionsModal/OptionsModal";
import FollowUnfollowBtn from "../../Components/FollowUnfollowBtn/FollowUnfollowBtn";
import { Avatar } from "@material-ui/core";

const UserModal = () => {
    const { handleUnfollowingUsers, unfollowModal } = useContext(AppContext);
    const { uid, userName ,userAvatarUrl , isPrivate ,isVerified } = unfollowModal?.user;
    const _isMounted = useRef(true);
    useEffect(() => {
       return () => _isMounted.current = false
    });
    const nameOutput = userName ? ("@" + userName) : "this user";
    const closeModal = () => {
        handleUnfollowingUsers({user: {}, state: false})
    }
    return (
        <Fragment>
            <div id="unfollowWindow">
            (<OptionsModal isUnfollowModal={true} >
                        <div className="uf--box--inner">
                            <div className="uf--img--container flex-column">
                            <Avatar
                            loading="lazy"
                            className="post__header__avatar"
                            src={userAvatarUrl}
                            alt={userName}
                        />
                        </div>
                        <div className="uf--txt--area flex-column">
                            <p>{
                            isPrivate ? `If you change your mind, you'll have to request to follow ${nameOutput} again.` :
                            `Unfollow ${nameOutput}`
                            }</p>
                        </div>
                    </div>
                    <span className="uf--btn">
                        <FollowUnfollowBtn shape="quaternary" userData={{userId: uid, uName: userName, uAvatarUrl: userAvatarUrl, isVerified: isVerified}} confirmed={true} isRequestAuthorized={true} isFollowUnfollowModal={true}/>
                    </span>
                    <span onClick={() => closeModal()}> Cancel </span>
                               
              </OptionsModal>)
                <div
                className="backdrop"
                onClick={() => closeModal()}
                ></div>   
            </div>

        </Fragment>
    )
}

export default UserModal;