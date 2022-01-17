import React, { Fragment, useContext, useRef, useEffect, useState, useCallback, memo } from "react";
import PropTypes from "prop-types";
import ProfileItem from "../ProfileItem/ProfileItem";
import { AppContext } from "../../Context";
import { useHistory } from "react-router-dom";
import List from "../Generic/List/List";
const ProfilePosts = ({listType = "post", list = [], parentClass = "users--profile--posts", isSavedPost = false, ...props }) => {
    const { getUsersProfile, changeMainState, notify, changeModalState, handleSavingPosts, healthyStorageConnection, openReel } = useContext(AppContext);
    const history = useHistory();
    // REFS
    const _isMounted = useRef(true);
    const timeouts = useRef(null);
    // ----x---REFS---x-----
    // STATE
    const [isLoading, setLoading] = useState({
        loadingMorePosts: false,
        openingPost: false
    });
    // ----x--State---x-----
    const finalLimit = list?.length || null;

    useEffect(() => () => {
        window.clearTimeout(timeouts?.current);
        _isMounted.current= false;
    }, []);

    const openPost = useCallback(({type, postId, postOwnerId, reelId, groupId , reelUid}) =>{
        if(type === "post"){
                if(postOwnerId && postId){
                    setLoading({...isLoading,openingPost: true});
                    getUsersProfile(postOwnerId).then((data) => {
                        if(_isMounted?.current){
                            setLoading({...isLoading,openingPost: false});
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
                        <List list={list} parentClass={parentClass} areHomePosts={false} intervalTime={1100} parentId="userPosts" >
                            <ProfileItem itemType={listType} isSavedPost={isSavedPost} {...props} onLoadingFail={onLoadingFail} openPost={openPost}/>
                        </List>
                    {isLoading?.openingPost && <div className="global__loading"><span className="global__loading__inner"></span></div>}
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
}
export default memo(ProfilePosts);