import React ,{Fragment, PureComponent} from "react";
import "./Post.css";
import {HiDotsHorizontal} from "react-icons/hi";
import {Avatar} from "@material-ui/core";
import TruncateMarkup from "react-truncate";
import {FiHeart, FiSend} from "react-icons/fi";
import {FaHeart} from "react-icons/fa";
import {FaRegComment} from "react-icons/fa";
import {IoMdVideocam} from "react-icons/io";
import {RiBookmarkLine} from "react-icons/ri";  //install react-instagram-embed And @material-ui/lab
import Comment from "../../Components/Comment/Comment";
import {GoVerified} from "react-icons/go";
import {Link} from "react-router-dom";

class Post extends PureComponent{
    constructor(props){
        super(props);
        this.inputField = React.createRef();
        this.state= {
            postLiked: false,
            insertedComment: "",
            btnClicks: 0,
            viewFullCaption: false,
            doubleLikeClicked: false,
            showFullComments: false,
            openOptionsModal: false,
            showInputForm: false,
            replayData: {}
        } 
    }
    // const convertSeconds=(s)=>{            
    //         var sec = s % 60;
    //         var secInMinutes = (s- sec) /60;
    //         var min = secInMinutes %60;
    //         var hr = (secInMinutes - min) /60;
    //          if(sec<10){
    //             return hr + "h" + " " + min + "m" + " "+ 0+sec + "s";
    //          }
    //          return hr + "h" + " "+ min + "m" +" "+ sec + "s";
    // }
    // console.log(new Date(803980830.toDate()));
    componentDidMount(){
        this.likesCheck();
    }
    componentDidUpdate(prevProps){
        if(prevProps.likes !== this.props.likes){
           this.likesCheck();
        }
    }
    likesCheck(){
        var {likes, id} = this.props;             
        this.setState({
                postLiked: likes.people?.some(el => el.id === id )
        }) 
    }
    handleCurrLikes=(boolean)=>{
        const {index, handleMyLikes, id, userName,  userAvatar} = this.props;
        handleMyLikes(boolean, index, id, userName , userAvatar, true);
    }

    doubleClickEvent=()=>{
      let currCount = this.state.btnClicks;
      this.setState(prevState =>({
        btnClicks: prevState.btnClicks +1
      }))
      const resetCounter=()=>{
        this.setState({
           btnClicks: 0
         })
      }
      if(currCount === 1){
        this.handleCurrLikes(true);
         resetCounter();
         this.setState({
             doubleLikeClicked: true
         })
         setTimeout(()=>{
             this.setState({
             doubleLikeClicked: false
         })
         },1100);
        
      }
     setTimeout(()=>{
        resetCounter();
     },1000);
    }

    submitComment(v){
        v.preventDefault();
         const {index, id, userName, userAvatar , handleSubmittingComments, postId, postOwnerId, handleSubComments} = this.props;
         if(this.state.insertedComment !== ""){//sub comment (nested comment)
             if( this.state.replayData !== {} && /^[@]/.test(this.state.insertedComment)){
                 handleSubComments(this.state.replayData, this.state.insertedComment, userAvatar, true);
             }else{ //regular comment
                handleSubmittingComments("mine",index, id, userName, this.state.insertedComment, userAvatar, new Date(), postId, postOwnerId);
                 
             }
             this.setState({
                    insertedComment: "",
                    replayData: {}
            })  
         }  
    }

    replayFunc(postOwnerName,commentIndex, postIndex, postId, postOwnerId){
        this.setState({
            ...this.state,
            showInputForm: true,
            replayData: {postOwnerName, commentIndex, postIndex, postId, postOwnerId},
            insertedComment: `@${postOwnerName} `
        })
        if(this.state.showInputForm){
             this.inputField.current.focus();
        }
    }
    
