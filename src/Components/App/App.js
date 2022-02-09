import React, { Fragment, useEffect, useContext, Suspense, lazy , useState, useCallback, memo } from "react";
import { Switch, Route, useHistory, useLocation } from "react-router-dom";
import { AppContext } from "../../Context";
import { auth, changeConnectivityStatus } from "../../Config/firebase";
import AppConfig from "../../Config/app-config.json";
import { useAuthState } from "react-firebase-hooks/auth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-confirm-alert/src/react-confirm-alert.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import 'react-h5-audio-player/lib/styles.css';
import LoadingScreen from "../Generic/LoadingScreen/LoadingScreen";
import { retry } from "../../Utilities/RetryImport";
import LostConnectivity from "../LostConnectivity/LostConnectivity";
import { disableReactDevTools, lowerCaseString } from "../../Utilities/Utility";
import { availableFonts } from "../../Utilities/Consts";
import * as Consts from "../../Utilities/Consts";
import * as actionTypes from "../../Store/actions/actions";
import { updateSuggestionsListAsync } from "../../Store/actions/actionCreators";
import { connect } from "react-redux";

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
// TODO: REFACTOR CODE

const App = ({ changeModalState, modalsState, usersModalList, updateSuggestionsList, suggestionsList, explore, isUsersListLoading }) => {
  const context = useContext(AppContext);
  const {
    updatedReceivedData,
    updateUserState,
    updateUID,
    receivedData,
    currentPage,
    changeMainState,
    uid,
    unfollowModal,
    usersProfileData,
    reelsProfile,
    currentPostIndex,
    testStorageConnection,
    currentHour,
    loadingState,
    authLogout,
    closeNotificationAlert,
  } = context;
  const [isAnyModalOpen, setAllModalsState] = useState(false);
  const [user,loading] = useAuthState(auth);
  const history = useHistory();
  const location = useLocation();
  const [isConnected, setConnectivity] = useState(navigator.onLine);
  const renderHeader = (
    user &&
    <Header
      receivedData = {receivedData}
      closeNotificationAlert = {closeNotificationAlert}
      authLogout = {authLogout}
      changeMainState= {changeMainState}
     />
  )
  useEffect(() => {
    window.scrollTo({
      top:0,
      left:0,
      behavior: "auto"
    });
  },[location]);
  useEffect(() => {
    let consoleStyles= [ 
      "font-size: 12px", 
      "font-family: monospace", 
      "background: white", 
      "display: inline-block", 
      "color: black", 
      "padding: 8px 19px", 
      "border: 1px dashed;" 
  ].join(";") 
    console.log(`%c Hi 👋 ! Glad you made it down here. Welcome to a console.log() adventure.`, consoleStyles);
    console.log('%c If you like Voxgram, I suggest you see more projects on my portfolio: https://mahmoud-farargy.web.app. Kiss from me 😘', 'background: #ee11cc; color: #eee; font-size: 15px');
    if(process.env.NODE_ENV === "development"){
          typeof window !== "undefined" && (window.React = React);
    }else{
      disableReactDevTools();
    }
    window.addEventListener('offline', ()=> setConnectivity(false));
    window.addEventListener('online', () => setConnectivity(true));
    const unsubscribe = isConnected && auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        updateUserState(true);
        updateUID(authUser?.uid).then(() => {
          changeMainState("currentUser", authUser);
          updatedReceivedData(authUser?.uid, true).then(() => {
            updateSuggestionsList();
          });
        });
        changeConnectivityStatus(authUser?.uid);
        testStorageConnection();
      } else {
            // user logged out
             history.push("/auth");
             updateUserState(false);
      }
    });
    // ----------------------
    return () => {
      //performs some clearn up actions
      typeof unsubscribe === "function" && unsubscribe();
      window.removeEventListener('offline', () => {});
      window.removeEventListener('online', () => {});
    };
  }, [isConnected]);
  useEffect(() => {
    const isAnyoneOpening = Object.keys(modalsState).map(w => modalsState[w]).some( p => p === true);
    setAllModalsState(isAnyoneOpening);
    document.body.style.overflowY = isAnyoneOpening ? "hidden" : "visible";
  },[modalsState]);

  const changeTheme = useCallback((newTheme) => {
    if(typeof newTheme === "string"){
       document.body.setAttribute("class",newTheme); 
    }
  }, []);
  useEffect(() => {
    const currTheme = receivedData?.profileInfo?.theme;
        if(currTheme){
          if(currTheme === "lightDarkAuto"){
            changeTheme(
              window.matchMedia ?
              (window
                .matchMedia("(prefers-color-scheme: dark)").matches ? "darkMode" : "lightMode")
              :
              ((currentHour > 6 && currentHour < 20) ? "lightMode" : "darkMode")
            );
           
          }else{
            changeTheme(currTheme);
          }
       }
  },[((receivedData?.profileInfo?.theme) && receivedData.profileInfo.theme)]);
  useEffect(() => {
    document.title = `${currentPage && currentPage + " • "}${AppConfig.title}`;
  }, [currentPage]);
  useEffect(() => {
    const currentFont = receivedData?.profileInfo?.professionalAcc?.fontFam;
    if(currentFont && Object.values(availableFonts).some(el => lowerCaseString(el) === lowerCaseString(currentFont))){
      document.documentElement.style.setProperty("--active-font-family", `${currentFont},'Segoe UI', Roboto, Helvetica, Arial, sans-serif`);
    }
  },[((receivedData?.profileInfo?.professionalAcc?.fontFam) && receivedData.profileInfo.professionalAcc.fontFam)]);

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
        {!isConnected && <LostConnectivity />}
        
        {/* Notifications container */}
        <ToastContainer />
        {/* Routes */}
        {/* TODO: put these routes in a routes.js component */}
          <Suspense fallback={<div><div className="global__loading"><span className="global__loading__inner"></span></div><LoadingScreen /></div>}>
            <Switch>
            <Route exact path="/">
              {user ?
                <>
                {renderHeader}
                <MobileHeader />
                <Home />
                <MobileNav />
                </>
              : isConnected && <LoadingScreen />}
            </Route>
            <Route exact path="/auth" component={AuthPage} />
            <Route exact path="/messages">
              {renderHeader}
              { //Guards
                receivedData && Object.keys(receivedData).length > 0 && receivedData?.messages ?
                 <Messages history={history} />
                 : 
                <ErrorRoute type="403"/>
              }
              <MobileNav />
            </Route>
            <Route exact path="/add-post">
              {renderHeader}
              <MobileHeader />
              <CreatePage loadingState={loadingState} />
              <MobileNav />
            </Route>
            <Route exact path="/notifications">
              {renderHeader}
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
              {renderHeader}
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
              {renderHeader}
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
              {renderHeader}
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
              {renderHeader}
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
            {renderHeader}
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
                {renderHeader}
                <MobileHeader />
                <About changeMainState={changeMainState} />
                <MobileNav />
                <Footer />
            </Route>
            <Route exact path="/search">
            {renderHeader}
              <MobileHeader/>
              <MobileSearch />
              <MobileNav />
              <Footer />
            </Route>
            <Route path="/explore/people">
            {renderHeader}
            <MobileHeader />
            {
              suggestionsList && suggestionsList.length > 0 ?
              <Suggestions 
              suggestionsList={suggestionsList}
              uid={uid}
              changeMainState={changeMainState}
              changeModalState={changeModalState}
              receivedData={receivedData}
              loadingState={isUsersListLoading}
               />
              :
              <ErrorRoute type="403" />
            }
            <MobileNav />
            <Footer />
            </Route>
            <Route path="*" >
                {renderHeader}
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
const mapDispatchToProps = dispatch => {
  return {
      changeModalState: (modalType, hasDataList, usersList, usersType) => dispatch({type: actionTypes.CHANGE_MODAL_STATE, payload:  {modalType, hasDataList, usersList, usersType}}),
      updateSuggestionsList: () => dispatch(updateSuggestionsListAsync())
  }
}
const mapStateToProps = state => {
  return {
      usersModalList: state[Consts.reducers.MODALS].usersModalList,
      modalsState: state[Consts.reducers.MODALS].modalsState,
      suggestionsList: state[Consts.reducers.USERSLIST].suggestionsList,
      explore: state[Consts.reducers.USERSLIST].explore,
      isUsersListLoading: state[Consts.reducers.USERSLIST].isLoading,
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(memo(App));
