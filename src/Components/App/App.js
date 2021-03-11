import React ,{Fragment, useEffect, useContext} from "react";
import {Switch, Route} from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../../Components/Footer/Footer";
import Home from "../../Pages/Home/Home";
import AuthPage from "../../Pages/AuthPage/AuthPage";
import AddNewPost from "../../Pages/AddNewPost/AddNewPost";
import {AppContext} from "../../Context";
import {db, auth} from "../../Config/firebase";
import AppConfig from "../../Config/app-config.json";
import {useAuthState} from "react-firebase-hooks/auth";
import UsersProfile from "../../Pages/UsersProfile/UsersProfile";
import PostPage from "../../Pages/PostPage/PostPage";
import Messages from "../../Pages/Messages/Messages";
import MobileNav from "../MobileNav/MobileNav";
import MobileNotifications from "../../Pages/MobileNotifications/MobileNotifications";
import UsersModal from "../../Components/UsersModal/UsersModal";
import MyProfile from "../../Pages/MyProfile/MyProfile";
import CommentsModal from "../../Components/CommentsModal/CommentsModal";
import EditProfile from "../../Pages/EditProfile/EditProfile";
import $ from "jquery";

const App = (props)=>{
    
    const context = useContext(AppContext);
    const {updatedReceivedData,updateUserState, updateUID, receivedData , updateSuggestionsList, currentPage} = context;
    // -------------
    // const test=()=>{ //resembles the functionality of adding posts to the followers
    //     const myArr={
    //         item1: [],
    //         item2: [],
    //         item3: []
    //     }
    //     Object.keys(myArr).map(el=>{
    //         return myArr[el].push("123")
    //     })
    //     console.log(myArr);
    // }
    // test()
    //-----------------------
   
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
                // user logged out
                updateUserState(false);
            }
            
        });
        // ----------------------
        
        return () =>{
            //perform some clearn up actions
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

    useEffect(() => {
        console.log("data>>>", receivedData);
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
              
               {/* Routes */}
                <Switch>
                    <Route exact path="/" >
                        <Header />
                        <Home />
                        <MobileNav />
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
                </Switch>
            </main>
        </Fragment>
    )
}

export default App;