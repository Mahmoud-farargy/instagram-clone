import React, { useState, Fragment,  useEffect, useRef } from "react";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import * as Consts from "../../Utilities/Consts";
import { withBrowseUser } from "../../Components/HOC/withBrowseUser";
import GetFormattedDate from "../../Utilities/FormatDate";
import { Avatar } from "@material-ui/core";
import { trimText } from "../../Utilities/TrimText";
import { linkifyText } from "../../Utilities/ReplaceHashes";
import { connect } from "react-redux";
import * as actionTypes from "../../Store/actions/actions";
import PropTypes from "prop-types";

const Commment =(props)=>{
    var { changeModalState, comment, replayFunc, postIndex , postId,commentIndex , handleLikingComments, postOwnerId, myName, uid, userAvatar, contentURL, contentType, deleteComment, browseUser, updateHomePost, handleHomePostLoading } = props;
    const _isMounted = useRef(true);
    const [viewSubComments, setSubComments] = useState(false); 
    const [postLiked, setPostLiked] = useState(false);
    useEffect(()=>{
        setPostLiked(comment?.likes.some(el => el.id === uid));
    },[comment, uid]);
    useEffect(() => () => _isMounted.current = false,[]);
    const directTo = () => {
        browseUser( comment?.uid, comment?.userName ).then(() =>{
            if(_isMounted.current){
                changeModalState("users", false, "", "");
            }
        });
    }
    const funcValidator = (func, ...args) => {
        return typeof func === "function" && func(...args);
    }
    const likeComment = ({...rest}) => {
        const isMyPost = postOwnerId === uid;
        !isMyPost && funcValidator(handleHomePostLoading, true);
        handleLikingComments({...rest}).then(() => {
            if(_isMounted.current){
                !isMyPost && funcValidator(updateHomePost,{uid: postOwnerId, postID: postId});
            }
        }).catch(() => {
            if(_isMounted.current){
                !isMyPost && funcValidator(handleHomePostLoading, false);
            }
        });
    }   

    const delComment = ({...rest}) => {
        const isMyPost = postOwnerId === uid;
        !isMyPost && funcValidator(handleHomePostLoading, true);
        deleteComment({...rest}).then(() => {
            if(_isMounted.current){
                !isMyPost && funcValidator(updateHomePost,{uid: postOwnerId, postID: postId});
            }
        }).catch(() => {
            if(_isMounted.current){
                !isMyPost && funcValidator(handleHomePostLoading, false);
            }
        });
    }  
    return(
        <Fragment>
        <div className="post--comment--item">
                {/* COMMENTS */}
               <div className="flex-row post--comment--row">
                { <Avatar className="comment__user__avatar" loading="lazy" src={comment?.userAvatarUrl} alt={comment?.userName}/>}
                <span  title={comment?.userName} className="post__top__comment">
                      <p className="comment__text"> <strong onClick={() => directTo()}>{trimText(comment?.userName, 19)}</strong> 
                          <span dangerouslySetInnerHTML={{
                            __html: trimText(linkifyText(comment?.comment), 600),
                            }} ></span>
                      </p>
                </span>   

                   {
                       !postLiked ?
                       <span onClick={()=>  likeComment({type:"comment",bool:true, postIndex, postId, postOwnerId,userName: myName,  userAvatarUrl: userAvatar, myId: uid, commentIndex,commentText: comment?.comment, contentURL, contentType, comment, subComment : []})}
                           ><FiHeart/></span>
                       :
                           <span onClick={()=>  likeComment({type:"comment",bool:false, postIndex, postId, postOwnerId,userName: myName,  userAvatarUrl: userAvatar, myId: uid, commentIndex,commentText: comment?.comment, contentURL, contentType, comment, subComment: []})} 
                               style={{
                                   animation: "boundHeart 0.5s forwards ease"
                               }}
                           className="liked__heart"><FaHeart/></span>
                   }  
               </div>
              
               <div className="post--comment--actions flex-row">
                  {
                      comment?.postDate &&
                        <span><GetFormattedDate date={comment?.postDate?.seconds} ago /></span>
                  } 
                      {
                          comment.likes?.length >=1 ?
                             <span className="acc-action clickable" onClick={()=> changeModalState("users",true, comment?.likes, Consts.LIKES)}>{comment.likes?.length.toLocaleString()} {comment.likes?.length > 1 ? "likes" : "like"}</span>
                          : null
                      }
                       <span style={{cursor:"pointer"}} onClick={()=> {replayFunc(comment?.userName, commentIndex , postIndex, comment?.postId , comment?.ownerId, uid, comment?.commentId); setSubComments(true)}}> Replay</span>      
                    {
                        comment?.uid === uid && (<span style={{cursor:"pointer"}} className="ml-1" onClick={() => delComment({type: "comment", ownerUid: comment?.uid, postId: comment?.postId , commentArr: comment, postIndex, commentIndex, postOwnerId})}>Delete</span>)
                    }
               </div>
               {/* SUBCOMMENTS */}
                    {
                        comment.subComments?.length >=1 ?
                        <div>
                           <span className="post__view__replies__btn" onClick={()=> setSubComments( !viewSubComments)}> <small className="long__dash"></small> {viewSubComments ? "Hide": "View"} replies ({comment.subComments?.length})</span>
                             {
                                 viewSubComments ?
                                       <ul className="sub--comments--nav">
                                               {
                                                   comment && comment.subComments.length > 0 && comment.subComments?.map( (subComment, i )=>{
                                                       return(
                                                        <li
                                                            key={i} className="post--comment--item">
                                                            <div className="flex-row post--comment--row">
                                                            {<Avatar className="comment__user__avatar" loading="lazy" src={subComment?.userAvatarUrl} alt={subComment?.senderName}/>}
                                                                <div title={subComment?.senderName} className="post__top__comment flex-column">
                                                                    <strong onClick={() => browseUser( subComment?.senderUid, subComment?.senderName )} >{trimText(subComment?.senderName, 19)}</strong>
                                                                    <span dangerouslySetInnerHTML={{
                                                                    __html: trimText(linkifyText(subComment?.commentText), 600),
                                                                    }} ></span>
                                                                </div>
                                                                {
                                                                    !subComment?.likes?.some(el => el.id === uid) ?
                                                                    <span onClick={()=> likeComment({type:"subComment",bool: true, postId, postIndex, postOwnerId, userName: myName,userAvatarUrl: userAvatar, myId: uid, commentIndex, commentText: subComment?.commentText, contentURL, contentType,subCommentIndex: i, subComment: subComment,comment})}
                                                                        ><FiHeart/></span>
                                                                    :
                                                                        <span onClick={()=> likeComment({type:"subComment",bool: false, postId, postIndex, postOwnerId, userName: myName,userAvatarUrl: userAvatar, myId: uid, commentIndex, commentText: subComment?.commentText, contentURL, contentType,subCommentIndex: i, subComment: subComment,comment})}
                                                                            style={{
                                                                                animation: "boundHeart 0.5s forwards ease"
                                                                            }}
                                                                        className="liked__heart"><FaHeart/></span>
                                                                }  
                                                            </div>
                                                            <div className="post--comment--actions flex-row"> 
                                                                    {
                                                                        subComment?.date &&
                                                                            <span><GetFormattedDate date={subComment?.date?.seconds} ago /></span>
                                                                    } 
                                                                    {
                                                                        subComment?.likes?.length >=1 ?
                                                                            <span className="acc-action clickable" onClick={()=> changeModalState("users",true, subComment?.likes, Consts.LIKES)}>{subComment?.likes?.length.toLocaleString()} {subComment?.likes?.length > 1 ? "likes" : "like"}</span>
                                                                        : null
                                                                    } 
                                                                    <span style={{cursor:"pointer"}} onClick={()=> {replayFunc(subComment?.senderName, commentIndex , postIndex, comment?.postId , comment?.ownerId, uid, comment?.commentId); setSubComments(true)}}> Replay</span>      
                                                                    {
                                                                        subComment?.senderUid === uid && (<span style={{cursor:"pointer"}} className="ml-1" onClick={() => delComment({type: "subComment", ownerUid: subComment?.senderUid, commentArr: comment ,postIndex, postId: comment?.postId , commentIndex,  subCommentArr:subComment, subCommentIndex: i, postOwnerId})}>Delete</span>)
                                                                    }
                                                            </div>
                                                        </li>
                                                    )
                                                   })
                                               }
                                       </ul>
                                   : null
                             }  
                       </div>
                       : null
                    }   
                    
               </div>
        </Fragment>
    )
};
Comment.propTypes = {
    comment: PropTypes.object.isRequired,
    replayFunc: PropTypes.func.isRequired,
    postIndex: PropTypes.number.isRequired,
    postId: PropTypes.string.isRequired,
    commentIndex: PropTypes.number.isRequired,
    handleLikingComments: PropTypes.func.isRequired,
    postOwnerId: PropTypes.string.isRequired,
    myName: PropTypes.string.isRequired,
    uid: PropTypes.string.isRequired,
    userAvatar: PropTypes.string.isRequired,
    changeModalState: PropTypes.func.isRequired,
    contentURL: PropTypes.string.isRequired,
    contentType: PropTypes.string.isRequired,
    deleteComment: PropTypes.func.isRequired,
    browseUser: PropTypes.func.isRequired,
    updateHomePost: PropTypes.func,
    handleHomePostLoading: PropTypes.func
}
const mapDispatchToProps = dispatch => {
    return {
        changeModalState: (modalType, hasDataList, usersList, usersType) => dispatch({type: actionTypes.CHANGE_MODAL_STATE, payload: {modalType, hasDataList, usersList, usersType}})
    }
}
export default connect(null, mapDispatchToProps)(withBrowseUser(Commment));