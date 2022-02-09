import React, { useContext, useEffect, useState, useRef, memo } from "react";
import Auxiliary from "../../Components/HOC/Auxiliary";
import "./Home.css";
import Post from "../../Components/Post/Post";
import { Avatar } from "@material-ui/core";
import { AppContext } from "../../Context";
import { Redirect, withRouter } from "react-router-dom";
import { GoVerified } from "react-icons/go";
import { useAuthState } from "react-firebase-hooks/auth"; //firebase hook
import { auth } from "../../Config/firebase";
import Skeleton from "react-loading-skeleton";
import { BiMessageEdit } from "react-icons/bi";
import { VscAccount } from "react-icons/vsc";
import { AiOutlineHome } from "react-icons/ai";
import { RiVideoAddLine } from "react-icons/ri";
import { FiEdit, FiSettings } from "react-icons/fi";
import HomeReels from "../../Components/HomeReels/HomeReels";
import HomeSuggsList from "../../Components/HomeSuggList/HomeSuggList";
import GSCardItem from "./GSCardItem/GSCardItem";
import { GOU } from "../../Utilities/GetOnlineUsers";
import List from "../../Components/Generic/List/List";
import appConfig from "../../Config/app-config.json";
import { connect } from "react-redux";
import * as Consts from "../../Utilities/Consts";
import * as actionTypes from "../../Store/actions/actions";
import { updateSuggestionsListAsync } from "../../Store/actions/actionCreators";

const Home = (props) => {
  const { changeModalState, updateSuggestionsList, suggestionsList, homeFeed, isUsersListLoading } = props;
  let {
    receivedData,
    handlePeopleLikes,
    handleSubmittingComments,
    uid,
    deletePost,
    handleSubComments,
    handleLikingComments,
    changeMainState,
    onCommentDeletion,
    isUserOnline,
    handleSavingPosts,
    loadingState
  } = useContext(AppContext);

  let posts = (receivedData && Object.keys(receivedData).length > 0) ? [...homeFeed,...receivedData?.posts]?.sort((a,b) => b.date?.seconds - a.date?.seconds): []; 
  posts = Array.from(
    new Set(posts.map((itemId) => itemId.id))
  ).map((ID) => posts.find((el) => el.id === ID));
  const _isMounted = useRef(true);
  let [user, loading] = useAuthState(auth);
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
      if(_isMounted?.current){
         setOnlineList(k);
      }
    });
    changeMainState("currentPage", "Home");
    return () => _isMounted.current = false;
  }, [uid]);
  const recievedAuth = localStorage.getItem("user");
  return (
    <Auxiliary>
      {  ( recievedAuth || isUserOnline || user)  ? (
        <section id="home" className="main--home--container ">
          <div className="main--home--inner desktop-comp">
            <div className="home--posts--side flex-column">
              {
                <HomeReels isReceivedDataLoading={loadingState.receivedData}/>
              } 
              { (loading || loadingState.receivedData) ? (
                <div className="w-100 flex-column">
                  <Skeleton count={6}height={500} className="mb-5" />
                </div>
              ) : posts?.length >= 1 ? 
                    <List list={posts} areHomePosts ={true} parentClass="full--width" increaseBy={3} intervalTime={900}>
                          <Post
                           loadingState={loadingState}
                            myName={receivedData?.userName}
                            id={uid}
                            myAvatar={receivedData?.userAvatarUrl}
                            handlePeopleLikes={handlePeopleLikes}
                            handleSubmittingComments={handleSubmittingComments}
                            handleSubComments={handleSubComments}
                            handleLikingComments={handleLikingComments}
                            isVerified={receivedData?.isVerified}
                            changeModalState={changeModalState}
                            updateSuggestionsList={updateSuggestionsList}
                            deletePost={deletePost}
                            onCommentDeletion={onCommentDeletion}
                            handleSavingPosts={handleSavingPosts}
                            savedPosts={receivedData?.savedposts}
                            following={receivedData?.following}
                            history={props.history}
                            areCommentsDisabled= {(receivedData?.profileInfo?.professionalAcc?.disableComments) || false}
                          />
                    </List>
              : posts?.length < 1 ? (
                <div className="voxgram--set--up--conainer">
                <div className="voxgram--greeting">
                    <div className="empty--card">
                      <div className="plus--icon--container flex-column">
                        <AiOutlineHome />
                      </div>
                      <h2>Welcome to {appConfig.title}</h2>
                      <h4> When you follow people, you'll see the photos and videos they post here.</h4>
                      <button onClick={() => props.history.push("/explore/people")} className="primary__btn">Find People to Follow</button>
                    </div>
                </div>
                <div className="getting--started--container mb-4 flex-column">
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
              <HomeSuggsList receivedData={receivedData} loadingState={isUsersListLoading} suggestionsList={suggestionsList} onlineList={onlineList} />
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
            </aside>
          </div>
        </section>
      ) : (
        <Redirect from="/" to="/auth" />
      )}
    </Auxiliary>
  );
};
const mapDispatchToProps = dispatch => {
  return {
      changeModalState: (modalType, hasDataList, usersList, usersType) => dispatch({type: actionTypes.CHANGE_MODAL_STATE, payload: {modalType, hasDataList, usersList, usersType}}),
      updateSuggestionsList: () => dispatch(updateSuggestionsListAsync())
  }
}
const mapStateToProps = state => {
  return {
      suggestionsList: state[Consts.reducers.USERSLIST].suggestionsList,
      homeFeed: state[Consts.reducers.USERSLIST].homeFeed,
      isUsersListLoading: state[Consts.reducers.USERSLIST].isLoading
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(memo(Home)));
