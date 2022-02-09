import React, { Fragment, useContext, useRef, useEffect, useCallback, memo } from "react";
import PropTypes from "prop-types";
import ProfileItem from "../ProfileItem/ProfileItem";
import { AppContext } from "../../Context";
import { useHistory } from "react-router-dom";
import List from "../Generic/List/List";
import { connect } from "react-redux";
import * as actionTypes from "../../Store/actions/actions";

const ProfilePosts = ({listType = "post", list = [], parentClass = "users--profile--posts", isSavedPost = false, changeModalState,...props }) => {
    const { getUsersProfile, changeMainState, notify, handleSavingPosts, healthyStorageConnection, openReel, isOpeningPost } = useContext(AppContext);
    const history = useHistory();
    // REFS
    const _isMounted = useRef(true);
    const timeouts = useRef(null);
    // ----x---REFS---x-----
    const finalLimit = list?.length || null;

    useEffect(() => () => {
        window.clearTimeout(timeouts?.current);
        _isMounted.current= false;
    }, []);

    const openPost = useCallback(({type, postId, postOwnerId, reelId, groupId , reelUid}) =>{
        if(type === "post"){
                if(postOwnerId && postId){
                    changeMainState("isOpeningPost", true, {usersProfileData: []});
                    getUsersProfile(postOwnerId).then((data) => {
                        if(_isMounted?.current){
                            changeMainState("isOpeningPost", false);
                                const postsCopy = data?.posts;
                                const postIndex = postsCopy?.map(post => post?.id).indexOf(postId);
                                if( postIndex !== -1){                            
                                    if((window.innerWidth || document.documentElement.clientWidth) >= 670){
                                        timeouts.current = setTimeout(() => {
                                            if(_isMounted?.current){
                                                changeMainState("currentPostIndex", { index:postIndex, id: postId });
                                            }
                                        },10)
                                        timeouts.current = setTimeout(() => {
                                            if(_isMounted?.current){
                                                changeModalState("post", true);
                                                window.clearTimeout(timeouts?.current);
                                            }
                                        },200);
                                    }else{
                                        changeMainState("currentPostIndex", { index:postIndex, id: postId });
                                        history.push("/browse-post");
                                    }
                                }else{
                                    notify("An error occurred", "error");
                                }
                        }
                    }).catch(() => {
                        _isMounted.current && changeMainState("isOpeningPost", false);
                    });
                }else{
                    notify("An error occurred", "error");
                }
        }else if(type === "reel"){
            openReel({ reelId, groupId, reelUid }).then(() => {
                if(_isMounted?.current){
                    history.push("/reels");
                }
            });
        }
    },[]);
    const onLoadingFail = useCallback(( postOwnerId, postId ) => {
        //automatically removes elements that have failed to load denoting they don't exist and got removed from the main source
        if( listType?.toLowerCase() === "post" && isSavedPost && healthyStorageConnection && navigator.onLine && postOwnerId && postId){
            getUsersProfile(postOwnerId).then((data) => {
                if(_isMounted?.current){
                    const postsCopy = data?.posts;
                    const postIndex = postsCopy?.map(post => post?.id).indexOf(postId);
                    if(postIndex === -1 ){
                        handleSavingPosts({boolean:false, data: {id: postId}});
                    }
                }
            });
        }
    },[])
    return (
        <Fragment>
           {
               finalLimit > 0 &&
               <section id="profilePosts">
                        <List list={list} parentClass={parentClass} areHomePosts={false} intervalTime={1100} increaseBy={5} parentId="userPosts" >
                            <ProfileItem itemType={listType} isSavedPost={isSavedPost} {...props} onLoadingFail={onLoadingFail} openPost={openPost}/>
                        </List>
                    {isOpeningPost && <div className="global__loading"><span className="global__loading__inner"></span></div>}
                </section>
            } 
           
        </Fragment>
    )
}
ProfilePosts.propTypes = {
    listType: PropTypes.string,
    list: PropTypes.array.isRequired,
    parentClass: PropTypes.string,
    isSavedPost: PropTypes.bool,
    changeModalState: PropTypes.func.isRequired
}
const mapDispatchToProps = dispatch => {
    return {
        changeModalState: (modalType, hasDataList, usersList, usersType) => dispatch({type: actionTypes.CHANGE_MODAL_STATE, payload: {modalType, hasDataList, usersList, usersType}})
    }
}
export default connect(null, mapDispatchToProps)(memo(ProfilePosts));