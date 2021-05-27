import React, { useContext, useEffect, useState } from "react";
import Auxiliary from "../../Components/HOC/Auxiliary";
import "./Home.css";
import Post from "../../Components/Post/Post";
import { Avatar } from "@material-ui/core";
import { AppContext } from "../../Context";
import { Redirect, withRouter, Link } from "react-router-dom";
import SuggestItem from "../../Components/SuggestItem/SuggestItem";
import { GoVerified } from "react-icons/go";
import { useAuthState } from "react-firebase-hooks/auth"; //firebase hook
import { auth } from "../../Config/firebase";
import Skeleton from "react-loading-skeleton";
// import InstagramEmbed from "react-instagram-embed";
import { BiMessageEdit } from "react-icons/bi";
import { VscAccount } from "react-icons/vsc";
import { AiOutlineHome } from "react-icons/ai";
import { RiVideoAddLine } from "react-icons/ri";
import { FiEdit, FiSettings } from "react-icons/fi";
import HomeReels from "../../Components/HomeReels/HomeReels";
import GSCardItem from "./GSCardItem/GSCardItem";
import { GOU } from "../../Utilities/GetOnlineUsers";

const Home = (props) => {
  let {
    receivedData,
    handleMyLikes,
    handleSubmittingComments,
    suggestionsList,
    uid,
    deletePost,
    handleSubComments,
    handleLikingComments,
    changeModalState,
    changeMainState,
    onCommentDeletion,
    isUserOnline,
    homeReels,
    loadingState,
    handleSavingPosts
  } = useContext(AppContext);
  let posts = receivedData?.posts;
  let [user, loading] = useAuthState(auth);
  const [randNum, setRandNum] = useState(0);
  const [onlineList, setOnlineList] = useState([]);
  const [footerLinks] = useState([
    "About",
    "Help",
    "Press",
    "API",
    "Jobs",
    "Privacy",
    "Terms",
    "Locations",
    "Top Accounts",
    "Hashtags",
    "Language",
  ]);
  useEffect(() => {
    GOU(uid).then((k) => {
        setOnlineList(k);
    });
    changeMainState("currentPage", "Home");
    window.scrollTo(0, 0);
  }, []);
  useEffect(()=> {
        setRandNum(Math.floor(Math.random() * suggestionsList?.length -6));
  },[suggestionsList]);

  const recievedAuth = localStorage.getItem("user");
  return (
    <Auxiliary>
      {  ( recievedAuth || isUserOnline || user)  ? (
        <section id="home" className="main--home--container ">
          <div className="main--home--inner desktop-comp">
            <div className="home--posts--side flex-column">
              {
                homeReels && <HomeReels />
              } 
              {!loading && posts?.length >= 1 ? (
                posts?.map((post, i) => {
                  return (
                    <Post
                      key={post?.id}
                      userName={post?.userName}
                      myName={receivedData?.userName}
                      caption={post?.caption}
                      contentType={post?.contentType}
                      contentURL={post?.contentURL}
                      contentName={post?.contentName}
                      comments={post?.comments}
                      likes={post?.likes}
                      postDate={post?.date}
                      id={uid}
                      location={post?.location}
                      index={i}
                      postId={post?.id}
                      postOwnerId={post?.postOwnerId}
                      userAvatar={receivedData?.userAvatarUrl}
                      handleMyLikes={handleMyLikes}
                      handleSubmittingComments={handleSubmittingComments}
                      handleSubComments={handleSubComments}
                      handleLikingComments={handleLikingComments}
                      isVerified={receivedData?.isVerified}
                      changeModalState={changeModalState}
                      deletePost={deletePost}
                      onCommentDeletion={onCommentDeletion}
                      posts={receivedData?.posts}
                      handleSavingPosts={handleSavingPosts}
                      savedPosts={receivedData?.savedposts}
                      following={receivedData?.following}
                      history={props.history}
                    />
                  );
                })
              ) : loading ? (
                <div className="w-100 flex-column">
                  <Skeleton count={6}height={500} className="mb-5" />
                </div>
              ) : posts?.length < 1 ? (
                <div className="voxgram--set--up--conainer">
                <div className="voxgram--greeting">
                    <div className="empty--card">
                      <div className="plus--icon--container flex-column">
                        <AiOutlineHome />
                      </div>
                      <h2>Welcome to Voxgram</h2>
                      <h4> When you follow people, you'll see the photos and videos they post here.</h4>
                      <button onClick={() => props.history.push("/explore/people")} className="primary__btn">Find People to Follow</button>
                    </div>
                </div>
                <div className="getting--started--container flex-column">
                 <h4>Getting Started</h4> 
                  <ul className="getting--started--inner flex-row">
                    <GSCardItem title="add posts" goTo="/add-post"  btnTitle="add a post" description="Share photos and videos that people can admire." icon={<RiVideoAddLine />} />
                    <GSCardItem title="edit your profile" goTo="/edit-profile" btnTitle="edit profile" description="Update your name, birthday, bio, relationship status and gender." changeOptionIndex={{activeIndex: 0, activeID: "Edit_Profile"}} icon={<FiEdit />} />
                    <GSCardItem title="configue your account" goTo="/edit-profile" changeOptionIndex={{activeIndex: 1, activeID:  "Professional_Account"}} description="Set a category and control you account."  btnTitle="configure account" icon={<FiSettings />} />
                    <GSCardItem title="find more people" goTo="/explore/people" btnTitle="find people"  description="Discover new people."  icon={<VscAccount />} />
                    <GSCardItem title="message someone" goTo="/messages" btnTitle="start messaging" description="Chat with other users." icon={<BiMessageEdit />} />
                  
                  </ul>
                </div>
                </div>

              ) : null}
            </div>
            <aside className="home--sider flex-column">
              {loading && (
                <div className="loading--skeleton--home flex-column">
                  <Skeleton count={6} height={40} className="mt-3" />
                </div>
              )}

              {receivedData?.userName ? (
                <div className="side--user--info--container flex-row">
                  <div className="side--user--info flex-row">
                     <Avatar
                      src={receivedData?.userAvatarUrl}
                      alt={receivedData?.userName}
                      title={receivedData?.userName}
                    />
                    <h5
                      title={receivedData?.userName}
                      className="flex-row"
                      onClick={() => props.history.push(`/profile`)}
                    >
                      {receivedData?.userName}{" "}
                      {receivedData?.isVerified ? (
                        <GoVerified className="verified_icon" />
                      ) : null}
                    </h5>
                  </div>
                      
                  <button className="txt_follow disabled">Switch</button>
                </div>
              ) : null}
              {suggestionsList.length >= 1 ? (
                <div className="suggestions--home--container">
                  <div className="suggestions--header flex-row">
                    <h6>Suggestions For you</h6>
                    <Link to="/explore/people"><button className="user__see__all__btn">See all</button></Link>
                  </div>
                  <div className="suggestions--list flex-column">
                    <ul className="flex-column">
                      {suggestionsList &&
                        suggestionsList.length > 0 &&
                       Array.from(new Set(suggestionsList.map((item) => item.uid))).map((id) => suggestionsList.find((el) => el.uid === id))
                          .filter((item) => (item?.uid !== receivedData?.uid) ).slice(randNum, suggestionsList?.length -1).slice(0,5)
                          .map((user, i) => {
                            return (
                              <SuggestItem
                                key={i}
                                userName={user?.userName}
                                isVerified={user?.isVerified}
                                userUid={user?.uid}
                                userAvatarUrl={user?.userAvatarUrl}
                                creationDate={user?.profileInfo?.accountCreationDate ? user?.profileInfo?.accountCreationDate : ""}
                                followers={user?.followers}
                                isOnline={onlineList?.some(c => c.uid === user?.uid)}
                              />
                            );
                          })
                      }
                          
                    </ul>
                  </div>
                </div>
              ) : suggestionsList.length < 1 && loadingState?.suggList ?
              <div className="suggestions--home--container">
                <div className="suggestions--list">
                  {
                      Array.from({length: 5},(_,i) =>(
                        <li key={i} className="suggestion--item flex-row mb-3">
                        <div className="side--user--info flex-row">
                            <Skeleton count={1} circle={true} width={32} height={32} />
                            <span className="flex-column ml-2">
                                <Skeleton count={1} width={80} height={13} /> 
                                <Skeleton count={1} width={150} height={13} />
                            </span>
                        </div>
                        <Skeleton count={1} width={39} height={13} />
                      </li>
                      ))  
                  }
                  </div>
              </div>
           

              : <div className="empty--box flex-column">
                  <h4>No suggestions available</h4>
                </div>
              }
              <div className="home--footer desktop-only">
               <nav>
                 <ul className="flex-row">
                   {
                     footerLinks?.map((link,i) =>(
                     <li key={link + i}>{link}</li>
                     ))
                   }
                 </ul>
                 <div className="home--footer--copyright">
                   &copy; {new Date().getFullYear()} not the official Instagram
                 </div>
               </nav>
              </div>
              <div className="instagram--embed--container">
                {/* <InstagramEmbed
                            url="https://www.instagram.com/p/CGalYyrJNsX/"
                            // hideCaptions ={false}
                            containerTagName ="div"
                            className="instagram__embed"
                            // maxWidth={320}
                         /> */}
              </div>
            </aside>
          </div>
        </section>
      ) : (
        <Redirect from="/" to="/auth" />
      )}
    </Auxiliary>
  );
};
export default withRouter(Home);
