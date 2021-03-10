import React , {useState, useContext} from "react";
import Auxiliary from "../../Components/HOC/Auxiliary";
import appleStore from "../../Assets/get-app-apple.png";
import gpStore from "../../Assets/get-app-gp.png";
// import logo from "../../Assets/logo.png";
import {GrInstagram} from "react-icons/gr";
import {auth, db, googleProvider, twitterProvider, facebookProvider, phoneProvider} from "../../Config/firebase";
import {withRouter} from "react-router-dom";
import {AppContext} from "../../Context";
import {useAuthState} from "react-firebase-hooks/auth";

// import firebase from "firebase";


const AuthPage =(props)=>{
    var context = useContext(AppContext);
    const [_,loading] = useAuthState(auth);
    //----------- states----------------------
    const [signUpState, switchToSignUp] = useState(false);
    const [signUpEmail, setSignUpEmail] = useState("");
    const [signUpPassword, setSignUpPassword] = useState("");
    const [signUpUsername, setSignUpUsername] = useState("");
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [getPasswordMode, setPasswordMode] = useState(false);
    // const [posts, setPosts] = useState([]);
    //-----x------ states--------x--------------
    // const loginSubmit=(event)=>{
    //     event.preventDefault
    // }
    
    const submitForm= async (event, authType)=>{
        
        event.preventDefault();
        var {resetAllData, uid, updateSuggestionsList, isUserOnline, updateUID,receivedData, updatedReceivedData, updateUserState, suggestionsList} = context;
        if(authType === "signUp"){
            resetAllData();  //clears data before adding new one           
            setTimeout(()=>{
                if(!isUserOnline){  //avoids data overlapping
                                auth.createUserWithEmailAndPassword(signUpEmail, signUpPassword).then(cred=>{
                                        db.collection("users").doc(cred.user.uid).set({
                                                uid: cred.user.uid,
                                                userName: signUpUsername,
                                                posts: [],
                                                followers: [],
                                                following: [],
                                                messages: [],
                                                bio: "",
                                                websiteUrl: "",
                                                homePosts: [],
                                                latestLikedPosts: [],
                                                savedposts: [],
                                                stories: [],
                                                notifications: {isNewMsg: false,isUpdate: false, list: []},
                                                isVerified: false,
                                                userAvatarUrl: "" //auth.currentUser
                                        }).then((res)=>{
                                            setSignUpEmail("");
                                            setSignUpPassword("");
                                            setSignUpUsername("");
                                            props.history.push("/");
                                            
                                        })
                                        
                                    }).catch((err)=>{
                                        alert(err.message);
                                    })
                                }
                        },1000);
                            
            }else if(authType ===  "login"){
                        resetAllData(); 
                        setTimeout(()=>{
                            if(!isUserOnline){ //avoids data overlapping
                            
                                auth.signInWithEmailAndPassword(loginEmail, loginPassword).then(res =>{
                                        setLoginEmail("");
                                        setLoginPassword("");
                                        
                                    auth.onAuthStateChanged( authUser =>{
                                        db.collection("users").get().then((query)=>{
                                            query.forEach((user)=>{
                                                    updateSuggestionsList(user.data());
                                            })
                                            updateUserState(true);
                                            updateUID(authUser?.uid);
                                            updatedReceivedData();
                                           
                                        });
                                        
                                    })
                                    props.history.push("/");
                                }).catch((err)=>{
                                        alert(err.message);
                                })
                            }
                            
                        },2000);
                        
            }
       
    }
    const signInMethods=(method)=>{
        switch(method){
            case "googleProvider":
                    auth.signInWithPopup(googleProvider).then(cred=>{
                    //     db.collection("users").doc(cred.user.uid).set({
                    //         uid: cred.user.uid,
                    //         userName: signUpUsername,
                    //         posts: [],
                    //         followers: [],
                    //         following: [],
                    //         messages: [],
                    //         bio: "",
                    //         homePosts: [],
                    //         latestLikedPosts: [],
                    //         savedposts: [],
                    //         stories: [],
                    //         notifications: {isNewMsg: false, isUpdate: false, list: []},
                    //         isVerified: false,
                    //         userAvatarUrl: "" //auth.currentUser
                    // }).then((res)=>{
                    //     console.log(res, "successful");
                    //     setSignUpEmail("");
                    //     setSignUpPassword("");
                    //     setSignUpUsername("");
                    //     props.history.push("/");
                        
                    // })
                    
                }).catch((err)=>{
                    alert(err.message);
                })
            break;
            case "facebookProvider":
                    // auth.signInWithPopup(facebookProvider);
            break;
            case "twitterProvider":
                    // auth.signInWithPopup(twitterProvider);
            break;
            case "phoneProvider":
                    // auth.signInWithPopup(phoneProvider);
            break;
            default:
                    auth.signInWithPopup(googleProvider);

        }
        
    }
    const resetEmail=()=>{
        auth.sendPasswordResetEmail(loginEmail).then(res =>{
            console.log(res);
            alert("A password reset config has been send to your email");
        }).catch(err=>{
            alert("Error has occurred", err);
        });
    }
    return(
        <Auxiliary>
             <section className="auth--main flex-column">
                <div className="auth flex-column">
                    <div className="auth--upper--card flex-column">
                        <div className="auth--logo flex-row">
                            <span className="mr-2"><GrInstagram /></span>
                            <h1 className="logoText">Voxgram</h1>
                        </div>
                        
                        {
                            // log in state
                            !signUpState ?
                            <form onSubmit={(event) => submitForm(event, "login")} className="auth--input--form flex-column">
                                {
                                   !getPasswordMode ?
                                    <div className="flex-column">
                                        <input required autoFocus value={loginEmail} onChange={(e)=> setLoginEmail(e.target.value)} type="text"  placeholder="Email" />
                                        <input required value={loginPassword} onChange={(e)=> setLoginPassword(e.target.value)} type="password"  placeholder="Password" /> 
                                        <input className={loading ? "disabled" : ""} type="submit" value={loading ?"Loading...": "Log In"} />
                                        <span onClick={()=> setPasswordMode(true)} className="forgot__pass">Forgot password?</span>
                                    </div>
                                    : 
                                    <div>
                                        <span onClick={()=> setPasswordMode(false)} className="back__Btn">Back</span>
                                        <input required autoFocus value={loginEmail} onChange={(e)=> setLoginEmail(e.target.value)} type="text"  placeholder="Email" />
                                        <span onClick={()=> resetEmail()} className="resetPassBtn">Resest password through email</span>
                                    </div>
                                    
                                }
                                {/* <div>
                                     <span onClick={()=>signInMethods("googleProvider")}>Sign in with Google</span>
                                     <span onClick={()=> signInMethods("facebookProvider")}>Sign in with Facebook</span>
                                     <span onClick={()=> signInMethods("twitterProvider")}>Sign in with Twitter</span>
                                     <span onClick={()=>signInMethods("phoneProvider")}>Sign in with a phone number</span>
                                    </div> */}
                            </form>
                            // sign up state
                            :
                            <div>
                                <h4 className="auth--signup--msg">Sign up to see photos and videos from your friends.</h4>
                               <form onSubmit={(event) => submitForm(event, "signUp")} className="auth--input--form flex-column">
                                    <input required autoFocus value={signUpEmail} onChange={(e)=> setSignUpEmail(e.target.value)} type="email"  placeholder="Email" />
                                    <input required value={signUpUsername} onChange={(e)=> setSignUpUsername(e.target.value)} type="text"  placeholder="Username" />
                                    <input required value={signUpPassword} onChange={(e)=> setSignUpPassword(e.target.value)} type="password"  placeholder="Password" />
                                    <input required type="password"  placeholder="Re-type Password" />
                                    <input className={loading ? "disabled" : ""}  type="submit" value={loading ?"Loading...": "Sign Up"} />
                                </form> 
                            </div>
                            
                        }
                        
                    </div>
                    <div className="auth--bottom--card">
                        {
                           !signUpState ?
                           <span>Don't have an account? <h6 onClick={()=> switchToSignUp(!signUpState)}>Sign up</h6></span>
                           :
                           <span>Have an account? <h6 onClick={()=> switchToSignUp(!signUpState)}>Log in</h6></span>
                        }
                       

                        
                    </div>
                    <p className="auth__get__app">Get the app.</p>
                    <div className="auth--available--stores">
                        <div className="auth--stores--inner flex-row">
                           <img src={appleStore} alt="apple store" />
                            <img src={gpStore} alt="google store" /> 
                        </div>
                        
                    </div>
                </div>
                <div className="auth--footer--container flex-row">
                    <ul className="auth--footer--ul flex-row">
                        <li>ABOUT</li>
                        <li>HELP</li>
                        <li>PRESS</li>
                        <li>API</li>
                        <li>JOBS</li>
                        <li>PRIVACY</li>
                        <li>TERMS</li>
                        <li>LOCATIONS</li>
                        <li>TOP ACCOUNTS</li>
                        <li>HASHTAGS</li>
                        <li>LANGUAGE</li>
                    </ul>
                    <div className="auth--copyright">
                        <span>This app was made for personal use</span>
                        <span>@2020 - {new Date().getFullYear()} Instagram clone made by Mahmoud Farargy</span>
                    </div>
                    
                </div>
            </section>
        </Auxiliary>
    )
}

export default withRouter(AuthPage);