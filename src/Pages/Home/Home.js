import React, { useContext, useEffect, useState } from "react";
import Auxiliary from "../../Components/HOC/Auxiliary";
import "./Home.css";
import Post from "../../Components/Post/Post";
import { Avatar } from "@material-ui/core";
import { AppContext } from "../../Context";
import { Redirect, withRouter } from "react-router-dom";
import SuggestItem from "../../Components/SuggestItem/SuggestItem";
import { GoVerified } from "react-icons/go";
import { useAuthState } from "react-firebase-hooks/auth"; //firebase hook
import { auth } from "../../Config/firebase";
import Skeleton from "react-loading-skeleton";
// import InstagramEmbed from "react-instagram-embed";
import { BsPlusSquare } from "react-icons/bs";

const Home = (props) => {
  let {
    receivedData,
    handleMyLikes,
    handleSubmittingComments,
    suggestionsList,
    uid,
    handleFollowing,
    deletePost,
    handleSubComments,
    handleLikingComments,
    changeModalState,
    changeMainState,
    modalsState,
    onCommentDeletion,
    isUserOnline
  } = useContext(AppContext);
  let posts = receivedData?.posts;
  let [, loading] = useAuthState(auth);
  const [randNum, setRandNum] = useState(0);
  useEffect(() => {
    changeMainState("currentPage", "Home");
    window.scrollTo(0, 0);
  }, []);
  useEffect(()=> {
        setRandNum(Math.floor(Math.random() * suggestionsList?.length -6));
  },[suggestionsList]);

  const recievedAuth = localStorage.getItem("user");

  return (
    <Auxiliary>
      {  (isUserOnline || recievedAuth)  ? (
        <section id="home" className="main--home--container ">
          <div className="main--home--inner desktop-comp">
            <div className="home--posts--side flex-column">
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
                      modalsState= {modalsState}
                      deletePost={deletePost}
                      onCommentDeletion={onCommentDeletion}
                      posts={receivedData?.posts}
                    />
                  );
                })
              ) : loading ? (
                <div className="w-100 flex-column">
                  <Skeleton count={6} height={500} className="mb-5" />
                </div>
              ) : posts?.length < 1 ? (
                <div className="empty--posts--container flex-column">
                  <div className="empty--posts--inner flex-column">
                    <div className="plus--icon--container flex-column ">
                      <BsPlusSquare className="plus__icon" />
                    </div>
                    <h3>No posts have been made</h3>
                    <p>
                      When you share photos and videos, they'll <br /> be appear
                      on your posts page
                    </p>

                    <span>Share your first photo or video</span>
                  </div>
                </div>
              ) : null}
            </div>
            <aside className="home--sider">
              {loading && (
                <div className="loading--skeleton--home flex-column">
                  <Skeleton count={6} height={40} className="mt-3" />
                </div>
              )}

              {receivedData?.userName ? (
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
              ) : null}
              {suggestionsList.length >= 1 ? (
                <div className="suggestions--home--container">
                  <div className="suggestions--header flex-row">
                    <h6>Suggestions For you</h6>
                    <button className="user__see__all__btn">See all</button>
                  </div>
                  <div className="suggestions--list flex-column">
                    <ul className="flex-column">
                      {suggestionsList &&
                        suggestionsList.length > 0 ?
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
                                handleFollowing={handleFollowing}
                                receivedData={receivedData ? receivedData : []}
                              />
                            );
                          }):
                          <h6>No suggestions yet</h6>
                      }
                          
                    </ul>
                  </div>
                </div>
              ) : null}
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
