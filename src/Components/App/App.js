import React, { Fragment, useEffect, useContext, Suspense, lazy, useState} from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import { AppContext } from "../../Context";
import { db, auth, changeConnectivityStatus} from "../../Config/firebase";
import AppConfig from "../../Config/app-config.json";
import { useAuthState } from "react-firebase-hooks/auth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-confirm-alert/src/react-confirm-alert.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import $ from "jquery";
import Header from "../Header/Header";
import LoadingScreen from "../Generic/LoadingScreen/LoadingScreen";
import * as Consts from "../../Utilities/Consts";
import notificationSound from "../../Assets/Sounds/NotificationBell.mp3";

//lazy loading
const UsersModal = lazy(()=> import( "../../Components/UsersModal/UsersModal"));
const CommentsModal = lazy(( ) => import("../../Components/CommentsModal/CommentsModal"));
const Home = lazy(() => import("../../Pages/Home/Home"));
const Footer = lazy(() => import("../../Components/Footer/Footer"));
const AuthPage = lazy(() => import("../../Pages/AuthPage/AuthPage"));
const AddNewPost = lazy(() => import("../../Pages/AddNewPost/AddNewPost"));
const UsersProfile = lazy(() =>
  import("../../Pages/UsersProfile/UsersProfile")
);
const PostPage = lazy(() => import("../../Pages/PostPage/PostPage"));
const Messages = lazy(() => import("../../Pages/Messages/Messages"));
const MobileNav = lazy(() => import("../MobileNav/MobileNav"));
const MobileNotifications = lazy(() =>
  import("../../Pages/MobileNotifications/MobileNotifications")
);
const MyProfile = lazy(() => import("../../Pages/MyProfile/MyProfile"));
const EditProfile = lazy(() => import("../../Pages/EditProfile/EditProfile"));
const Reels = lazy(() => import("../../Pages/Reels/Reels"));
const About = lazy(() => import("../../Pages/About/About"));
const Explore = lazy(() => import("../../Pages/Explore/Explore"));
const ErrorRoute = lazy(() => import("../../Pages/ErrorRoute/ErrorRoute"));
const MobileHeader = lazy(() =>  import("../../Components/MobileHeader/MobileHeader"));
const MobileSearch = lazy(() => import("../../Pages/MobileSearch/MobileSearch"));
const Suggestions = lazy(() => import("../../Pages/Suggestions/Suggestions"));
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
    // returnPassword,
    suggestionsList,
    modalsState,
    notify,
    changeModalState,
    usersModalList,
    usersProfileData,
    reelsProfile,
    currentPostIndex,
    explore,
    loadingState
  } = context;
  const isAnyModalOpen = Object.keys(modalsState).map(w => modalsState[w]).some( p => p === true);
  const [user,loading] = useAuthState(auth);
  const history = useHistory();
  const [toggledNotiBell, setNotiBell] = useState(false);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        changeMainState("loadingState", {...loadingState, suggList: true});
        db.collection(Consts.USERS)
          .limit(150)
          .get()
          .then((query) => {
            changeMainState("loadingState", {...loadingState, suggList: false});
            query.forEach((user) => {
              updateSuggestionsList(user.data());
            });
          });
        changeMainState("currentUser", authUser);
        updateUserState(true);
        updateUID(authUser?.uid);
        updatedReceivedData();
        changeConnectivityStatus(authUser?.uid);
      } else {
        const recievedAuth = localStorage.getItem("user");
        if (recievedAuth) {
            //attempts to log in again using local storage data
          //   debugger
          // const { email, password } = JSON.parse(recievedAuth);
          // auth.signInWithEmailAndPassword(email, returnPassword(password));
        }else{
            // user logged out
             history.push("/auth");
             updateUserState(false);
        }
      }
    });
    // ----------------------

    return () => {
      //performs some clearn up actions
      unsubscribe();
    };
  }, []);
  useEffect(() => {
    const notificationBellOption = receivedData?.profileInfo?.professionalAcc?.notificationBell;
    const notificationBellType = notificationBellOption?.type?.toLowerCase();
  
    if(notificationBellOption?.state && notificationBellOption?.type && !toggledNotiBell){
        const lastUpdate = receivedData?.notifications?.list?.sort((a,b ) => b.date.seconds - a.date.seconds)[0];
        // console.log(new Date().getTime());
        const lastMessage = receivedData?.messages?.sort((a, b) => b?.lastMsgDate - a?.lastMsgDate)[0];
        const checkIfTimePassed = (time) => {
            const fifteenSecs = 15*1000;
            const dateNow = new Date();
           return dateNow - new Date(time * 1000) < fifteenSecs;
        }
        const diffTimesUpdate = checkIfTimePassed(lastUpdate?.date?.seconds);
        const diffTimesMsg = checkIfTimePassed(lastMessage);
        // Note to self 1*40*1000 = 1 minute,  5*40*1000 = 5 minutes,  10*40*1000 = 10 minutes ...
       //checks if the latest received element's date is less than a minutes ago.If so it fires a bell sound
        const timePassed = notificationBellType === "new updates" ? diffTimesUpdate : notificationBellType === "new messages" ? diffTimesMsg : (diffTimesUpdate || diffTimesMsg);
         const bellSound = new Audio(notificationSound);
         if((timePassed && lastUpdate?.uid !== receivedData?.uid)){
            setNotiBell(true);
            bellSound.play();
            const stopBell = setTimeout(() => {
                setNotiBell(false);
                const reverseBell = setTimeout(() => {
                    bellSound.pause();
                    clearTimeout(reverseBell);
                    clearTimeout(stopBell);
                  },3000);
              },300);
        }
    }
  },[receivedData?.notifications]);

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
    //<<make cleanup work here
    document.title = `${currentPage && currentPage + " • "}${AppConfig.title}`;
    if(!navigator.onLine){
      notify("You are Offline! Please reconnect and try again.", "error");
      history.replace("/auth");
    }
  }, [currentPage]);
  
  return (
    <Fragment>
      <main>
        {/* Modals */}
        {/*  comments modal */}
        <Suspense fallback={<LoadingScreen />}>
            {modalsState?.users && usersModalList && Object.keys(usersModalList).length > 0 ? <UsersModal /> : null}
          {modalsState?.comments ? (
            <CommentsModal context={context} />
          ) : null}
          <div
              style={{
                opacity: isAnyModalOpen ? "1" : "0",
                display: isAnyModalOpen ? "block" : "none",
                transition: "all 0.5s linear",
              }}
              className="backdrop"
              onClick={() => changeModalState("users", false, "", "")}
            ></div>
          {loading && <div className="global__loading"><span className="global__loading__inner"></span></div>}          
        </Suspense>
        
        {/* Notifications container */}
        <ToastContainer />
        {/* Routes */}
       
          <Suspense fallback={<LoadingScreen />}>
            <Switch>
            <Route exact path="/">
              {(user && receivedData && Object.keys(receivedData).length) > 0 ? <Header/> : <LoadingScreen />}
              <MobileHeader />
              <Home />
              <MobileNav />
              <Footer />
            </Route>
            <Route exact path="/auth" component={AuthPage} />
            <Route exact path="/messages">
              {(user && receivedData && Object.keys(receivedData).length) > 0 && <Header/>}
              { //Guards
                receivedData && Object.keys(receivedData).length > 0 && receivedData?.messages ?
                 <Messages history={history} />
                 : 
                <ErrorRoute type="403"/>
              }
             
              <MobileNav />
            </Route>
            <Route exact path="/add-post">
              {(user && receivedData && Object.keys(receivedData).length) > 0 && <Header/>}
              <MobileHeader />
              <AddNewPost />
              <MobileNav />
            </Route>
            <Route exact path="/notifications">
              {(user && receivedData && Object.keys(receivedData).length) > 0 && <Header/>}
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
              {(user && receivedData && Object.keys(receivedData).length) > 0 && <Header/>}
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
              {(user && receivedData && Object.keys(receivedData).length) > 0 && <Header/>}
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
              {(user && receivedData && Object.keys(receivedData).length) > 0 && <Header/>}
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
              {(user && receivedData && Object.keys(receivedData).length) > 0 && <Header/>}
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
            {(user && receivedData && Object.keys(receivedData).length) > 0 && <Header/>}
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
                {(user && receivedData && Object.keys(receivedData).length) > 0 && <Header/>}
                <MobileHeader />
                <About changeMainState={changeMainState} />
                <MobileNav />
                <Footer />
            </Route>
            <Route exact path="/search">
            {(user && receivedData && Object.keys(receivedData).length) > 0 && <Header/>}
              <MobileHeader/>
              <MobileSearch />
              <MobileNav />
              <Footer />
            </Route>
            <Route path="/explore/people">
            {(user && receivedData && Object.keys(receivedData).length) > 0 && <Header/>}
            <MobileHeader />
            {
              suggestionsList && suggestionsList.length > 0 ?
              <Suggestions />
              :
              <ErrorRoute type="403" />
            }
            <MobileNav />
            <Footer />
            </Route>
            <Route path="*" >
                {(user && receivedData && Object.keys(receivedData).length) > 0 && <Header/>}
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
