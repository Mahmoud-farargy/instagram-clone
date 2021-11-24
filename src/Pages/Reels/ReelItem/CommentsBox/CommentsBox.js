import React, {useState, useContext} from "react";
import PropTypes from "prop-types";
import { AppContext } from "../../../../Context";
import CommentItem from "./CommentItem/CommentItem";

const CommentsBox = (props) => {
    const context = useContext(AppContext);
    const {showComments,setComments, item, ownerUid,itemIndex, groupIndex, groupId, userName, userAvatarUrl, itemId } = props;
    const { handleReelsActions, notify } = context;
    const [formState, setForm] = useState({
        insertedComment: ""
    })
    
    const submitComment = (e) => {
        e.preventDefault();
        
        if(formState.insertedComment){
            handleReelsActions("comment",
                { comment: formState.insertedComment, ownerUid, itemIndex, itemId, groupIndex, groupId, userName, userAvatarUrl }
            );
            const timeouts = setTimeout(() => {
                setForm({
                    insertedComment: ""
                })
                window.clearTimeout(timeouts);
            }, 400);
            
        }else{
            notify("The comment field should be filled", "info");
        }
    }

    return (
        <section id="commentsBox">
           
              <div
                onClick={() => setComments(false)}
                className="comments--backdrop"
              ></div>
              <div
                style={{
                  transform: showComments ? "translateY(0)" : "translateY(-100%)",
                  transition: "all 0.5s linear",
                  opacity: showComments ? "1" : "0",
                }}
                className="comments--box--inner"
              >
                <div className="comments--box--header flex-row">
                    <h4>Comments</h4>
                    <span onClick={() => setComments(false)} className="close__comments__box">&times;</span>
                </div>
                {/* commments list */}
                <ul className="reel--comments--ul">
                    {item?.comments && item?.comments.length > 0 ?
                        item?.comments.map((el, i) => (
                        <CommentItem key={el?.commentId + i} comment={el} />
                        ))
                        :
                        <div className="flex-row w-100 h-100 useModal--empty--users">
                             <h5>No comments yet.<br /> Don't be shy and add a comment.</h5>
                        </div>
                    }
                </ul>
                {/* comment form */}
                <form
                  onSubmit={(e) => submitComment(e)}
                  className="post--bottom--comment--adding flex-row"
                  method="post"
                >
                  <input
                    value={formState.insertedComment}
                    onChange={(event) =>
                      setForm({...formState,insertedComment: event.target.value })
                    }
                    className="post__bottom__input"
                    type="text"
                    placeholder="Add a commment.."
                    aria-label="Add a commment.."
                    autoComplete="off"
                    name="add-comment"
                    spellCheck="true"
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={formState.insertedComment.length < 1}
                    className={
                      formState.insertedComment.length >= 1
                        ? "post__bottom__button"
                        : "disabled post__bottom__button"
                    }
                  >
                    Post
                  </button>
                </form>
              </div>
            </section>
    )
}
CommentsBox.propTypes = {
    item: PropTypes.object.isRequired,
    setComments: PropTypes.func.isRequired,
    showComments: PropTypes.bool.isRequired
}
export default CommentsBox;