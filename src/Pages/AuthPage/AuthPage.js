import React, { useState, useContext, useEffect } from "react";
import Auxiliary from "../../Components/HOC/Auxiliary";
import appleStore from "../../Assets/get-app-apple.png";
import gpStore from "../../Assets/get-app-gp.png";
import instaReview from "../../Assets/iphone-with-profile.jpg";
import { GrInstagram } from "react-icons/gr";
import Loader from "react-loader-spinner";
import SignInOption from "./SignInOption/SignInOption";
import * as Consts from "../../Utilities/Consts";
import { anonInfo } from "../../info";

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
import PasswordInput from "./PasswordInput/PasswordInput";

const AuthPage = (props) => {
  var context = useContext(AppContext);
  const [, loading] = useAuthState(auth);
  //TODO: Organize states by putting only login and signup states with their respective inputs
  //----------- states----------------------
  const [signUpState, switchToSignUp] = useState(false);
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpUsername, setSignUpUsername] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [fullName, setFullName] = useState("");
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
    setTimeout(() => {
      //avoids data overlapping
      if (!isUserOnline) {
          auth
          .signInWithEmailAndPassword(
            email.toLowerCase().trim(),
            password
          )
          .then(() => {
          setLoading(false);
          setLoginEmail("");
          setLoginPassword("");

          auth.onAuthStateChanged((authUser) => {
            updateUserState(true);
            updateUID(authUser?.uid);
            setLoading(false);
          });
          localStorage.setItem(
            "user",
            JSON.stringify({
              email: email.toLowerCase(),
              password: decipherPassword(password),
            })
          );
          setTimeout(() => {
            updatedReceivedData();
            notify(
              `Welcome back, ${
                receivedData?.userName || currentUser?.displayName || "User"
              }`
            );
            props.history.push("/");
          }, 150);
        })
        .catch((err) => {
          setLoading(false);
          notify(err.message, "error");
        });

      } else {
        setLoading(false);
        authLogout(props.history);
        notify("It seems like you haven't logged out properly last time. Please try again.","error");
      }
    }, 1000);

  }
  const submitForm = async (event, authType) => {
    event.preventDefault();
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

      setTimeout(() => {
        if (!isUserOnline) {
          //avoids data overlapping
          if (
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
              signUpEmail
            )
          ) {
            if (/^[a-zA-Z\s]{3,25}$/.test(fullName.trim())) {
              if (
                /^(?=[a-zA-Z0-9._-]{4,19}$)(?!.*[_.]{2})[^_.].*[^_.]$/.test(
                  signUpUsername
                )
              ) {
                if (
                  /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{7,20}$/.test(
                    signUpPassword
                  )
                ) {
                  auth
                    .createUserWithEmailAndPassword(
                      signUpEmail.toLowerCase().trim(),
                      signUpPassword
                    )
                    .then((cred) => {
                      setLoading(false);
                      db.collection(Consts.USERS)
                        .doc(cred.user.uid)
                        .set({
                          uid: cred.user.uid,
                          userName: signUpUsername,
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
                            name: fullName.trim(),
                            phoneNumber: "",
                            birthday: "",
                            professionalAcc: {
                              show: true,
                              category: "Just For Fun",
                              suggested: true,
                              status: true,
                              reelsForFollowing: false,
                              notificationBell: { state: true, type: "Both" },
                              private: false,
                              suggNotFollowed: false
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
                            notify(
                              "Welcome to Voxgram. Start by adding posts to your account."
                            );
                            updatedReceivedData();
                            props.history.push("/");
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
                    "Password should be between 7 and 20 characters and contains at least one number, one lowercase letter, and one uppercase letter.",
                    "error"
                  );
                }
              } else {
                setLoading(false);
                notify(
                  `Username should be between 4 and 19 characters with no spaces. Underscore, dash and dot characters are allowed but should not be placed at the end.`,
                  "error"
                );
              }
            } else {
              setLoading(false);
              notify(
                "Full Name should contain only letters and not exceed 25 characters.",
                "error"
              );
            }
          } else {
            setLoading(false);
            notify("Please type a valid email", "error");
          }
        } else {
          authLogout(props.history);
          setLoading(false);
          notify("It seems like you haven't logged out properly last time. Please try again.","error");
        }
      }, 1000);
    } else if (authType === "login") {
      resetAllData();
      loginWithEmail(loginEmail, loginPassword);
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
                    professionalAcc: {
                      show: true,
                      category: "Just For Fun",
                      suggested: true,
                      status: true,
                      reelsForFollowing: false,
                      notificationBell: { state: true, type: "Both" },
                      private: false,
                      suggNotFollowed: false
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
                  setTimeout(() => {
                    setLoading(false);
                    context.updatedReceivedData();
                    context.notify(
                      `Welcome to Voxgram${given_name && ", " +given_name}. Start by adding posts to your account.`
                    );
                    props.history.push("/");
                  }, 150);
                });
            }else{
              setTimeout(() => {
                setLoading(false);
                  context.notify(`Welcome back, ${given_name || "User"}.`);
                  props.history.push("/");
              }, 150);
            }
            localStorage.setItem(
              "user",
              JSON.stringify({
                email: email ? email.toLowerCase() : "",
                password: decipherPassword(signUpPassword),
              })
            );
          })
          .catch((err) => {
            setLoading(false);
            context.notify(err.message, "error");
          });
        break;
      case "facebookProvider":
        auth.signInWithPopup(facebookProvider).then((res) => {
          console.log(res);
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
                    professionalAcc: {
                      show: true,
                      category: "Just For Fun",
                      suggested: true,
                      status: true,
                      reelsForFollowing: false,
                      notificationBell: { state: true, type: "Both" },
                      private: false,
                      suggNotFollowed: false
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
                  setTimeout(() => {
                    setLoading(false);
                    context.updatedReceivedData();
                    context.notify(
                      `Welcome to Voxgram${name && ", " +name}. Start by adding posts to your account.`
                    );
                    props.history.push("/");
                  }, 150);
                });
            }else{
              setTimeout(() => {
                setLoading(false);
                context.notify(`Welcome back, ${name || "User"}.`);
                props.history.push("/");
              }, 150);
            }
            localStorage.setItem(
              "user",
              JSON.stringify({
                email: "",
                password: decipherPassword(signUpPassword),
              })
            );          
          })
          .catch((err) => {
            setLoading(false);
            context.notify(err.message, "error");
          });
        break;
      case "githubProvider":
        setLoading(true);
        auth
          .signInWithPopup(githubProvider)
          .then((cred) => {
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
                    name: "",
                    phoneNumber: "",
                    birthday: "",
                    professionalAcc: {
                      show: true,
                      category: "Just For Fun",
                      suggested: true,
                      status: true,
                      reelsForFollowing: false,
                      notificationBell: { state: true, type: "Both" },
                      private: false,
                      suggNotFollowed: false
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
                  setLoading(false);
                  localStorage.setItem(
                    "user",
                    JSON.stringify({
                      email: email ? email.toLowerCase() : "",
                      password: decipherPassword(signUpPassword),
                    })
                  );
                  setTimeout(() => {
                    context.updatedReceivedData();
                    context.notify(
                      "Welcome to Voxgram. Start by adding posts to your account."
                    );
                    props.history.push("/");
                  }, 150);
                });
            } else {
              setLoading(false);
              setTimeout(() => {
                context.notify(`Welcome back, ${username || login || "User"}.`);
                props.history.push("/");
              }, 150);
            }
            localStorage.setItem(
                "user",
                JSON.stringify({
                  email: email ? email.toLowerCase() : "",
                  password: decipherPassword(signUpPassword),
                })
              );
          })
          .catch((err) => {
            setLoading(false);
            context.notify(err.message, "error");
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
                        <input
                          required
                          autoFocus
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          type="text"
                          placeholder="Email"
                        />
                        <PasswordInput val={loginPassword} onPassChange={setLoginPassword} />
                        {loading || inProgress ? (
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
                        ) : (
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
                        )}
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
                      <input
                        autoFocus
                        required
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        type="email"
                        placeholder="Email"
                      />
                      <input
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        type="text"
                        placeholder="Full Name"
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
                      <PasswordInput val={signUpPassword} onPassChange={setSignUpPassword} />
                      {loading || inProgress ? (
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
                      ) : (
                        <input
                          className={
                            !signUpEmail ||
                            !signUpPassword ||
                            !signUpUsername ||
                            !fullName
                              ? "disabled"
                              : ""
                          }
                          disabled={
                            loading ||
                            !signUpEmail ||
                            !signUpPassword ||
                            !signUpUsername ||
                            !fullName
                          }
                          type="submit"
                          value="Sign Up"
                        />
                      )}
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
