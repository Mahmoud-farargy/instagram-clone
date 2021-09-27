import React, { Fragment, useEffect, useContext, Suspense, lazy } from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import { AppContext } from "../../Context";
import { auth, changeConnectivityStatus } from "../../Config/firebase";
import AppConfig from "../../Config/app-config.json";
import { useAuthState } from "react-firebase-hooks/auth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-confirm-alert/src/react-confirm-alert.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import 'react-h5-audio-player/lib/styles.css';
import $ from "jquery";
import LoadingScreen from "../Generic/LoadingScreen/LoadingScreen";
import { retry } from "../../Utilities/RetryImport";

//lazy loading
const Header = lazy(()=> retry(()=> import("../Header/Header")));
const UsersModal = lazy(()=>  retry(()=> import("../../Components/UsersModal/UsersModal")));
const UnfollowModal = lazy(()=> retry(()=> import( "../UnfollowModal/UnfollowModal")));
const CommentsModal = lazy(() => retry(()=> import("../../Components/CommentsModal/CommentsModal")));
const Home = lazy(() => retry(()=> import("../../Pages/Home/Home")));
const Footer = lazy(() => retry(()=> import("../../Components/Footer/Footer")));
const AuthPage = lazy(() => retry(()=> import("../../Pages/AuthPage/AuthPage")));
const CreatePage = lazy(() => retry(()=> import("../../Pages/AddNewPost/CreatePage")));
const UsersProfile = lazy(() => retry(()=> 
  import("../../Pages/UsersProfile/UsersProfile")
));
const PostPage = lazy(() => retry(()=> import("../../Pages/PostPage/PostPage")));
const Messages = lazy(() => retry(()=> import("../../Pages/Messages/Messages")));
const MobileNav = lazy(() => retry(()=> import("../MobileNav/MobileNav")));
const MobileNotifications = lazy(() => retry(()=> 
  import("../../Pages/MobileNotifications/MobileNotifications")
));
const MyProfile = lazy(() => retry(()=> import("../../Pages/MyProfile/MyProfile")));
const EditProfile = lazy(() => retry(()=> import("../../Pages/EditProfile/EditProfile")));
const Reels = lazy(() => retry(()=> import("../../Pages/Reels/Reels")));
const About = lazy(() => retry(()=> import("../../Pages/About/About")));
const Explore = lazy(() => retry(()=> import("../../Pages/Explore/Explore")));
const ErrorRoute = lazy(() => retry(()=> import("../../Pages/ErrorRoute/ErrorRoute")));
const MobileHeader = lazy(() => retry(()=> import("../../Components/MobileHeader/MobileHeader")));
const MobileSearch = lazy(() => retry(()=>  import("../../Pages/MobileSearch/MobileSearch")));
const Suggestions = lazy(() => retry(()=>  import("../../Pages/Suggestions/Suggestions")));
//--xx---//

