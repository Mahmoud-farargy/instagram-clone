import React, {useContext} from "react";
import Auxiliary from "../../Components/HOC/Auxiliary";
import "./Home.css";
import Post from "../../Components/Post/Post";
import {Avatar} from "@material-ui/core";
import {AppContext} from "../../Context";
import {withRouter} from "react-router-dom";
import SuggestItem from "../../Components/SuggestItem/SuggestItem";
import AuthPage from "../../Pages/AuthPage/AuthPage";
import {GoVerified} from "react-icons/go";
import {useAuthState} from "react-firebase-hooks/auth";  //firebase hook
import {auth} from "../../Config/firebase"; 
import {Skeleton} from "@material-ui/lab";
import InstagramEmbed from "react-instagram-embed";
import {BsPlusSquare} from "react-icons/bs";

const Home =(props)=>{
    let {receivedData, handleMyLikes, handleSubmittingComments, isUserOnline, suggestionsList, getUsersProfile, uid, handleFollowing, deletePost, handleSubComments, handleLikingComments, handleUsersModal} = useContext(AppContext);
    let posts = receivedData?.posts;
    const browseUser=(specialUid)=>{
        getUsersProfile(specialUid);
        props.history.push("/user-profile");
    }  
    
    let [user, loading, error] = useAuthState(auth);
    return(
        <Auxiliary>
            {
                user ?
            <section id="home" className="main--home--container ">
                 
                <div className="main--home--inner desktop-comp">
                    <div className="home--posts--side flex-column">
                    {
                        !loading && posts?.length >=1 ? 
                            posts?.map((post, i) =>{
                                return(      
                                            <Post key={post?.id}
                                            userName={post?.userName}
                                            myName = {receivedData?.userName}
                                            caption={post?.caption}
                                            contentType={post?.contentType}
                                            contentURL ={post?.contentURL}
                                            contentName ={post?.contentName}
                                            comments={post?.comments}
                                            likes={post?.likes}
                                            postDate={post?.date}
                                            id={uid}
                                            location={post?.location}
                                            index = {i}
                                            postId = {post?.id}
                                            postOwnerId = {post?.postOwnerId}
                                            userAvatar = {receivedData?.userAvatarUrl}
                                            handleMyLikes={handleMyLikes}
                                            handleSubmittingComments= {handleSubmittingComments}
                                            handleSubComments = {handleSubComments}
                                            handleLikingComments = {handleLikingComments}
                                            isVerified = {receivedData?.isVerified}
                                            handleUsersModal = {handleUsersModal}
                                            deletePost = {deletePost}
                                            />
                                )
                            })
                        : loading ?
                            (<Skeleton variant="rect" width="100%">
                                <div style={{ paddingTop: '57%' }} />
                            </Skeleton>
                          )
                        : posts?.length <1 ?
                            (
                                <div className="empty--posts--container flex-column">
                                    <div className="empty--posts--inner flex-column">
                                        <div className="plus--icon--container flex-column "><BsPlusSquare className="plus__icon"/></div>
                                        <h3>No posts have been made</h3>
                                        <p>When you share photos and videos, they'll <br/> be appear on your posts page</p>

                                        <span>Share your first photo or video</span>
                                    </div>
                                </div>
                            )
                        : null
                    }
                    </div>
                    <aside className="home--sider">
                        {
                            receivedData?.userName ?
                                <div className="side--user--info flex-row">
                                    <Avatar />
                                    <h5 className="flex-row" onClick={()=> props.history.push("/profile")}>{receivedData?.userName} { receivedData?.isVerified ? <GoVerified className="verified_icon"/> : null}</h5>  
                                </div>
                                
                            : null
                        }
                        {
                            suggestionsList.length >=1 ?
                            <div className="suggestions--home--container">
                                <div className="suggestions--header flex-row">
                                    <h6>Suggestions For you</h6>  
                                    <button>See all</button>
                                </div>
                                <div className="suggestions--list flex-column">
                                    <ul className="flex-column">
                                        {
                                            suggestionsList?.filter(item => item?.uid !== receivedData?.uid ).slice(0,5).map((user,i) =>{
                                                return(
                                                    loading ?
                                                    (<Skeleton variant="circle" width={40} height={40} />)
                                                    :
                                                    (<SuggestItem key={i} userName={user?.userName} isVerified={user?.isVerified} userUid={user?.uid} userAvatarUrl={user?.userAvatarUrl}   browseUser={browseUser} handleFollowing={handleFollowing} receivedData={receivedData} />)
                                                    
                                                )
                                            })
                                        } 
                                        
                                    </ul>
                                </div> 
                            </div>
                            : null
                        }
                        <div className="instagram--embed--container">
                        <InstagramEmbed
                            url="https://www.instagram.com/p/CGalYyrJNsX/"
                            // hideCaptions ={false}
                            containerTagName ="div"
                            className="instagram__embed"
                            // maxWidth={320}
                         />
                        </div>
                        
                        
                        
                    </aside>
                    {/* footer */}
                    <div id="userProfFooter" className="userProfile--footer auth--footer--container desktop-only">
                    <ul className="auth--footer--ul flex-row">
                            <li>ABOUT</li>
                            <li>HELP</li>
                            <li>PRESS</li>
                            <li>API</li>
                            <li>JOBS</li>
                            <li>PRIVACY</li>
                            <li>TERMS</li>
                            <li>LOCATIONS</li>
                            <li>TOP ACCOUNTS</li>
                            <li>HASHTAGS</li>
                            <li>LANGUAGE</li>
                        </ul>
                        <div className="auth--copyright">
                            <span>This app was made for personal use</span>
                            <span>@2020 Instagram clone made by Mahmoud Farargy</span>
                        </div>
                </div>
                </div>
            </section>
            :
            <AuthPage />
        }
        </Auxiliary>
    )
}
export default withRouter(Home);