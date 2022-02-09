import React, {PureComponent} from "react";
import Auxiliary from "../HOC/Auxiliary";
import Comment from "../Comment/Comment";
import { connect } from "react-redux";
import * as Consts from "../../Utilities/Consts";
import * as actionTypes from "../../Store/actions/actions";

class CommentsModal extends PureComponent{
    constructor(props){
        super(props);
        this.inputField = React.createRef();
        this.autoScroll = React.createRef();
        this.state={
            insertedComment: "",
            replayData: {}
        }
    }
    replayFunc(postOwnerName,commentIndex, postIndex, postId, postOwnerId, senderUid, commentId){
        if(this.inputField.current){
             this.inputField.current.focus();
        }
        this.setState({
            ...this.state,
            replayData: {postOwnerName,commentIndex, postIndex, postId, postOwnerId, senderUid, commentId},
            insertedComment: `@${postOwnerName} `
        })
    }
    submitComment(v){
        v.preventDefault();
        if(this.autoScroll?.scrollIntoView){
            this.autoScroll.scrollIntoView({block: 'center', behavior:"smooth"});
        }
        const {usersProfileData , handleSubmittingComments , handleSubComments,  currentPostIndex, uid, receivedData} = this.props.context;
        let postsData = usersProfileData?.posts;
        if(postsData){
            const {id, postOwnerId, contentURL, contentType} = postsData[currentPostIndex?.index];
            if(this.state.insertedComment !== ""){//subcomment
                 if( this.state.replayData !== {}   && /^[@]/.test(this.state.insertedComment)){
                 handleSubComments(this.state.replayData, this.state.insertedComment, receivedData?.userAvatarUrl, false, contentURL, contentType);
                }else{//comment
                    handleSubmittingComments(uid, receivedData?.userName, this.state.insertedComment, receivedData?.userAvatarUrl, id, postOwnerId, contentURL, contentType);
                }
                this.setState({
                    insertedComment: "",
                    replayData: {}
                }) 
            } 
        }
         
    }
    render(){
        const {context, changeModalState, modalsState} = this.props;
        const {handleLikingComments, receivedData, uid, usersProfileData,currentPostIndex, onCommentDeletion} = context;
        if(usersProfileData?.posts){
            var {contentType, contentURL, comments, likes, postOwnerId} = usersProfileData?.posts[currentPostIndex?.index];
        }

        return(
            <Auxiliary>
                <section>            
            {
                modalsState?.comments ?
                <div id="commentsModal" className="comments--modal--container flex-column">
                    
                    <div className="comments--modal--header">
                            <h4>Comments</h4>
                            <span className="comments__close__modal" onClick={()=> changeModalState("comments", false)}>&times;</span>
                    </div>  
                    <div className="comments--modal--card">
                        <div  className="comments--modal--inner" style={{
                                        transform: modalsState?.comments ? "translate(0)" : "translate(-150vw)"
                                    }} >
                            {
                                comments?.map((comment, i) =>{
                                    return(
                                        <Comment key={(i)}
                                        comment={comment}
                                        handleLikingComments={handleLikingComments}
                                        postOwnerId={postOwnerId}
                                        commentIndex={i}
                                        date={comment?.date}
                                        replayFunc={this.replayFunc.bind(this)}
                                        postIndex={currentPostIndex.index}
                                        myName={receivedData?.userName}
                                        likes={likes}
                                        userAvatar={receivedData?.userAvatarUrl}
                                        uid={uid}
                                        contentType= {contentType}
                                        contentURL= {contentURL}
                                        deleteComment={onCommentDeletion}
                                        />
                                    )
                                })
                            }

                        </div>
                        <form onSubmit={(e)=> this.submitComment(e)} className="post--bottom--comment--adding flex-row">
                                <input ref={this.inputField} value={this.state.insertedComment} onChange={(event)=> this.setState({insertedComment: event.target.value})} className="post__bottom__input" type="text" placeholder="Add a commment.." spellCheck="true" />
                                <button type="submit" disabled={this.state.insertedComment.length <  1} className={this.state.insertedComment.length >=1 ? "post__bottom__button" :"disabled post__bottom__button" }>Post</button>
                        </form>
                        <span ref={(el)=> this.autoScroll = el}></span>
                    </div>
                </div>
                : null
            }               
            </section>
            </Auxiliary>
        )
    }
}
const mapDispatchToProps = dispatch => {
    return {
        changeModalState: (modalType, hasDataList, usersList, usersType) => dispatch({type: actionTypes.CHANGE_MODAL_STATE, payload: {modalType, hasDataList, usersList, usersType}})
    }
}
const mapStateToProps = state => {
    return {
        modalsState: state[Consts.reducers.MODALS].modalsState
    }
  }
export default connect(mapStateToProps, mapDispatchToProps)(CommentsModal);