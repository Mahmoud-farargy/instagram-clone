import React, { useState, memo } from "react";
import Comment from "../../../Components/Comment/Comment";
import PropTypes from "prop-types";

const Comments = (props) => {
    const { areCommentsDisabled,
            comments,
            handleLikingComments,
            postOwnerId,
            onCommentDeletion,
            contentType,
            likes,
            userAvatar,
            userId,
            myName,
            changeModalState,
            contentURL,
            postIndex,
            postId,
            replayFunc,
            updateHomePost,
            handleHomePostLoading
        } = props;
    const [ showFullComments, setShowingFullComments] = useState(false);
    if(!areCommentsDisabled){
        return (comments?.length >= 1 ? (
                <div>
                {comments?.length > 2 ? (
                    <h5
                    className="post__comments__count mt-1"
                    onClick={() =>
                        setShowingFullComments(!showFullComments)
                    }
                    >
                    {" "}
                    {!showFullComments
                        ? "View all"
                        : "Hide most of the "}{" "}
                    {comments.length.toLocaleString()} comments
                    </h5>
                ) : (
                    <h5 className="post__comments__count">Comments</h5>
                )}
                
                   {
                    comments?.slice(0,(!showFullComments? 2: comments.length)).map((comment, i) => {
                            return (
                            <Comment
                                key={i}
                                comment={comment}
                                handleLikingComments={handleLikingComments}
                                postOwnerId={postOwnerId}
                                commentIndex={i}
                                replayFunc={replayFunc}
                                postIndex={postIndex}
                                postId={postId}
                                myName={myName}
                                date={comment?.date}
                                likes={likes}
                                userAvatar={userAvatar}
                                contentType={contentType}
                                contentURL={contentURL}
                                changeModalState={changeModalState}
                                uid={userId}
                                handleHomePostLoading={handleHomePostLoading}
                                updateHomePost={updateHomePost}
                                deleteComment={onCommentDeletion}
                            />
                            );
                        })
                    }
                </div>
            ) : null)
        }else{
         return (<span className="disabled__comments">
            Comments are disabled.
        </span>)
       }
}
Comments.propTypes= {
        areCommentsDisabled: PropTypes.bool.isRequired,
        comments: PropTypes.array.isRequired,
        handleLikingComments: PropTypes.func.isRequired,
        postOwnerId: PropTypes.string.isRequired,
        onCommentDeletion: PropTypes.func.isRequired,
        contentType: PropTypes.string.isRequired,
        likes: PropTypes.object.isRequired,
        userAvatar: PropTypes.string.isRequired,
        userId: PropTypes.string.isRequired,
        myName: PropTypes.string.isRequired,
        changeModalState: PropTypes.func.isRequired,
        contentURL: PropTypes.string.isRequired,
        postIndex: PropTypes.number.isRequired,
        replayFunc: PropTypes.func.isRequired,
        handleHomePostLoading: PropTypes.func,
        updateHomePost: PropTypes.func,
        deleteComment: PropTypes.func
}
export default memo(Comments);