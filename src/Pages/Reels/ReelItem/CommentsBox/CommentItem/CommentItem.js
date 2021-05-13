import React, {Fragment} from "react";
import TruncateMarkup from "react-truncate";
import PropTypes from "prop-types";
import { withBrowseUser } from "../../../../../Components/HOC/withBrowseUser";
import GetFormattedDate from "../../../../../Utilities/FormatDate";
import { Avatar } from "@material-ui/core";
import { trimText } from "../../../../../Utilities/TrimText";

const CommentItem = (props) => {
    const {comment, browseUser} = props;
    return (
        <Fragment>
            <div className="reel--comment--item">
                <div className="post--comment--item">
               <div className="flex-row post--comment--row">
                {comment?.userAvatarUrl && <Avatar className="comment__user__avatar" loading="lazy" src={comment?.userAvatarUrl} alt={comment?.userName}/>}
                <span onClick={() => browseUser( comment?.uid, comment?.userName )} title={comment?.userName} className="post__top__comment">
                       <p className="comment__text"><strong>{comment?.userName}</strong>
                          <TruncateMarkup className="w-100" line={1} ellipsis="...">{trimText(comment?.comment, 600)}</TruncateMarkup>
                          </p>
                </span>   

               </div>
              
               <div className="post--comment--actions flex-row">
                  {
                      comment?.postDate &&
                        <span><GetFormattedDate date={comment?.postDate?.seconds} ago /></span>
                  } 
                    {/* {
                        comment?.uid === uid && (<span style={{cursor:"pointer"}} className="ml-1" onClick={() => deleteComment("comment", comment?.uid, comment?.postId, comment?.commentId ,postIndex,commentIndex,null, null, postOwnerId, posts, notiArr)}>Delete</span>)
                    }                              */}
               </div>
                    
               </div>
            </div>
        </Fragment>
    )
}
CommentItem.propTypes = {
    comment: PropTypes.object.isRequired,
    browseUser: PropTypes.func.isRequired
}
export default withBrowseUser(CommentItem);