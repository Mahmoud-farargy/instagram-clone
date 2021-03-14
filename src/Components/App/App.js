import React ,{Fragment, useEffect, useContext, Suspense, lazy} from "react";
import {Switch, Route} from "react-router-dom";
import {AppContext} from "../../Context";
import {db, auth} from "../../Config/firebase";
import AppConfig from "../../Config/app-config.json";
import {useAuthState} from "react-firebase-hooks/auth";
import UsersModal from "../../Components/UsersModal/UsersModal";
import CommentsModal from "../../Components/CommentsModal/CommentsModal";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import $ from "jquery";
import LoadingScreen from "../Generic/LoadingScreen/LoadingScreen";

//lazy loading
const Header = lazy(() => import("../Header/Header"));
const Home = lazy(() => import("../../Pages/Home/Home"));
const Footer = lazy(() => import("../../Components/Footer/Footer"));
const AuthPage = lazy(() => import("../../Pages/AuthPage/AuthPage"));
const AddNewPost = lazy(() => import("../../Pages/AddNewPost/AddNewPost"));
const UsersProfile = lazy(() => import("../../Pages/UsersProfile/UsersProfile"));
const PostPage = lazy(() => import("../../Pages/PostPage/PostPage"));
const Messages = lazy(() => import("../../Pages/Messages/Messages"));
const MobileNav = lazy(() => import("../MobileNav/MobileNav")); 
const MobileNotifications = lazy(() => import("../../Pages/MobileNotifications/MobileNotifications"));
const MyProfile = lazy(() => import("../../Pages/MyProfile/MyProfile"));
const EditProfile = lazy(() => import("../../Pages/EditProfile/EditProfile"));
//--xx---//
const App = (props)=>{
    
    const context = useContext(AppContext);
    const {updatedReceivedData,updateUserState, updateUID, receivedData , updateSuggestionsList, currentPage, changeMainState} = context;   
    const [_, loading] = useAuthState(auth);

    useEffect(()=>{
      const unsubscribe =  auth.onAuthStateChanged(authUser =>{
            // User logged in 
            
            // db.collection("users").doc("ukfQUwmvUGRy7sezEmsISuadjEh2").collection("followers").get().then((query)=>{
            //     query.forEach((user)=>{
            //         console.log(user.data());
            //     })
                
            // });

            if(authUser){
                
                db.collection("users").get().then((query)=>{
                    query.forEach((user)=>{
                            updateSuggestionsList(user.data());
                    })
                });
                changeMainState("currentUser", authUser);
                updateUserState(true);
                updateUID(authUser?.uid)
                updatedReceivedData(); 
                
            //   db.collection("users").doc(authUser?.uid).get().then(data=>{
                        
                        //  console.log(data.data().messages[randomId].message);
                        // if(authUser.displayName){
                        //     //don't update username
                        // }else{
                        //     // update it
                        //     return authUser.updateProfile({
                        //         displayName: data.data().userName
                        //     });
                            
                        // }
                // })
            }else{
                //attempting to log in again using local storage data
                const recievedAuth = localStorage.getItem("user");
                
                if(recievedAuth){
                    console.log("logout reached");
                    const {email, password} = JSON.parse(recievedAuth)
                const returnPassowrd = (binary) => {
                    const binCode = [];
                    for(var i=0; i< binary.length; i++){
                        binCode.push(String.fromCharCode(parseInt(binary[i], 2)));
                    }
                    return binCode.join("");
                }
                    auth.createUserWithEmailAndPassword(email, returnPassowrd(password));
                };
            
                // user logged out

                updateUserState(false);
            }
            
        });
        // ----------------------
        
        return () =>{
            //performs some clearn up actions
            unsubscribe();
        }

    },[])
    useEffect(()=>{
        $(document).ready(()=>{
            if(context?.openUsersModal || context?.openCommentsModal){
                $("body").css("overflow","hidden");
            }else{
                $("body").css("overflow","auto");
            }
        });        
    },[ context?.openUsersModal, context?.openCommentsModal ]);

    useEffect(() => { //<<make cleanup work here
        document.title = `${currentPage} • ${AppConfig.title}` ;
    },[currentPage]);
    return(
        <Fragment>
            <main>
                {/* Modals */}
              {
                  context?.openUsersModal ?
                  <UsersModal/>
                  : null
              } 
              {
                  context?.openCommentsModal ?
                  <CommentsModal context={context}/>
                  : null
              } 
              {
                  
                  loading &&
                  <div className="global__loading"></div>
              }
              {/* Notifications container */}
              <ToastContainer />
               {/* Routes */}
                <Switch>
                    <Suspense fallback={<LoadingScreen /> }>
                            <Route exact path="/" >
                            <Header />
                            <Home />
                            <MobileNav />
                            <Footer/>
                        </Route>
                        <Route exact path="/auth" component={AuthPage}  />
                        <Route exact path="/messages">
                            <Header />
                            <Messages messages={receivedData?.messages} />
                            <MobileNav />
                        </Route>
                        <Route exact path="/add-post">
                            <Header />
                            <AddNewPost  />
                            <MobileNav />
                        </Route>
                        <Route exact path="/notifications">
                            <Header />
                            <MobileNotifications context={context}/>
                            <MobileNav />
                        </Route>
                        <Route exact path="/profile">
                            <Header />
                            <MyProfile />
                            <MobileNav />
                            <Footer /> 
                        </Route>
                        <Route path="/user-profile">
                            <Header />
                            <UsersProfile />
                            <MobileNav />
                            <Footer /> 
                        </Route>
                        <Route exact path="/browse-post">
                            <Header />
                            <PostPage />
                            <MobileNav />
                        </Route >
                        <Route exact path="/edit-profile">
                            <Header />
                            <EditProfile/>
                            <MobileNav />
                            <Footer/>
                        </Route>
                    </Suspense>
                    
                </Switch>
            </main>
        </Fragment>
    )
}

export default App;