    render(){

    const {userName,caption, contentType, contentURL,contentName, comments, likes, location, postDate, handleLikingComments, postOwnerId, isVerified , myName, userAvatar, id, handleUsersModal, deletePost, index, postId} = this.props;
        return(
            <Fragment>
                <div id="post" className="post--card--container">
                    <article className="post--card--article">
                            <div className="post--card--header flex-row">
                                <header className="post--header--avatar flex-row">
                                    <Avatar className="post__header__avatar" src="" alt="avatar" />
                                    <div className="post--header--user--info flex-column">
                                        <span tabIndex="0" aria-disabled="false" role="button" >
                                            <h5 className="flex-row" ><Link to={`/profile`} style={{whiteSpace: "nowrap",wordBreak:"keep-all", display:"flex",flexWrap:"nowrap"}} ><TruncateMarkup line={1} ellipsis="...">{userName}</TruncateMarkup>{ isVerified ?  <GoVerified className="verified_icon"/> : null} </Link> </h5>
                                                              
                                        </span>
                                        <span tabIndex="0" aria-disabled="false" role="button">
                                            <p><TruncateMarkup line={1} ellipsis="...">{location}</TruncateMarkup></p>
                                        </span>
                                    
                                    </div>
                                </header>
                                <span className="post--header--options" onClick={()=> this.setState({openOptionsModal: true})}><HiDotsHorizontal/></span>
                            </div>
                            <div className="post--card--body">
                            {
                                contentType === "image" ?
                                <div>
                                    <img  onClick={()=> this.doubleClickEvent()} className="post__card__content" src={contentURL} alt="post" draggable="false" />
                                    {
                                        this.state.doubleLikeClicked ?
                                        <div>
                                       
                                            <div className="liked__double__click__layout"></div>
                                            <span className="liked__double__click" style={{
                                                            animation: this.state.doubleLikeClicked ? "boundHeartOnDouble 0.9s forwards ease" : null
                                                        }}><FaHeart/></span>
                                        </div>
                                        : null
                                    }
                                </div>
                                : contentType === "video" ?
                                <div>
                                  <video onClick={()=> this.doubleClickEvent()} className="post__card__content" src={contentURL} draggable="false" controls /> 
                                  <IoMdVideocam className="video__top__icon"/> 
                                  
                                </div>
                                
                                : null
                            }
                                

                            </div>
                            <div className="post--card--footer flex-column">
                                <div className="post--footer--upper--row flex-row">
                                    <div className=" flex-row">
                                        {
                                            !this.state.postLiked ?
                                            <span onClick={()=> this.handleCurrLikes(true)}
                                                ><FiHeart/></span>
                                            :
                                                <span onClick={()=> this.handleCurrLikes(false)} 
                                                    style={{
                                                        animation: this.state.postLiked ?  "boundHeart 0.5s forwards ease" : null
                                                    }}
                                                className="liked__heart"><FaHeart/></span>
                                        }
                                            <span onClick={()=> this.setState({showInputForm: !this.state.showInputForm})}><FaRegComment/></span>
                                            <span><FiSend/></span>
                                    </div>
                                    <div className="bookmark__icon"><RiBookmarkLine/></div> 
                                </div>
                                {
                                    likes.people?.length >=1 ?
                                    <div className="likes__count" onClick={()=> handleUsersModal(true, likes.people ,"likes" )}>{likes.people?.length.toLocaleString()} { likes.people?.length === 1  ? "like"  : "likes"}</div>
                                    : null
                                }
                                <span className="post__caption flex-row"><strong>{userName}</strong> { !this.state.viewFullCaption ? <p><TruncateMarkup line={4} ellipsis="...more" style={{cursor:"pointer"}} onClick={()=> this.setState({viewFullCaption: true})}>{caption}</TruncateMarkup></p>: <p className="article__post">{caption}</p> }</span>
                                {
                                    comments?.length >=1 ?
                                    <div>
                                        {
                                            comments?.length > 1 ?
                                                <h5 className="post__comments__count" onClick={()=> this.setState({showFullComments: !this.state.showFullComments})}> { !this.state.showFullComments ? "View all" : "Hide most" }  {comments.length.toLocaleString()} comments</h5>
                                            : 
                                                <h5 className="post__comments__count">Comments</h5>
                                        }
                                        {
                                            !this.state.showFullComments ?
                                            comments?.slice(0,2).map((comment, i) =>{
                                                return(
                                                    <Comment key={(i)}
                                                    comment={comment}
                                                    handleLikingComments={handleLikingComments}
                                                    postOwnerId={postOwnerId}
                                                    commentIndex={i}
                                                    replayFunc={this.replayFunc.bind(this)}
                                                    postIndex={this.props.index}
                                                    myName={myName}
                                                    date={comment?.date}
                                                    likes={likes}
                                                    userAvatar={userAvatar}
                                                    contentType={contentType}
                                                    contentURL={contentURL}
                                                    handleUsersModal={handleUsersModal}
                                                    uid={id} />
                                                )
                                            })
                                            : 
                                            comments?.map((comment, i) =>{
                                                return(
                                                    <Comment key={(i)}
                                                    comment={comment}
                                                    handleLikingComments={handleLikingComments}
                                                    postOwnerId={postOwnerId}
                                                    commentIndex={i}
                                                    replayFunc={this.replayFunc.bind(this)}
                                                    postIndex={this.props.index}
                                                    myName={myName}
                                                    date={comment?.date}
                                                    likes={likes}
                                                    userAvatar={userAvatar}
                                                    contentType={contentType}
                                                    contentURL={contentURL}
                                                    handleUsersModal={handleUsersModal}
                                                    uid={id} />
                                                )
                                            })
                                        }
                                       
                                    </div>
                                    : null
                                }
                                
                                <small className="post__date pb-2">{new Date(postDate?.seconds * 1000).toLocaleString()}</small>
                             {
                                 this.state.showInputForm ?
                                 <form onSubmit={(e)=> this.submitComment(e)}  className="post--bottom--comment--adding">
                                    <input ref={this.inputField} value={this.state.insertedComment} onChange={(event)=> this.setState({insertedComment: event.target.value})} className="post__bottom__input" type="text" placeholder="Add a commment.." />
                                    <button type="submit" disabled={this.state.insertedComment.length <  1} className={this.state.insertedComment.length >=1 ? "post__bottom__button" :"disabled post__bottom__button" }>Post</button>
                                </form>
                                : null
                             }   
                            </div>

                    </article>
                    {
                        this.state.openOptionsModal ?
                            <div className="optionsM--container">
                                <div className="optionsM--container--inner flex-column">
                                    <div className="modal--option" onClick={()=> deletePost(postId, index, contentName)}> Delete</div>
                                    <div className="modal--option" onClick={()=> this.setState({openOptionsModal: false})}> Cancel</div>
                                </div>
                            </div>
                        : null
                    }
                    <div style={{
                        opacity: this.state.openOptionsModal ? "1" : "0",
                        display: this.state.openOptionsModal ? "block" : "none",
                        transition:"all 0.4s ease",
                            }} className="backdrop " onClick={()=> this.setState({openOptionsModal: false})}>    
                    </div>
                </div>
            </Fragment>
        ) 
    }
    
}
export default Post;