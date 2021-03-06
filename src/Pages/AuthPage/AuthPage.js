import React, { useState, useContext, useEffect, useRef } from "react";
import Auxiliary from "../../Components/HOC/Auxiliary";
import appleStore from "../../Assets/get-app-apple.png";
import gpStore from "../../Assets/get-app-gp.png";
import { GrInstagram } from "react-icons/gr";
import SignInOption from "./SignInOption/SignInOption";
import * as Consts from "../../Utilities/Consts";
import { anonInfo } from "../../info";
import AuthSubmissionBtn from "./AuthSubmissionBtn/AuthSubmissionBtn";
import {
  auth,
  db,
  googleProvider,
  twitterProvider,
  facebookProvider,
  githubProvider,
} from "../../Config/firebase";
import { withRouter, Link } from "react-router-dom";
import { AppContext } from "../../Context";
import { useAuthState } from "react-firebase-hooks/auth";
import AuthInput from "./AuthInput/AuthInput";
//-------------- Import slides-------------------
import loginRevBg from "../../Assets/phone-frame.png";
import slide1 from "../../Assets/Login-Slides/slide (1).jpg";
import slide2 from "../../Assets/Login-Slides/slide (2).jpg";
import slide3 from "../../Assets/Login-Slides/slide (3).jpg";
import slide4 from "../../Assets/Login-Slides/slide (4).jpg";
import slide5 from "../../Assets/Login-Slides/slide (5).jpg";
// ------x----------Import slides-------x--------