const App = () => {
  const context = useContext(AppContext);
  const {
    updatedReceivedData,
    updateUserState,
    updateUID,
    receivedData,
    updateSuggestionsList,
    currentPage,
    changeMainState,
    uid,
    // returnPassword,
    suggestionsList,
    modalsState,
    notify,
    changeModalState,
    usersModalList,
    unfollowModal,
    usersProfileData,
    reelsProfile,
    currentPostIndex,
    testStorageConnection,
    explore,
    currentHour,
    loadingState,
    authLogout,
    closeNotificationAlert,
    isDayTime
  } = context;
  const isAnyModalOpen = Object.keys(modalsState).map(w => modalsState[w]).some( p => p === true);
  const [user,loading] = useAuthState(auth);
  const history = useHistory();
  const renderHeader = (
    <Header
      receivedData = {receivedData}
      closeNotificationAlert = {closeNotificationAlert}
      authLogout = {authLogout}
      changeMainState= {changeMainState}
      isDayTime = {isDayTime}
     />
  )
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        updateUserState(true);
        updateUID(authUser?.uid).then(() => {
          changeMainState("currentUser", authUser);
          updatedReceivedData();
          updateSuggestionsList();
        });
        changeConnectivityStatus(authUser?.uid);
        testStorageConnection();
      } else {
        // const recievedAuth = localStorage.getItem("user");
        // if (recievedAuth) {
            //attempts to log in again using local storage data
          //   debugger
          // const { email, password } = JSON.parse(recievedAuth);
          // auth.signInWithEmailAndPassword(email, returnPassword(password));
        // }else{
            // user logged out
             history.push("/auth");
             updateUserState(false);
        // }
      }
    });
    // ----------------------
    return () => {
      //performs some clearn up actions
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    $(document).ready(() => {
      if (isAnyModalOpen) { //we could also use a ref in here
        $("body").css("overflow", "hidden");
      } else {
        $("body").css("overflow", "visible");
      }
    });
  }, [isAnyModalOpen]);
  useEffect(() => {
    const currTheme = receivedData?.profileInfo?.theme;
    const changeBodyClass  = newClass => document.body.setAttribute("class",newClass );

        if( currTheme){
          if(currTheme === "lightDarkAuto"){
           changeBodyClass( currentHour > 6 && currentHour < 20 ? "lightMode" : "darkMode");
          }else{
            changeBodyClass(currTheme);
          }
       }
  },[receivedData?.profileInfo?.theme]);
  useEffect(() => {
    document.title = `${currentPage && currentPage + " • "}${AppConfig.title}`;
    if(!navigator.onLine){
      notify("You are Offline! Please reconnect and try again.", "error");
      history.replace("/auth");
    }
  }, [currentPage]);
  return (
    <Fragment>
      <main className="main--app">
        {/* Modals */}
        <Suspense fallback={<LoadingScreen />}>
            {modalsState?.users && usersModalList && Object.keys(usersModalList).length > 0 && <UsersModal />}
            {unfollowModal?.state && unfollowModal?.user && Object.keys(unfollowModal?.user).length > 0 && <UnfollowModal />}
          {modalsState?.comments ? (
            <CommentsModal context={context} />
          ) : null}

          {loading && <div className="global__loading"><span className="global__loading__inner"></span></div>} 
         {
           isAnyModalOpen &&
            <div
                style={{
                  opacity: "1" ,
                  display: "block",
                  transition: "all 0.5s linear",
                }}
                className="backdrop"
                onClick={() => changeModalState("users", false, "", "")}
              ></div> 
         }          
        </Suspense>
        
        {/* Notifications container */}
        <ToastContainer />
        {/* Routes */}
        {/* TODO: put these routes in a routes.js component */}
          <Suspense fallback={<div><div className="global__loading"><span className="global__loading__inner"></span></div><LoadingScreen /></div>}>
            <Switch>
            <Route exact path="/">
              {(user && receivedData && Object.keys(receivedData).length) > 0 ? renderHeader : <LoadingScreen />}
              <MobileHeader />
              <Home />
              <MobileNav />
            </Route>
            <Route exact path="/auth" component={AuthPage} />
            <Route exact path="/messages">
              {(user && receivedData && Object.keys(receivedData).length) > 0 && renderHeader}
              { //Guards
                receivedData && Object.keys(receivedData).length > 0 && receivedData?.messages ?
                 <Messages history={history} />
                 : 
                <ErrorRoute type="403"/>
              }
              <MobileNav />
            </Route>
            <Route exact path="/add-post">
              {(user && receivedData && Object.keys(receivedData).length) > 0 && renderHeader}
              <MobileHeader />
              <CreatePage loadingState={loadingState} />
              <MobileNav />
            </Route>
            <Route exact path="/notifications">
              {(user && receivedData && Object.keys(receivedData).length) > 0 && renderHeader}
              <MobileHeader />
              {
                receivedData && receivedData?.notifications ?
                 <MobileNotifications context={context} />
                 :
                <ErrorRoute type="403"/>
              }
              <MobileNav />
            </Route>
            <Route exact path="/profile">
              {(user && receivedData && Object.keys(receivedData).length) > 0 && renderHeader}
              <MobileHeader />
              {
                receivedData && Object.keys(receivedData).length > 0 ?
                <MyProfile />
                 :
                <ErrorRoute type="403"/>
              }
              <MobileNav />
              <Footer />
            </Route>
            <Route exact path="/user_profile/:name/:userId">
              {(user && receivedData && Object.keys(receivedData).length) > 0 && renderHeader}
              <MobileHeader />
              {
                usersProfileData && Object.keys(usersProfileData).length > 0 && usersProfileData?.posts ? 
                <UsersProfile />
                :
                <ErrorRoute type="403"/>
              }
              <MobileNav />
              <Footer />
            </Route>
            <Route exact path="/browse-post">
              {(user && receivedData && Object.keys(receivedData).length) > 0 && renderHeader}
              <MobileHeader />
              {
                Object.keys(usersProfileData).length > 0 && usersProfileData?.posts &&  usersProfileData?.posts[currentPostIndex?.index] ?
                <PostPage />
                : 
                <ErrorRoute type="403"/>
              }
              <MobileNav />
            </Route>
            <Route exact path="/edit-profile">
              {(user && receivedData && Object.keys(receivedData).length) > 0 && renderHeader}
              <MobileHeader />
              {
                 receivedData && Object.keys(receivedData).length > 0 && receivedData?.profileInfo?
                  <EditProfile />
                  :
                  <ErrorRoute type="403"/>
              }
              <MobileNav />
              <Footer />
            </Route>
            <Route exact path="/reels">
              {  
               reelsProfile?.reels ?
                <Reels context={context} routeHistory={history} />
                :
                <ErrorRoute type="403"/>
              }
            </Route>
            <Route exact path="/explore">
            {(user && receivedData && Object.keys(receivedData).length) > 0 && renderHeader}
            <MobileHeader />
              {  
               explore ?
                  <Explore/>
                :
                <ErrorRoute type="403"/>
              }
            <MobileNav />
            <Footer />
            </Route>
            <Route exact path="/about">
                {(user && receivedData && Object.keys(receivedData).length) > 0 && renderHeader}
                <MobileHeader />
                <About changeMainState={changeMainState} />
                <MobileNav />
                <Footer />
            </Route>
            <Route exact path="/search">
            {(user && receivedData && Object.keys(receivedData).length) > 0 && renderHeader}
              <MobileHeader/>
              <MobileSearch />
              <MobileNav />
              <Footer />
            </Route>
            <Route path="/explore/people">
            {(user && receivedData && Object.keys(receivedData).length) > 0 && renderHeader}
            <MobileHeader />
            {
              suggestionsList && suggestionsList.length > 0 ?
              <Suggestions 
              suggestionsList={suggestionsList}
              uid={uid}
              changeMainState={changeMainState}
              changeModalState={changeModalState}
              receivedData={receivedData}
              loadingState={loadingState}
               />
              :
              <ErrorRoute type="403" />
            }
            <MobileNav />
            <Footer />
            </Route>
            <Route path="*" >
                {(user && receivedData && Object.keys(receivedData).length) > 0 && renderHeader}
                <MobileHeader />
                <ErrorRoute type="404"/>
                <MobileNav />
                <Footer />
            </Route>
            </Switch>
          </Suspense>
         
        
      </main>
    </Fragment>
  );
};

export default App;
