import React , {useState, useContext, useEffect} from "react";
import Auxiliary from "../../Components/HOC/Auxiliary";
import appleStore from "../../Assets/get-app-apple.png";
import gpStore from "../../Assets/get-app-gp.png";
import instaReview from "../../Assets/iphone-with-profile.jpg";
import {GrInstagram} from "react-icons/gr";
import {auth, db, googleProvider, twitterProvider, facebookProvider, phoneProvider} from "../../Config/firebase";
import {withRouter} from "react-router-dom";
import {AppContext} from "../../Context";
import {useAuthState} from "react-firebase-hooks/auth";

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
    const [reTypedPassword, setRePassword] = useState("");
    const [inProgress, setLoading] = useState(false);
    const [getPasswordMode, setPasswordMode] = useState(false);
    //-----x------ states--------x--------------
    useEffect(() =>{
        
        return () => {
            context.changeMainState("currentPage",signUpState ? "Sign up" : "Log in");
        };
       
    },[signUpState]);
    const submitForm= async (event, authType)=>{
        
        event.preventDefault();
        var {resetAllData, updateSuggestionsList, isUserOnline, updateUID, updateUserState, notify} = context;
        if(authType === "signUp"){
            resetAllData();  //clears data before adding new one 
            setLoading(true);          
            setTimeout(()=>{
                if(!isUserOnline){  //avoids data overlapping
                    
                                auth.createUserWithEmailAndPassword(signUpEmail, signUpPassword).then(cred=>{
                                        setLoading(false);
                                        db.collection("users").doc(cred.user.uid).set({
                                                uid: cred.user.uid,
                                                userName: signUpUsername,
                                                posts: [],
                                                followers: [],
                                                following: [],
                                                messages: [],
                                                profileInfo: {bio: "",website: "", gender: "", status: "", name:"", phoneNumber: "", professionalAcc: {show: true, category: "Just For Fun" }},
                                                homePosts: [],
                                                reels: [],
                                                latestLikedPosts: [],
                                                savedposts: [],
                                                stories: [],
                                                blockList: [],
                                                notifications: {isNewMsg: false,isUpdate: false, list: []},
                                                isVerified: false,
                                                userAvatarUrl: ""
                                        }).then((res)=>{
                                            setSignUpEmail("");
                                            setSignUpPassword("");
                                            setSignUpUsername("");
                                            props.history.push("/");
                                            notify("Welcome to Voxgram.");
                                            
                                        })
                                       
                                    }).catch((err)=>{
                                        setLoading(false);
                                        notify(err.message, "error");
                                    })
                                }
                        },1000);
                            
            }else if(authType ===  "login"){
                        resetAllData(); 
                       
                        setTimeout(()=>{
                            if(!isUserOnline){ //avoids data overlapping
                                setLoading(true);
                                auth.signInWithEmailAndPassword(loginEmail, loginPassword).then(() =>{
                                    setLoading(false);
                                        setLoginEmail("");
                                        setLoginPassword("");
                                        
                                    auth.onAuthStateChanged( authUser =>{
                                        db.collection("users").get().then((query)=>{
                                            query.forEach((user)=>{
                                                    updateSuggestionsList(user.data());
                                            })
                                            updateUserState(true);
                                            updateUID(authUser?.uid);
                                            // updatedReceivedData();
                                           
                                        });
                                    
                                    })
                                   const decipherPassword = (pass) =>{
                                        return pass && pass.split("").map(char => {
                                            return char.charCodeAt(0).toString(2);
                                        });
                                    }                    
                                   localStorage.setItem("user", JSON.stringify({email: loginEmail, password: decipherPassword(loginPassword)}));
                                   setTimeout(() => {
                                        props.history.push("/");
                                   }, 150);
                                   
                                }).catch((err)=>{
                                        setLoading(false);
                                        notify(err.message, "error");
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
                    //         profileInfo: {bio: "",website: "", gender: "", status: "", name:"", phoneNumber: "", professionalAcc: {show: true, category: "Just For Fun" }},
                    //         homePosts: [],
                    //         latestLikedPosts: [],
                    //         savedposts: [],
                    //         reels: [],
                    //         blockList: [],
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
    const resetEmail=(e)=>{
        e.preventDefault();
        const {notify} = context;
        setLoading(true);
        auth.sendPasswordResetEmail(loginEmail).then(res =>{
            setLoading(false);
            notify("A password reset config has been send to your email", "success");
        }).catch(err=>{
            setLoading(false);
            notify(`The email you entered does not exist in our database" ${err}`, "error");
        });
    }
    return(
        <Auxiliary>
             <section className="auth--main flex-column">
                <div className="auth--inner w-100 flex-row">

                
                <div className="auth--review--pic flex-column">
                    <img src={instaReview} alt="insta review" />
                </div>
                <div className="auth flex-column mt-5">
                    <div className="auth--upper--card w-100 flex-column">
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
                                        <input className={loading || (!loginEmail || !loginPassword) || inProgress ? "disabled" : ""} disabled={loading || (!loginEmail || !loginPassword) || inProgress}  type="submit" value={loading ?"Loading...": "Log In"} />
                                        <span onClick={()=> setPasswordMode(true)} className="forgot__pass">Forgot password?</span>
                                    </div>
                                    : 
                                    <div>
                                        <span onClick={()=> setPasswordMode(false)} className="back__Btn">Back</span>
                                        <input required autoFocus value={loginEmail} onChange={(e)=> setLoginEmail(e.target.value)} type="text"  placeholder="Email" />
                                        <input type="submit" onClick={(e)=> resetEmail(e)} className={loading || loginEmail === "" || inProgress ? "disabled resetPassBtn": "resetPassBtn"} disabled={loading || loginEmail === "" || inProgress} value="Resest password through email"/>
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
                                    <input required value={reTypedPassword} onChange={(e)=> setRePassword(e.target.value)} type="password"  placeholder="Re-type Password" />
                                    <input className={loading || (!signUpEmail || !signUpPassword || !signUpUsername || !reTypedPassword) || inProgress ? "disabled" : ""}  disabled={loading || (!signUpEmail || !signUpPassword || !signUpUsername || !reTypedPassword) || inProgress} type="submit" value={loading ?"Loading...": "Sign Up"} />
                                </form> 
                            </div>
                            
                        }
                        
                    </div>
                    <div className="auth--bottom--card flex-row">
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
                           <img src={appleStore} className="mb-2" alt="apple store" />
                            <img src={gpStore} alt="google store" /> 
                        </div>
                        
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