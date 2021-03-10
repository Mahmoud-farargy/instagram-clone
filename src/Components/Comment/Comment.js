import React, {useState, Fragment,  useEffect, useRef} from "react";
import TruncateMarkup from "react-truncate";
import {FiHeart} from "react-icons/fi";
import {FaHeart} from "react-icons/fa";

const Commment =(props)=>{
    var {comment, replayFunc, postIndex , commentIndex , handleLikingComments, postOwnerId, myName, uid, userAvatar, handleUsersModal, date,contentURL, contentType} = props;
    const [viewSubComments, setSubComments] = useState(false); 
    const [postLiked, setPostLiked] = useState(false);
    useEffect(()=>{
        // console.log(likes);
        setPostLiked(comment?.likes.filter(el => el.id === uid ? true : false)[0]);
    },[comment?.likes])
    return(
        <Fragment>
        <div className="post--comment--item">
               <div className="flex-row post--comment--row">
                  <span  className="post__top__comment flex-row"><strong>{comment?.userName}</strong> <p className="comment__text w-100"><TruncateMarkup className="w-100" line={1} ellipsis="...">{comment?.comment}</TruncateMarkup></p></span>   

                   {
                       !postLiked ?
                       <span onClick={()=>  handleLikingComments(true, postIndex, postOwnerId, myName, userAvatar, uid, commentIndex, comment?.comment, contentURL, contentType)}
                           ><FiHeart/></span>
                       :
                           <span onClick={()=>  handleLikingComments(false, postIndex , postOwnerId, myName, userAvatar, uid, commentIndex, comment?.comment, contentURL, contentType)} 
                               style={{
                                   animation: "boundHeart 0.5s forwards ease"
                               }}
                           className="liked__heart"><FaHeart/></span>
                   }  
               </div>
              
               <div className="post--comment--actions flex-row">
                       {/* <span style={{whiteSpace:"nowrap"}}><TruncateMarkup line={1} ellipsis="..">{new Date(date.seconds * 1000).toLocaleDateString()}</TruncateMarkup> </span> */}
                      {
                          comment.likes?.length >=1 ?
                             <span className="acc-action" onClick={()=> handleUsersModal(true, comment?.likes, "likes")}>{comment.likes?.length.toLocaleString()} {comment.likes?.length > 1 ? "likes" : "like"}</span>
                          : null
                      } 
                       <span style={{cursor:"pointer"}} onClick={()=> {replayFunc(comment?.userName, commentIndex , postIndex, comment?.postId , comment?.ownerId); setSubComments(true)}}> Replay</span>                                      
               </div>
                    {
                        comment.subComments?.length >=1 ? 
                        <div>
                           <span className="post__view__replies__btn" onClick={()=> setSubComments( !viewSubComments)}> — {viewSubComments ? "Hide": "View"} replies ({comment.subComments?.length})</span>
                             {
                                 viewSubComments ?
                                       <ul className="sub--comments--nav">
                                               {
                                                   comment.subComments?.map( (subComment, i )=>{
                                                       return(<li key={i}><strong>{subComment?.senderName}</strong> <span> {subComment?.commentText}</span></li>)
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
}
export default Commment;