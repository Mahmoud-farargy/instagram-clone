import React, { Fragment, useEffect, useContext, Suspense, lazy } from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import { AppContext } from "../../Context";
import { db, auth } from "../../Config/firebase";
import AppConfig from "../../Config/app-config.json";
import { useAuthState } from "react-firebase-hooks/auth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-confirm-alert/src/react-confirm-alert.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import $ from "jquery";
import Header from "../Header/Header";
import LoadingScreen from "../Generic/LoadingScreen/LoadingScreen";

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
//--xx---//
const App = (props) => {
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
    currentPostIndex
  } = context;
  const isAnyModalOpen = Object.keys(modalsState).map(w => modalsState[w]).some( p => p === true);
  const [_, loading] = useAuthState(auth);
  // experiment
  // useEffect(() => {
  // firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
  //   .then((res) => {
  //       console.log(res);
  //     // Existing and future Auth states are now persisted in the current
  //     // session only. Closing the window would clear any existing state even
  //     // if a user forgets to sign out.
  //     // ...
  //     // New sign-in will be persisted with session persistence.
  //     // return firebase.auth().signInWithEmailAndPassword("user5@gmail.com", "123456Jb");
  //   })
  //   .catch((error) => {
  //     // Handle Errors here.
  //     console.log(error.code);
  //     console.log(error.message);
  //   });
  //  --------
  // var currUid =  u.currentUser;
  // var userDatabaseRef = database.ref("/status" + "RJRllL1KMje3HadGMCJUi5h6BmE2");
  // console.log(database.ref().child("/users" + "RJRllL1KMje3HadGMCJUi5h6BmE2").onDisconnect().update({status: "offline"}));
  //     var isOfflineForDatabase = {
  //        state: 'offline',
  //        last_changed: firebase.database.ServerValue.TIMESTAMP,
  //    };

  //    var isOnlineForDatabase = {
  //        state: 'online',
  //        last_changed: firebase.database.ServerValue.TIMESTAMP,
  //    };
  //        // and `false` when disconnected.
  //    database.ref('.info/connected').on('value', function(snapshot) {
  //        // If we're not currently connected, don't do anything.
  //        if (snapshot.val() == false) {
  //            return;
  //        };
  //        console.log(snapshot);
  //        db.collection("users").doc("RJRllL1KMje3HadGMCJUi5h6BmE2").update({
  //            test: "online"
  //        })
  // If we are currently connected, then use the 'onDisconnect()'
  // method to add a set which will only trigger once this
  // client has disconnected by closing the app,
  // losing internet, or any other means.
  //    userDatabaseRef.onDisconnect().set(isOfflineForDatabase).then(function() {
  //    The promise returned from .onDisconnect().set() will
  //    resolve as soon as the server acknowledges the onDisconnect()
  //    request, NOT once we've actually disconnected:
  //    https://firebase.google.com/docs/reference/js/firebase.database.OnDisconnect

  //    We can now safely set ourselves as 'online' knowing that the
  //    server will mark us as offline once we lose connection.
  //    userDatabaseRef.set(isOnlineForDatabase);
  //    });
  //    });
  // }, [uid]);
  //----

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        db.collection("users")
          .limit(10)
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
      } else {
        const recievedAuth = localStorage.getItem("user");
        if (recievedAuth) {
            //attempting to log in again using local storage data
          const { email, password } = JSON.parse(recievedAuth);
          auth.createUserWithEmailAndPassword(email, returnPassword(password));
        }else{
            // user logged out
             props.history.push("/auth");
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
    document.title = `${currentPage} • ${AppConfig.title}`;
    if(!navigator.onLine){
      notify("You are Offline! Please reconnect and try again.", "error");
      props.history.push("/auth");
    }
  }, [currentPage]);
  return (
    <Fragment>
      <main>
        {/* Modals */}
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
              className="backdrop "
              onClick={() => changeModalState("users", false, "", "")}
            ></div>
          {loading && <div className="global__loading"></div>}
        </Suspense>
        
        {/* Notifications container */}
        <ToastContainer />
        {/* Routes */}
        <Switch>
          <Suspense fallback={<LoadingScreen />}>
            <Route exact path="/">
              <Header />
              <Home />
              <MobileNav />
              <Footer />
            </Route>
            <Route exact path="/auth" component={AuthPage} />
            <Route exact path="/messages">
              <Header />
              { //Guards
                receivedData && Object.keys(receivedData).length > 0 && receivedData?.messages ?
                 <Messages history={props.history} />
                 : 
                 <div>
                    <h3 className="flex-column justify-content-center align-items-center text-center">Sorry, cannot access this page now.</h3>
                </div>
              }
             
              <MobileNav />
            </Route>
            <Route exact path="/add-post">
              <Header />
              <AddNewPost />
              <MobileNav />
            </Route>
            <Route exact path="/notifications">
              <Header />
              {
                receivedData && receivedData?.notifications ?
                 <MobileNotifications context={context} />
                 :
                 <div>
                    <h3 className="flex-column justify-content-center align-items-center text-center">Sorry, cannot access this page now.</h3>
                 </div>

              }
             
              <MobileNav />
            </Route>
            <Route exact path="/profile">
              <Header />
              {
                receivedData && Object.keys(receivedData).length > 0 ?
                  <MyProfile />
                 :
                 <div>
                    <h3 className="flex-column justify-content-center align-items-center text-center">Sorry, cannot access this page now.</h3>
                 </div>

              }
              
              <MobileNav />
              <Footer />
            </Route>
            <Route path="/user-profile">
              <Header />
              {
                usersProfileData && Object.keys(usersProfileData).length > 0 && usersProfileData?.posts ? 
                <UsersProfile />
                :
                <div>
                   <h3 className="flex-column justify-content-center align-items-center text-center">Sorry, cannot access this page now.</h3>
                </div>
              }
              
              <MobileNav />
              <Footer />
            </Route>
            <Route exact path="/browse-post">
              <Header />
              {
                Object.keys(usersProfileData).length > 0 && usersProfileData?.posts &&  usersProfileData?.posts[currentPostIndex?.index] ?
                <PostPage />
                : 
                <div>
                  <h3 className="flex-column justify-content-center align-items-center text-center">Sorry, cannot access this page now.</h3>
                </div>
              }
              
              <MobileNav />
            </Route>
            <Route exact path="/edit-profile">
              <Header />
              {
                 receivedData && Object.keys(receivedData).length > 0 && receivedData?.profileInfo?
                  <EditProfile />
                  :
                <div>
                  <h3 className="flex-column justify-content-center align-items-center text-center">Sorry, cannot access this page now.</h3>
                </div>
              }
             
              <MobileNav />
              <Footer />
            </Route>
            <Route exact path="/reels">
              {  
                reelsProfile ?
                  <Reels context={context} routeHistory={props.history} />
                :
                <div>
                  <h3 className="flex-column justify-content-center align-items-center text-center">Sorry, cannot access this page now.</h3>
                </div>
              }
            
            </Route>
            <Route exact path="/about">
                <Header />
                <About changeMainState={changeMainState} />
                <MobileNav />
                <Footer />
            </Route>
          </Suspense>
        </Switch>
      </main>
    </Fragment>
  );
};

export default withRouter(App);
