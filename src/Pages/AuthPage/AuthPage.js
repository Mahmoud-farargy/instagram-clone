import React, { useState, useContext, useEffect } from "react";
import Auxiliary from "../../Components/HOC/Auxiliary";
import appleStore from "../../Assets/get-app-apple.png";
import gpStore from "../../Assets/get-app-gp.png";
import instaReview from "../../Assets/iphone-with-profile.jpg";
import { GrInstagram } from "react-icons/gr";
import Loader from "react-loader-spinner";
import SignInOption from "./SignInOption/SignInOption";


import {
  auth,
  db,
  googleProvider,
  twitterProvider,
  facebookProvider,
  githubProvider,
} from "../../Config/firebase";
import { withRouter } from "react-router-dom";
import { AppContext } from "../../Context";
import { useAuthState } from "react-firebase-hooks/auth";

const AuthPage = (props) => {
  var context = useContext(AppContext);
  const [_, loading] = useAuthState(auth);
  //----------- states----------------------
  const [signUpState, switchToSignUp] = useState(false);
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpUsername, setSignUpUsername] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [reTypedPassword, setRePassword] = useState("");
  const [capitalizeName, setCapitalizedName] = useState("");
  const [inProgress, setLoading] = useState(false);
  const [getPasswordMode, setPasswordMode] = useState(false);

  //-----x------ states--------x--------------
  
  useEffect(() => {
    return () => {
      context.changeMainState(
        "currentPage",
        signUpState ? "Log in" : "Sign up"
      );
    };
  }, [signUpState]);
  const decipherPassword = (pass) => {
    return (
      pass &&
      pass.split("").map((char) => {
        return char.charCodeAt(0).toString(2);
      })
    );
  };
  const submitForm = async (event, authType) => {
    
    event.preventDefault();
    var {
      resetAllData,
      updateSuggestionsList,
      isUserOnline,
      updateUID,
      updateUserState,
      notify,
      receivedData,
      currentUser
    } = context;
    setLoading(true);
    if (authType === "signUp") {
      resetAllData(); //clears data before adding new one
      
      setTimeout(() => {

        if (!isUserOnline) {
          //avoids data overlapping
          if (
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
              signUpEmail
            )
          ) {
            if (
              /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,20}$/.test(signUpPassword)
            ) {
              if (signUpPassword === reTypedPassword) {
                if (
                  /^(?=[a-zA-Z0-9._-]{6,18}$)(?!.*[_.]{2})[^_.].*[^_.]$/.test(
                    signUpUsername
                  )
                ) {
                  auth
                    .createUserWithEmailAndPassword(signUpEmail.toLowerCase(), signUpPassword)
                    .then((cred) => {
                      setLoading(false);
                      db.collection("users")
                        .doc(cred.user.uid)
                        .set({
                          uid: cred.user.uid,
                          userName: signUpUsername,
                          posts: [],
                          followers: [],
                          following: [],
                          messages: [],
                          profileInfo: {
                            bio: "",
                            website: "",
                            gender: "",
                            status: "",
                            name: "",
                            phoneNumber: "",
                            professionalAcc: {
                              show: true,
                              category: "Just For Fun",
                             
                            },
                            accountCreationDate: new Date(),
                            registrationMethod: "email"
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
                          auth.currentUser.updateProfile({
                            displayName: signUpUsername,
                          });
                          setLoading(false);
                          setSignUpEmail("");
                          setSignUpPassword("");
                          setSignUpUsername("");
                          localStorage.setItem(
                            "user",
                            JSON.stringify({
                              email: signUpEmail.toLowerCase(),
                              password: decipherPassword(signUpPassword),
                            })
                          );
                          setTimeout(() => {
                            props.history.push("/");
                            notify("Welcome to Voxgram. Start by adding posts to your account.");
                          }, 150);
                        });
                    })
                    .catch((err) => {
                      setLoading(false);
                      notify(err.message, "error");
                    });
                } else {
                  setLoading(false);
                  notify(
                    "Username should be between 6 and 18 characters with no spaces.",
                    "error"
                  );
                }
              } else {
                setLoading(false);
                notify(
                  "The confirmation password does not match the one above it.",
                  "error"
                );
              }
            } else {
              setLoading(false);
              notify(
                "Password should be between 8 to 20 characters and contains at least one number, one lowecase letter and one uppercase letter.",
                "error"
              );
            }
          } else {
            setLoading(false);
            notify("Please type a valid email", "error");
          }
        } else{
          setLoading(false);
        }
      }, 1000);
    } else if (authType === "login") {
      resetAllData();
      
      setTimeout(() => {

        if (!isUserOnline) {
         
          //avoids data overlapping
          auth
            .signInWithEmailAndPassword(loginEmail.toLowerCase(), loginPassword)
            .then(() => {
              setLoading(false);
              setLoginEmail("");
              setLoginPassword("");

              auth.onAuthStateChanged((authUser) => {
                console.log(authUser);
                db.collection("users")
                  .get()
                  .then((query) => {
                    query.forEach((user) => {
                      updateSuggestionsList(user.data());
                    });
                    updateUserState(true);
                    updateUID(authUser?.uid);

                    // updatedReceivedData();
                  });
                   setLoading(false);
              });
              localStorage.setItem(
                "user",
                JSON.stringify({
                  email: loginEmail.toLowerCase(),
                  password: decipherPassword(loginPassword),
                })
              );
              setTimeout(() => {
                notify(`Welcome back, ${(receivedData?.userName ||  currentUser?.displayName || "User")}`)
                props.history.push("/");
              }, 150);
            })
            .catch((err) => {
              setLoading(false);
              notify(err.message, "error");
            });
        }else{
          setLoading(false);
        }
      }, 1800);
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
            setLoading(false);
            const {profile:{email,name,picture, given_name}, isNewUser} = cred?.additionalUserInfo;
              if(isNewUser){
                  db.collection("users").doc(cred.user.uid).set({
                      uid: cred.user.uid,
                      userName: trimUserName(name),
                      posts: [],
                      followers: [],
                      following: [],
                      messages: [],
                      profileInfo: {
                        bio: "",
                        website: "",
                        gender: "",
                        status: "",
                        name: "",
                        phoneNumber: "",
                        professionalAcc: {
                          show: true,
                          category: "Just For Fun",
                          
                        },
                        accountCreationDate: new Date(),
                        registrationMethod: "google"
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
                      
                }).then(() => {
                  setTimeout(() => {
                    props.history.push("/");
                    context.notify("Welcome to Voxgram. Start by adding posts to your account.");
                  }, 150);
                })
              }
               setLoading(false);
                  localStorage.setItem(
                    "user",
                    JSON.stringify({
                      email: email ? email.toLowerCase() : "",
                      password: decipherPassword(signUpPassword),
                    })
                  );
                  setTimeout(() => {
                    context.notify(`Welcome back, ${given_name || "User"}.`);
                    props.history.push("/");
                  }, 150);
          })
          .catch((err) => {
            setLoading(false);
            alert(err.message);
          });
        break;
      case "facebookProvider":
        auth.signInWithPopup(facebookProvider).then((res) =>{
          console.log(res);
        });
        break;
      case "twitterProvider":
        auth.signInWithPopup(twitterProvider).then((cred) => {
          setLoading(false);
          const {profile:{email,name,picture}, isNewUser} = cred?.additionalUserInfo;
            if(isNewUser){
                db.collection("users").doc(cred.user.uid).set({
                    uid: cred.user.uid,
                    userName: trimUserName(name),
                    posts: [],
                    followers: [],
                    following: [],
                    messages: [],
                    profileInfo: {
                      bio: "",
                      website: "",
                      gender: "",
                      status: "",
                      name: "",
                      phoneNumber: "",
                      professionalAcc: {
                        show: true,
                        category: "Just For Fun",
                        
                      },
                      accountCreationDate: new Date(),
                      registrationMethod: "twitter"
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
                    
              }).then(() => {
                setTimeout(() => {
                  props.history.push("/");
                  context.notify("Welcome to Voxgram. Start by adding posts to your account.");
                }, 150);
              })
            }
             setLoading(false);
                localStorage.setItem(
                  "user",
                  JSON.stringify({
                    email: email.toLowerCase(),
                    password: decipherPassword(signUpPassword),
                  })
                );
                setTimeout(() => {
                  context.notify(`Welcome back, ${name || "User"}.`);
                  props.history.push("/");
                }, 150);
        })
        .catch((err) => {
          setLoading(false);
          alert(err.message);
        });
        break;
      case "githubProvider":
        setLoading(true);
          auth.signInWithPopup(githubProvider).then((cred) => {
            setLoading(false);
            const {profile:{email,username,avatar_url, bio, login}, isNewUser} = cred?.additionalUserInfo;
              if(isNewUser){
                  db.collection("users").doc(cred.user.uid).set({
                      uid: cred.user.uid,
                      userName: trimUserName(username || login),
                      posts: [],
                      followers: [],
                      following: [],
                      messages: [],
                      profileInfo: {
                        bio: bio ? bio : "",
                        website: "",
                        gender: "",
                        status: "",
                        name: "",
                        phoneNumber: "",
                        professionalAcc: {
                          show: true,
                          category: "Just For Fun",
                          
                        },
                        accountCreationDate: new Date(),
                        registrationMethod: "github"
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
                      
                }).then(() =>{
                  setLoading(false);
                  localStorage.setItem(
                    "user",
                    JSON.stringify({
                      email: (email ? email.toLowerCase(): ""),
                      password: decipherPassword(signUpPassword),
                    })
                  );
                  setTimeout(() => {
                    props.history.push("/");
                    context.notify("Welcome to Voxgram. Start by adding posts to your account.");
                  }, 150);
                });
              }else{
                setLoading(false);
                  localStorage.setItem(
                    "user",
                    JSON.stringify({
                      email: (email ? email.toLowerCase(): ""),
                      password: decipherPassword(signUpPassword),
                    })
                  );
                  setTimeout(() => {
                    context.notify(`Welcome back, ${username || "user"}.`);
                    props.history.push("/");
                  }, 150);
              }
               
          })
          .catch((err) => {
            alert(err.message);
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
      .sendPasswordResetEmail(loginEmail)
      .then((res) => {
        setLoading(false);
        notify(
          "A password reset config has been send to your email",
          "success"
        );
      })
      .catch((err) => {
        setLoading(false);
        notify(
          `The email you entered does not exist in our database" ${err}`,
          "error"
        );
      });
  };
  const trimUserName = (fullName) => {
    const limit= 17;
    return `${fullName.split("").length > limit ? fullName.split("").slice(0,limit).join("")+".." : fullName}`;
  }
  return (
    <Auxiliary>
      <section className="auth--main flex-column">
        <div className="auth--inner w-100 flex-row">
          <div className="auth--review--pic flex-column">
            <img src={instaReview} alt="insta review" />
          </div>
          <div className="auth flex-column mt-5">
            <div className="auth--upper--card w-100 flex-column">
              <div className="auth--logo flex-row">
                <span className="mr-2">
                  <GrInstagram />
                </span>
                <h1 className="logoText">Voxgram</h1>
              </div>

              {
                // log in state
                !signUpState ? (
                  <form
                    onSubmit={(event) => submitForm(event, "login")}
                    className="auth--input--form flex-column"
                  >
                    {!getPasswordMode ? (
                      <div className="flex-column">
                        <input
                          required
                          autoFocus
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          type="text"
                          placeholder="Email"
                        />
                        <input
                          required
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          type="password"
                          placeholder="Password"
                          autoComplete="off"
                        />
                    {
                      loading || inProgress ?
                      <button
                        className={"disabled loading__btn flex-row"}
                        disabled={true}
                      >
                        <Loader
                        type="ThreeDots"
                        color="#fff"
                        height={15}
                        width={20}
                        timeout={5000}
                      />
                    </button>
                      : 
                      <input
                          className={
                            loading ||
                            !loginEmail ||
                            !loginPassword ||
                            inProgress
                              ? "disabled"
                              : ""
                          }
                          disabled={
                            loading ||
                            !loginEmail ||
                            !loginPassword ||
                            inProgress
                          }
                          type="submit"
                          value="Log In"
                        />
                    }   
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
                        <input
                          required
                          autoFocus
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          type="text"
                          placeholder="Email"
                        />
                        <input
                          type="submit"
                          onClick={(e) => resetEmail(e)}
                          className={
                            loading || loginEmail === "" || inProgress
                              ? "disabled resetPassBtn"
                              : "resetPassBtn"
                          }
                          disabled={loading || loginEmail === "" || inProgress}
                          value="Resest password through email"
                        />
                      </div>
                    )}
                    <div className="divider--or flex-row"><span className="div__or__start"></span><span className="div__or__middle">or</span><span className="div__or__end"></span></div>
                    <div className="signIn--options--box">
                            <SignInOption method="google" signInFunc={(x)=> signInMethods(x)} />
                            {/* <SignInOption method="facebook" signInFunc={(x)=> signInMethods(x)} /> */}
                            <SignInOption method="twitter" signInFunc={(x)=> signInMethods(x)} />
                            <SignInOption method="github" signInFunc={(x)=> signInMethods(x)} />
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
                      <input
                        required
                        autoFocus
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        type="email"
                        placeholder="Email"
                      />
                      <input
                        required
                        value={
                          capitalizeName.charAt(0).toUpperCase() +
                          signUpUsername.slice(1)
                        }
                        onChange={(e) => {
                          setSignUpUsername(e.target.value);
                          setCapitalizedName(e.target.value);
                        }}
                        type="text"
                        placeholder="Username"
                      />
                      <input
                        required
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        type="password"
                        autoComplete="off"
                        placeholder="Password"
                      />
                      <input
                        required
                        value={reTypedPassword}
                        onChange={(e) => setRePassword(e.target.value)}
                        type="password"
                        autoComplete="off"
                        placeholder="Re-type Password"
                      />
                   {
                       loading || inProgress ?
                       <button
                         className={"disabled loading__btn flex-row"}
                         disabled={true}
                       >
                         <Loader
                         type="ThreeDots"
                         color="#fff"
                         height={15}
                         width={20}
                         timeout={5000}
                       />
                     </button>
                     :
                     <input
                        className={
                          !signUpEmail ||
                          !signUpPassword ||
                          !signUpUsername ||
                          !reTypedPassword
                            ? "disabled"
                            : ""
                        }
                        disabled={
                          loading ||
                          !signUpEmail ||
                          !signUpPassword ||
                          !signUpUsername ||
                          !reTypedPassword
                        }
                        type="submit"
                        value="Sign Up"
                      />
                   }   
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
            <span>
              @2020 - {new Date().getFullYear()} Instagram clone made by Mahmoud
              Farargy
            </span>
          </div>
        </div>
      </section>
    </Auxiliary>
  );
};

export default withRouter(AuthPage);
