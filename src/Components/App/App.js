import React, { Fragment, useEffect, useContext, Suspense, lazy} from "react";
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
    returnPassword,
    modalsState,
    notify,
    changeModalState,
    usersModalList,
    usersProfileData,
    reelsProfile,
    currentPostIndex,
    explore
  } = context;
  const isAnyModalOpen = Object.keys(modalsState).map(w => modalsState[w]).some( p => p === true);
  const [user,loading] = useAuthState(auth);
  const history = useHistory();
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        db.collection(Consts.USERS)
          .limit(150)
          .get()
          .then((query) => {
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
            //attempting to log in again using local storage data
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
    $(document).ready(() => {
      if (isAnyModalOpen) {
        $("body").css("overflow", "hidden");
       
      } else {
        $("body").css("overflow", "auto");
      }
    });
  }, [isAnyModalOpen]);

  useEffect(() => {
    //<<make cleanup work here
    document.title = `${currentPage && currentPage + " • "}${AppConfig.title}`;
    if(!navigator.onLine){
      notify("You are Offline! Please reconnect and try again.", "error");
      history.push("/auth");
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
          {loading && <div className="global__loading"></div>}          
        </Suspense>
        
        {/* Notifications container */}
        <ToastContainer />
        {/* Routes */}
       
          <Suspense fallback={<LoadingScreen />}>
            <Switch>
            <Route exact path="/">
              {(user && receivedData && Object.keys(receivedData).length) > 0 && <Header/>}
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
              <AddNewPost />
              <MobileNav />
            </Route>
            <Route exact path="/notifications">
              {(user && receivedData && Object.keys(receivedData).length) > 0 && <Header/>}
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
              {
                receivedData && Object.keys(receivedData).length > 0 ?
                <MyProfile />
                 :
                <ErrorRoute type="403"/>

              }
              
              <MobileNav />
              <Footer />
            </Route>
            <Route path="/user-profile">
              {(user && receivedData && Object.keys(receivedData).length) > 0 && <Header/>}
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
                <About changeMainState={changeMainState} />
                <MobileNav />
                <Footer />
            </Route>
            <Route path="*" >
            {(user && receivedData && Object.keys(receivedData).length) > 0 && <Header/>}
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
