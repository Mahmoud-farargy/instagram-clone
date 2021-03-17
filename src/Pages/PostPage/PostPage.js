import React ,{Fragment, PureComponent} from "react";
import "../../Components/Post/Post.css";
import {HiDotsHorizontal} from "react-icons/hi";
import {Avatar} from "@material-ui/core";
import TruncateMarkup from "react-truncate";
import {FiHeart, FiSend} from "react-icons/fi";
import {FaHeart} from "react-icons/fa";
import {FaRegComment} from "react-icons/fa";
import {IoMdVideocam} from "react-icons/io";
import {RiBookmarkLine} from "react-icons/ri";
import {AppContext} from "../../Context";
import Comment from "../../Components/Comment/Comment";
import {GoVerified } from "react-icons/go";

class PostPage extends PureComponent{
    static contextType = AppContext;
    constructor(props){
        super(props);
        this.inputField = React.createRef();
        this.state= {
        postLiked: false,
        insertedComment: "",
        currtData: {},
        viewFullCaption: false,
        btnClicks:0,
        doubleLikeClicked: false,
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
        // this.likesCheck();  
         const {usersProfileData, changeMainState} = this.context;
         changeMainState("currentPage", "Post");
        this.setState({
            ...this.state,
            currtData: usersProfileData
        })
        
    }
    
    likesCheck(){
        const {usersProfileData, currentPostIndex , uid} = this.context;
        if(usersProfileData?.posts){
            var {likes} = usersProfileData?.posts[currentPostIndex?.index];
           return likes.people?.map(el =>  el.id).indexOf(uid) !== -1 ? true : false;
            // this.setState({ //checks whether the user's post is liked or not
            //         ...this.state,
            //         postLiked: likes.people?.map(el =>  el.id).indexOf(uid) !== -1 ? true : false
            // })
        }
          
    }
    handleCurrLikes=(boolean)=>{
        const {usersProfileData, handlePeopleLikes,currentPostIndex, uid, receivedData } = this.context;
        let postsData = usersProfileData?.posts;
        if(postsData){
            const {userName,likes, postOwnerId, contentURL, contentType } = postsData[currentPostIndex?.index];
            handlePeopleLikes(boolean, currentPostIndex?.index, postOwnerId, receivedData?.userName , receivedData?.userAvatarUrl, uid, contentURL, contentType );
        }
        
    }
    doubleClickEvent=()=>{
      let currCount = this.state.btnClicks;
      this.setState(prevState =>({
        btnClicks: prevState.btnClicks +1
      }))
      const resetCounter=()=>{
        this.setState({
            ...this.state,
           btnClicks: 0
         })
      }
      if(currCount === 1){
        this.handleCurrLikes(true);
         resetCounter();
         this.setState({
            ...this.state,
             doubleLikeClicked: true
         })
         setTimeout(()=>{
             this.setState({
                ...this.state,
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

        const {usersProfileData , handleSubmittingComments , handleSubComments,  currentPostIndex, uid, receivedData, handleCommentsModal} = this.context;
        let postsData = usersProfileData?.posts;
        if(postsData){
            const {id, postOwnerId, contentURL, contentType} = postsData[currentPostIndex?.index];
            if(this.state.insertedComment !== ""){//subcomment
                 if( this.state.replayData !== {}   && /^[@]/.test(this.state.insertedComment)){
                 handleSubComments(this.state.replayData, this.state.insertedComment, receivedData?.userAvatarUrl, false, contentURL, contentType);
                }else{//comment
                    handleSubmittingComments("others",currentPostIndex?.index, uid, receivedData?.userName, this.state.insertedComment, usersProfileData?.userAvatarUrl, new Date(), id, postOwnerId, contentURL, contentType);
                }
                this.setState({
                    insertedComment: "",
                    replayData: {}
                }) 
            } 
        }
         
    }
    replayFunc(postOwnerName,commentIndex, postIndex, postId, postOwnerId){
        this.inputField.current.focus();
        this.setState({
            ...this.state,
            replayData: {postOwnerName,commentIndex, postIndex, postId, postOwnerId},
            insertedComment: `@${postOwnerName} `
        })
    }
    render(){
    var {usersProfileData , currentPostIndex, uid, receivedData, handleLikingComments, currentPostIndex, handleUsersModal, handleCommentsModal} = this.context;
    if(usersProfileData?.posts){
        var {userName,caption, contentType, contentURL, comments, likes, location, date, postOwnerId} = usersProfileData?.posts[currentPostIndex?.index];
        var isVerified = usersProfileData?.isVerified;
    }
    
        return(
            <Fragment>
               {
                   usersProfileData?.posts ?

                <div id="post" className="post--card--container post--page">
                    <article className="post--card--article">
                            <div className="post--card--header flex-row">
                                <header className="post--header--avatar flex-row">
                                    <Avatar className="post__header__avatar" src={usersProfileData?.userAvatarUrl} alt={userName} />
                                    <div className="post--header--user--info flex-column">
                                        <span tabIndex="0" aria-disabled="false" role="button" className="flex-row">
                                            <h5 className="flex-row w-100"><TruncateMarkup line={1} ellipsis="...">{userName}</TruncateMarkup>{ isVerified ?  <span><GoVerified className="verified_icon"/></span> : null} </h5>
                                        </span>
                                        <span tabIndex="0" aria-disabled="false" role="button">
                                            <p><TruncateMarkup line={1} ellipsis="...">{location}</TruncateMarkup></p>
                                        </span>
                                    
                                    </div>
                                </header>
                                <span className="post--header--options"><HiDotsHorizontal/></span>
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
                                  <video className="post__card__content" src={contentURL} draggable="false" controls /> 
                                  <IoMdVideocam className="video__top__icon"/> 
                                </div>
                                
                                : null
                            }
                                

                            </div>
                            <div className="post--card--footer flex-column">
                                <div className="post--footer--upper--row flex-row">
                                    <div className=" flex-row">
                                        {
                                            !this.likesCheck() ?
                                            <span onClick={()=> this.handleCurrLikes(true)}
                                                ><FiHeart/></span>
                                            :
                                                <span onClick={()=> this.handleCurrLikes(false)} 
                                                    style={{
                                                        animation: this.likesCheck() ?  "boundHeart 0.5s forwards ease" : null
                                                    }}
                                                className="liked__heart"><FaHeart/></span>
                                        }
                                            <span><FaRegComment/></span>
                                            <span><FiSend/></span>
                                    </div>
                                    <div className="bookmark__icon"><RiBookmarkLine/></div> 
                                </div>
                                {
                                    likes.people?.length >=1 ?
                                    <div className="likes__count" onClick={()=> handleUsersModal(true, likes?.people,"likes")}>{likes.people?.length.toLocaleString()} { likes.people?.length === 1  ? "like"  : "likes"}</div>
                                    : null
                                }
                                 <span className="post__caption flex-row"><strong>{userName}</strong> { !this.state.viewFullCaption ? <p><TruncateMarkup line={4} ellipsis="...more" style={{cursor:"pointer"}} onClick={()=> this.setState({viewFullCaption: true})}>{caption}</TruncateMarkup></p>:  <p className="article__post">{caption}</p> }</span>
                                 {
                                    comments?.length >=1 ?
                                    <div className="post--comments--layout">
                                        {
                                            comments?.length > 1 ?
                                                <h5 className="post__comments__count" onClick={()=> handleCommentsModal(true)}>View all {comments.length.toLocaleString()} comments</h5>
                                            : 
                                                <h5 className="post__comments__count">Comments</h5>
                                        }
                                        {
                                            comments?.slice(0,3).map((comment, i) =>{
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
                                                    contentType={contentType}
                                                    contentURL={contentURL}
                                                    handleUsersModal={handleUsersModal}/>
                                                )
                                            })
                                        }
                                       
                                    </div>
                                    : null
                                }
                                
                                <small className="post__date">{new Date(date.seconds* 1000).toLocaleString()}</small>
                                <form onSubmit={(e)=> this.submitComment(e)} className="post--bottom--comment--adding">
                                    <input ref={this.inputField} value={this.state.insertedComment} onChange={(event)=> this.setState({insertedComment: event.target.value})} className="post__bottom__input" type="text" placeholder="Add a commment.." />
                                    <button type="submit" disabled={this.state.insertedComment.length <  1} className={this.state.insertedComment.length >=1 ? "post__bottom__button" :"disabled post__bottom__button" }>Post</button>
                                </form>
                            </div>

                    </article>
                    
                </div>
                : <h3>Sorry, page is not found.</h3>
                }
            </Fragment>
        ) 
    }
    
}
export default PostPage;