const AuthPage = (props) => {
  var context = useContext(AppContext);
  const [, loading] = useAuthState(auth);
  //-------------- states-------------------
  const [signUpState, switchToSignUp] = useState(false);
  const [formState, setFormState] = useState({
    signUpEmail:{val:"", isValid: false, regex:/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, errorMsg: "Please type a valid email."},
    signUpPassword:{val:"", isValid: false, regex:/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{7,20}$/, errorMsg: "Password must be between 7 and 20 characters long and contains at least one number, one lowercase letter, and one uppercase letter."},
    signUpUsername:{val:"", isValid: false, regex:/^(?=[a-zA-Z0-9._-]{4,19}$)(?!.*[_.]{2})[^_.].*[^_.]$/, errorMsg: "Username must be between 4 and 19 characters with no spaces. Underscore, dash and dot characters are allowed but should not be placed at the end."},
    fullName: {val: "", isValid: false, regex: /^[a-zA-Z\s]{3,25}$/ ,errorMsg: "Full Name must contain only letters and not exceed 25 characters."},
    loginEmail:{val:"", isValid: false, regex:/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, errorMsg: "The email address is badly formatted."},
    loginPassword:{val:"", isValid: true, regex: /^[a-zA-Z0-9 ,_-]+$/,errorMsg: ""}
  })
  const [isSubmitted, setSubmission] =  useState(false);
  const [inProgress, setLoading] = useState(false);
  const [getPasswordMode, setPasswordMode] = useState(false);
  const [greeting, setGreeting] = useState("Good Morning");
  //-----x------ states--------x--------------
 //----------- ref(s)----------------------
 const _isMounted = useRef(true);
 const timeouts = useRef(null);
 //-----x------ end ref(s)--------x--------------
  const onInputChange = (val, name) => {
  const isValidInput = formState[name]?.regex?.test(val);
    setFormState({
      ...formState,
      [name]: {...formState[name], val, isValid: isValidInput}
    });
  };
  const resetForm = () =>{
    let newObj= {};
    Object.keys(formState).map(key =>  newObj = {...newObj, [key]: {...formState[key], val: "", isValid: false}});
    setFormState(newObj)
    setSubmission(false);
  }
  let activeSlideIndex = 0;

  const slide = () => {
          const slideContainer = document.querySelector("#slideContent");
          if( slideContainer){
            const slideItems = slideContainer.querySelectorAll("img");
            slideItems.forEach(item => item.classList.remove("active__slide"));
            activeSlideIndex = activeSlideIndex + 1 >= slideItems.length ? 0 : activeSlideIndex + 1;
            slideItems[activeSlideIndex].classList.add("active__slide");
          }
  }
  useEffect(() => {
    return () => {
      context.changeMainState(
        "currentPage",
        signUpState ? "Log in" : "Sign up"
      );
    };
  }, [signUpState]);
  useEffect(()=> {
  var silderInterval;
  if((window.innerWidth || document.documentElement.clientWidth) >= 670){
    silderInterval = setInterval(slide, 4000);
  }
  setGreeting(context?.currentHour > 12 ? "Good evening": "Good morning");
   return () => {
     setLoading(false);
     window.clearInterval(silderInterval);
     window.clearTimeout(timeouts?.current);
     _isMounted.current = false;
   }
  },[]);
  const decipherPassword = (pass) => {
    return (
      pass &&
      pass.split("").map((char) => {
        return char.charCodeAt(0).toString(2);
      })
    );
  };
  const loginWithEmail = (email, password) => {
    var {
      updateUID,
      updateUserState,
      notify,
      receivedData,
      currentUser,
      updatedReceivedData,
      isUserOnline,
      authLogout
    } = context;
    timeouts.current = setTimeout(() => {
      //avoids data overlapping
      if (!isUserOnline) {
          if(formState.loginEmail?.val || email === anonInfo.email){
              auth
              .signInWithEmailAndPassword(
                email.toLowerCase().trim(),
                password
              )
              .then(() => {
              if(_isMounted?.current){
                  auth.onAuthStateChanged((authUser) => {
                    updateUserState(true);
                    updateUID(authUser?.uid);
                  });
                  localStorage.setItem(
                    "user",
                    JSON.stringify({
                      email: email.toLowerCase(),
                      password: decipherPassword(password),
                    })
                  );
                  resetForm();
                  timeouts.current = setTimeout(() => {
                    updatedReceivedData();
                    notify(
                      `${greeting}, ${
                        receivedData?.userName || currentUser?.displayName || "User"
                      }`
                    );
                    setLoading(false);
                    props.history.push("/");
                  }, 150);
              }

            })
            .catch((err) => {
              if(_isMounted?.current){
                setLoading(false);
                notify(err?.message, "error");
              }
            });
          }else{
            setLoading(false);
            notify(formState.loginEmail?.errorMsg,"error");
          }
      } else {
        setLoading(false);
        authLogout(props.history);
        notify("It seems like you haven't logged out properly last time. Please try again.","error");
      }
    }, 1000);

  }
  const submitForm = async (event, authType) => {
    event.preventDefault();
    setSubmission(true);
    var {
      resetAllData,
      isUserOnline,
      notify,
      authLogout,
      updatedReceivedData
    } = context;
    setLoading(true);
    if (authType === "signUp") {
      resetAllData(); //clears data before adding new one

      timeouts.current = setTimeout(() => {
        if (!isUserOnline) {
          //avoids data overlapping
          if (formState.signUpEmail?.isValid) {
            if (formState.fullName?.isValid) {
              if (formState.signUpUsername?.isValid) {
                if (formState.signUpPassword?.isValid) {
                          auth
                            .createUserWithEmailAndPassword(
                              formState.signUpEmail.val?.toLowerCase().trim(),
                              formState.signUpPassword?.val
                            )
                            .then((cred) => {
                              if(_isMounted?.current){
                                db.collection(Consts.USERS)
                                  .doc(cred.user.uid)
                                  .set({
                                    uid: cred.user.uid,
                                    userName: formState.signUpUsername?.val,
                                    posts: [],
                                    followers: [],
                                    following: [],
                                    followRequests: {received:[], sent: []},
                                    messages: [],
                                    profileInfo: {
                                      bio: "",
                                      website: "",
                                      gender: "Male",
                                      status: "Single",
                                      name: formState.fullName?.val.trim(),
                                      phoneNumber: "",
                                      birthday: "",
                                      theme: "lightMode",
                                      professionalAcc: {
                                        show: true,
                                        category: "Just For Fun",
                                        suggested: true,
                                        status: true,
                                        reelsForFollowing: false,
                                        notificationBell: { state: false, type: "Both" },
                                        private: false,
                                        suggNotFollowed: false,
                                        disableComments: false
                                      },
                                      sort: {
                                        sortBy: "Random",
                                        sortDirection: "Descending",
                                        filter: "None",
                                      },
                                      accountCreationDate: new Date(),
                                      registrationMethod: "email",
                                    },
                                    homePosts: [],
                                    reels: [],
                                    latestLikedPosts: [],
                                    savedposts: [],
                                    stories: [],
                                    blockList: [],
                                    notifications: {
                                      isNewMsg: false,
                                      isUpdate: false,
                                      list: [],
                                    },
                                    isVerified: false,
                                    userAvatarUrl: "",
                                  })
                                  .then(() => {
                                    if(_isMounted?.current){
                                      auth.currentUser.updateProfile({
                                        displayName: formState.signUpUsername?.val,
                                      });
                                      localStorage.setItem(
                                        "user",
                                        JSON.stringify({
                                          email: formState.signUpEmail?.val.toLowerCase(),
                                          password: decipherPassword(formState.signUpPassword?.val),
                                        })
                                      );
                                      resetForm();
                                      updatedReceivedData();
                                      timeouts.current = setTimeout(() => {
                                        notify(
                                          "Welcome to Voxgram. Start by adding posts to your account."
                                        );
                                        setLoading(false);
                                        props.history.push("/");
                                      }, 150);
                                    }
                                  });
                              }
                            })
                            .catch((err) => {
                              if(_isMounted?.current){
                                setLoading(false);
                                notify(err.message, "error");
                              }
                            }); 
                } else {
                  setLoading(false);
                  notify(
                    formState.signUpPassword?.errorMsg,
                    "error"
                  );
                }
              } else {
                setLoading(false);
                notify(
                  formState.signUpUsername?.errorMsg,
                  "error"
                );
              }
            } else {
              setLoading(false);
              notify(
                formState.fullName?.errorMsg,
                "error"
              );
            }
          } else {
            setLoading(false);
            notify(formState.signUpEmail?.errorMsg, "error");
          }
        } else {
          authLogout(props.history);
          setLoading(false);
          notify("It seems like you haven't logged out properly last time. Please try again.","error");
        }
      }, 1000);
    } else if (authType === "login") {
      resetAllData();
      loginWithEmail(formState.loginEmail?.val, formState.loginPassword?.val);
    }
  };
  const signInMethods = (method) => {
    switch (method) {
      //google
      case "googleProvider":
        setLoading(true);
        auth
          .signInWithPopup(googleProvider)
          .then((cred) => {
            if(_isMounted?.current){
                setLoading(false);
                const {
                  profile: { email, name, picture, given_name },
                  isNewUser,
                } = cred?.additionalUserInfo;
                if (isNewUser) {
                  db.collection(Consts.USERS)
                    .doc(cred.user.uid)
                    .set({
                      uid: cred.user.uid,
                      userName: trimUserName(name),
                      posts: [],
                      followers: [],
                      following: [],
                      followRequests: {received:[], sent: []},
                      messages: [],
                      profileInfo: {
                        bio: "",
                        website: "",
                        gender: "Male",
                        status: "Single",
                        name: given_name || "",
                        phoneNumber: "",
                        birthday: "",
                        theme: "lightMode",
                        professionalAcc: {
                          show: true,
                          category: "Just For Fun",
                          suggested: true,
                          status: true,
                          reelsForFollowing: false,
                          notificationBell: { state: false, type: "Both" },
                          private: false,
                          suggNotFollowed: false,
                          disableComments: false
                        },
                        sort: {
                          sortBy: "Random",
                          sortDirection: "Descending",
                          filter: "None",
                        },
                        accountCreationDate: new Date(),
                        registrationMethod: "google",
                      },
                      homePosts: [],
                      reels: [],
                      latestLikedPosts: [],
                      savedposts: [],
                      stories: [],
                      blockList: [],
                      notifications: {
                        isNewMsg: false,
                        isUpdate: false,
                        list: [],
                      },
                      isVerified: false,
                      userAvatarUrl: picture,
                    })
                    .then(() => {
                      if(_isMounted?.current){
                        timeouts.current = setTimeout(() => {
                          setLoading(false);
                          context.updatedReceivedData();
                          context.notify(
                            `Welcome to Voxgram${given_name && ", " +given_name}. Start by adding posts to your account.`
                          );
                          props.history.push("/");
                        }, 150);
                      }
                    });
                }else{
                  timeouts.current = setTimeout(() => {
                    setLoading(false);
                      context.notify(`${greeting}, ${given_name || "User"}.`);
                      props.history.push("/");
                  }, 150);
                }
                localStorage.setItem(
                  "user",
                  JSON.stringify({
                    email: email?.toLowerCase() || name || "random",
                    password: "3039ur3uff",
                  })
                );
            }
          })
          .catch((err) => {
            if(_isMounted?.current){
              setLoading(false);
              context.notify(err.message, "error");
            }
          });
        break;
      case "facebookProvider":
        auth.signInWithPopup(facebookProvider).then((res) => {
          if(_isMounted?.current){
              console.log(res);
          }
        });
        break;
      case "anonymousProvider":
        setLoading(true);
        const { email, pass } = anonInfo;
        loginWithEmail(email, pass);
      break;
      case "twitterProvider":
        setLoading(true);
        auth
          .signInWithPopup(twitterProvider)
          .then((cred) => {
            if(_isMounted?.current){
                setLoading(false);
                const {
                  profile: {
                    name,
                    profile_image_url,
                    profile_image_url_https,
                    screen_name,
                    userName,
                  },
                  isNewUser,
                } = cred?.additionalUserInfo;
                if (isNewUser) {
                  db.collection(Consts.USERS)
                    .doc(cred.user.uid)
                    .set({
                      uid: cred.user.uid,
                      userName: trimUserName(userName || name || screen_name || ""),
                      posts: [],
                      followers: [],
                      following: [],
                      followRequests: {received:[], sent: []},
                      messages: [],
                      profileInfo: {
                        bio: "",
                        website: "",
                        gender: "Male",
                        status: "Single",
                        name: name,
                        phoneNumber: "",
                        birthday: "",
                        theme: "lightMode",
                        professionalAcc: {
                          show: true,
                          category: "Just For Fun",
                          suggested: true,
                          status: true,
                          reelsForFollowing: false,
                          notificationBell: { state: false, type: "Both" },
                          private: false,
                          suggNotFollowed: false,
                          disableComments: false
                        },
                        sort: {
                          sortBy: "Random",
                          sortDirection: "Descending",
                          filter: "None",
                        },
                        accountCreationDate: new Date(),
                        registrationMethod: "twitter",
                      },
                      homePosts: [],
                      reels: [],
                      latestLikedPosts: [],
                      savedposts: [],
                      stories: [],
                      blockList: [],
                      notifications: {
                        isNewMsg: false,
                        isUpdate: false,
                        list: [],
                      },
                      isVerified: false,
                      userAvatarUrl:
                        profile_image_url || profile_image_url_https || "",
                    })
                    .then(() => {
                      if(_isMounted?.current){
                        timeouts.current = setTimeout(() => {
                          setLoading(false);
                          context.updatedReceivedData();
                          context.notify(
                            `Welcome to Voxgram${name && ", " +name}. Start by adding posts to your account.`
                          );
                          props.history.push("/");
                        }, 150);
                      }

                    });
                }else{
                  timeouts.current = setTimeout(() => {
                    setLoading(false);
                    context.notify(`${greeting}, ${name || "User"}.`);
                    props.history.push("/");
                  }, 150);
                }
                localStorage.setItem(
                  "user",
                  JSON.stringify({
                    email: `${(userName || screen_name)}@gmail.com` || "random",
                    password: "209ur92rowpf",
                  })
                );
            }         
          })
          .catch((err) => {
            if(_isMounted?.current){
              setLoading(false);
              context.notify(err?.message, "error");
            }
          });
        break;
      case "githubProvider":
        setLoading(true);
        auth
          .signInWithPopup(githubProvider)
          .then((cred) => {
            if(_isMounted?.current){
                setLoading(false);
                const {
                  profile: { email, username, avatar_url, bio, login },
                  isNewUser,
                } = cred?.additionalUserInfo;
                if (isNewUser) {
                  db.collection(Consts.USERS)
                    .doc(cred.user.uid)
                    .set({
                      uid: cred.user.uid,
                      userName: trimUserName(username || login),
                      posts: [],
                      followers: [],
                      following: [],
                      followRequests: {received:[], sent: []},
                      messages: [],
                      profileInfo: {
                        bio: bio ? bio : "",
                        website: "",
                        gender: "Male",
                        status: "Single",
                        name: login || "",
                        phoneNumber: "",
                        birthday: "",
                        theme: "lightMode",
                        professionalAcc: {
                          show: true,
                          category: "Just For Fun",
                          suggested: true,
                          status: true,
                          reelsForFollowing: false,
                          notificationBell: { state: false, type: "Both" },
                          private: false,
                          suggNotFollowed: false,
                          disableComments: false
                        },
                        sort: {
                          sortBy: "Random",
                          sortDirection: "Descending",
                          filter: "None",
                        },
                        accountCreationDate: new Date(),
                        registrationMethod: "github",
                      },
                      homePosts: [],
                      reels: [],
                      latestLikedPosts: [],
                      savedposts: [],
                      stories: [],
                      blockList: [],
                      notifications: {
                        isNewMsg: false,
                        isUpdate: false,
                        list: [],
                      },
                      isVerified: false,
                      userAvatarUrl: avatar_url,
                    })
                    .then(() => {
                      if(_isMounted?.current){
                        setLoading(false);
                        localStorage.setItem(
                          "user",
                          JSON.stringify({
                            email: `${email || (username || login)}@gmail.com` || "random",
                            password: decipherPassword(formState.signUpPassword?.val),
                          })
                        );
                        timeouts.current = setTimeout(() => {
                          context.updatedReceivedData();
                          context.notify(
                            "Welcome to Voxgram. Start by adding posts to your account."
                          );
                          props.history.push("/");
                        }, 150);
                      }
                    });
                } else {
                  setLoading(false);
                  timeouts.current = setTimeout(() => {
                    context.notify(`${greeting}, ${username || login || "User"}.`);
                    props.history.push("/");
                  }, 150);
                }
                localStorage.setItem(
                    "user",
                    JSON.stringify({
                      email:  `${(username || login)}@gmail.com` || "random",
                      password: "90e208ne-2129",
                    })
                );
            }
          })
          .catch((err) => {
            if(_isMounted?.current){
              setLoading(false);
              context.notify(err?.message, "error");
            }
          });
        break;
      default:
        context.notify("An error occurred");
    }
  };

  const resetEmail = (e) => {
    e.preventDefault();
    const { notify } = context;
    setLoading(true);
    auth
      .sendPasswordResetEmail(formState.loginEmail?.val)
      .then(() => {
        if(_isMounted?.current){
          setLoading(false);
          notify(
            "A password reset config has been send to your email.",
            "success"
          );
        }
      })
      .catch((err) => {
        if(_isMounted?.current){
          setLoading(false);
          notify(
            `The email you entered does not exist in our database" ${err?.message}`,
            "error"
          );
        }
      });
  };
  const trimUserName = (txt) => {
    const limit = 21;
    return `${
      txt.split("").length > limit
        ? txt.split("").slice(0, limit).join("") + ".."
        : txt
    }`;
  };
  return (
    <Auxiliary>
      <section className="auth--main flex-column">
        <div className="auth--inner w-100 flex-row">
          <div className="auth--review--pic flex-column">
            <div className="auth--slide--container unselectable" style={{backgroundImage: `url(${loginRevBg})`}} alt="insta review">
              <div className="auth--slide--content" id="slideContent">
                {/* TODO: USE SCSS TO CHANGE IMAGES STYLE */}
                  <img loading="lazy" src={slide1} alt="login slide 1" style={{zIndex: 90}} className="active__slide" />
                  <img loading="lazy" src={slide2} alt="login slide 2" style={{zIndex: 92}}/>
                  <img loading="lazy" src={slide3} alt="login slide 3" style={{zIndex: 94}}/>
                  <img loading="lazy" src={slide4} alt="login slide 4" style={{zIndex: 96}}/>
                  <img loading="lazy" src={slide5} alt="login slide 5" style={{zIndex: 98}}/>
              </div>
            </div>
          </div>
          <div className="auth flex-column mt-5">
            <div className="auth--upper--card w-100 flex-column">
              <div className="auth--logo flex-row">
                <span className="mr-2">
                  <GrInstagram />
                </span>
                <h1 className="logoText">Voxgram</h1>
              </div>
              <small className="insta--warning">
                Note: this is not the official Instagram website.
              </small>

              {
                // log in state
                !signUpState ? (
                  <form
                    onSubmit={(event) => submitForm(event, "login")}
                    className="auth--input--form flex-column"
                  >
                    {!getPasswordMode ? (
                      <div className="flex-column">
                        <AuthInput inputType="text" type="email" val={formState.loginEmail?.val} title="Email" name="loginEmail" required autoFocus onInputChange={onInputChange} isValid={formState.loginEmail?.isValid} isSubmitted={isSubmitted}/>
                        <AuthInput inputType="password" val={formState.loginPassword?.val} required title="Password" name="loginPassword" onInputChange={onInputChange} isValid={formState.loginPassword?.isValid} isSubmitted={isSubmitted}/>
                        <AuthSubmissionBtn value="Log In" type="login" formState={formState} inProgress={inProgress} loading={loading} />
                        <span
                          onClick={() => setPasswordMode(true)}
                          className="forgot__pass"
                        >
                          Forgot password?
                        </span>
                      </div>
                    ) : (
                      <div>
                        <span
                          onClick={() => setPasswordMode(false)}
                          className="back__Btn"
                        >
                          Back
                        </span>
                        <AuthInput inputType="text" type='email' val={formState.loginEmail?.val} required title="Email" name="loginEmail" autoFocus onInputChange={onInputChange} isValid={formState.loginEmail?.isValid} isSubmitted={isSubmitted}/>
                        <input
                          type="submit"
                          onClick={(e) => resetEmail(e)}
                          className={
                            loading || formState.loginEmail?.val === "" || inProgress
                              ? "disabled resetPassBtn"
                              : "resetPassBtn"
                          }
                          disabled={loading || formState.loginEmail?.val === "" || inProgress}
                          value="Reset password through email"
                        />
                      </div>
                    )}
                    <div className="divider--or flex-row">
                      <span className="div__or__start"></span>
                      <span className="div__or__middle">or</span>
                      <span className="div__or__end"></span>
                    </div>
                    <div className="signIn--options--box">
                      <SignInOption
                        method="google"
                        isLoading={(loading || inProgress)}
                        signInFunc={(x) => signInMethods(x)}
                      />
                      {/* <SignInOption method="facebook" signInFunc={(x)=> signInMethods(x)} /> */}
                      {/* <SignInOption
                        method="twitter"
                        isLoading={(loading || inProgress)}
                        signInFunc={(x) => signInMethods(x)}
                      /> */}
                      <SignInOption
                        method="github"
                        isLoading={(loading || inProgress)}
                        signInFunc={(x) => signInMethods(x)}
                      />
                      <SignInOption
                        method="anonymous"
                        isLoading={(loading || inProgress)}
                        signInFunc={(x) => signInMethods(x)}
                      />
                    </div>
                  </form>
                ) : (
                  // sign up state
                  <div>
                    <h4 className="auth--signup--msg mt-2">
                      Sign up to see photos and videos from your friends.
                    </h4>
                    <form
                      onSubmit={(event) => submitForm(event, "signUp")}
                      className="auth--input--form flex-column"
                    >
                      <AuthInput inputType="text" type="email" val={formState.signUpEmail?.val} title="Email" required name="signUpEmail" autoFocus onInputChange={onInputChange} isValid={formState.signUpEmail?.isValid} isSubmitted={isSubmitted}/>
                      <AuthInput inputType="text" type="text" val={formState.fullName?.val} title="Full Name" name="fullName" required onInputChange={onInputChange} isValid={formState.fullName.isValid} isSubmitted={isSubmitted}/>
                      <AuthInput inputType="text" type="text" val={formState.signUpUsername?.val?.charAt(0).toUpperCase() +
                          formState.signUpUsername?.val?.slice(1)} title="Username" name="signUpUsername" required onInputChange={onInputChange} isValid={formState.signUpUsername?.isValid} isSubmitted={isSubmitted}/>
                      <AuthInput  inputType="password" val={formState.signUpPassword?.val} required title="password" name="signUpPassword" onInputChange={onInputChange} isValid={formState.signUpPassword?.isValid} isSubmitted={isSubmitted}/>
                      <AuthSubmissionBtn value="Sign Up" type="signUp" formState={formState} inProgress={inProgress} loading={loading} />
                    </form>
                  </div>
                )
              }
            </div>
            <div className="auth--bottom--card flex-row">
              {!signUpState ? (
                <span>
                  Don't have an account?{" "}
                  <h6 onClick={() => switchToSignUp(!signUpState)}>Sign up</h6>
                </span>
              ) : (
                <span>
                  Have an account?{" "}
                  <h6 onClick={() => switchToSignUp(!signUpState)}>Log in</h6>
                </span>
              )}
            </div>
            <p className="auth__get__app">Get the app.</p>
            <div className="auth--available--stores">
              <div className="auth--stores--inner flex-row">
                <img src={appleStore} className="mb-2 unselectable"  alt="apple store" />
                <img src={gpStore} alt="google store" className="unselectable" />
              </div>
            </div>
          </div>
        </div>
        <div className="auth--footer--container flex-row">
          <ul className="auth--footer--ul flex-row">
            <li><Link to="/about">ABOUT</Link></li>
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
          <div className="auth--copyright flex-column flex-wrap">
            <span>This app was made for personal use</span>
            <span>
              &copy; {new Date().getFullYear()} Instagram clone made by
              Mahmoud Farargy
            </span>
          </div>
        </div>
      </section>
    </Auxiliary>
  );
};

export default withRouter(AuthPage);
