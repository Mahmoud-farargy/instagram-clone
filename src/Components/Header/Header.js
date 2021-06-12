import React, { useContext, useState, useEffect, lazy, Suspense, useRef } from "react";
import Auxiliary from "../HOC/Auxiliary";
import { NavLink, Link } from "react-router-dom";
import "./Header.css";
import { HiHome } from "react-icons/hi";
import { FaHeart , FaFacebookMessenger } from "react-icons/fa";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { Avatar } from "@material-ui/core";
import { AppContext } from "../../Context";
import { auth } from "../../Config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { BiPowerOff, BiCog, BiInfoCircle } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { RiBookmarkLine } from "react-icons/ri";
import Notifications from "./Notifications/Notifications";
import { withRouter } from "react-router-dom";
import Loader from "react-loader-spinner";
import LoadingScreen from "../../Components/Generic/LoadingScreen/LoadingScreen";
import HeaderLogoLight from "../../Assets/instagram-icon-logo.c1dbcbd5.svg";
import HeaderLogoDark from "../../Assets/instagram-icon-logo-loading.e195cbde.svg";
import {IoIosCompass} from "react-icons/io";
import DeskTopSearch from "../../Components/DesktopSearch/DesktopSearch";
const OptionsModal = lazy(() => import("../../Components/Generic/OptionsModal/OptionsModal"));

const Header = (props) => {
  // Refs
  const headerRef = useRef(null);
  const _isMounted = useRef(true);
  const timeouts = useRef(null);
  // --xx-- //

  // state
  const context = useContext(AppContext);
  const [openNoti, setNoti] = useState(false);
  const [openProf, setProf] = useState(false);
  const [openSearchBox, setSeachBox] = useState(false);
  const [user] = useAuthState(auth);
  const [openLogoutModal, setLogoutModal] = useState(false);
  const [scrolled, setScrollingState] = useState(false);
   // --xx--//
  const {
    receivedData,
    closeNotificationAlert,
    authLogout,
    changeMainState,
    isDayTime
  } = context;
  const reverseNotiState = (type) => {
    const notiUpdate = receivedData?.notifications?.isUpdate;
    const notiMsg = receivedData?.notifications?.isNewMsg;
    if (type === "isUpdate" && notiUpdate) {
      closeNotificationAlert(type);
    } else if (type === "isNewMsg" && notiMsg) {
      closeNotificationAlert(type);
    }
  };
  /// useEffects
  useEffect(() => {
    if(_isMounted?.current){
        window.addEventListener("scroll", () =>{
        if(headerRef && headerRef.current){
          if(window.scrollY > 0){
            headerRef.current?.classList && headerRef.current.classList.add("shorter_header");
            setScrollingState(true);
          }else{
            setScrollingState(false);
            headerRef?.current?.classList && headerRef.current.classList.remove("shorter_header");
          }
        }
      })
    }
        
    return () =>{
      window.removeEventListener("scroll", ()=> {});
      window.clearTimeout(timeouts?.current);
      headerRef.current = false;
      setNoti(false);
      setLogoutModal(false);
      setScrollingState(false);
      _isMounted.current = false;
  }
  }, []);
// ---xxx-- //
  const onLoggingOut = () => {
   setLogoutModal(true);
   setProf(false);
     
       timeouts.current = setTimeout(() => {
        authLogout(props.history).then(() => {
          if(_isMounted?.current){
          setLogoutModal(false);
          }
        }).catch(() => {
          if(_isMounted?.current){
              setLogoutModal(false);
             window.clearTimeout(timeouts?.current);
          }
        });
      },1400);
  }
  const closeNotificationOnClick = (w) => {
    w.persist();
    if(w.target.tagName === "H6" && _isMounted?.current){
      timeouts.current = setTimeout(() => {
        setNoti(false);
        window.clearTimeout(timeouts?.current);
      },300);
    }
  }
  return (
    <Auxiliary>
      {/* modals */}
      <Suspense fallback={<LoadingScreen />}>
          {openLogoutModal && (
              <OptionsModal>
                <div id="logoutModal">
                    <div className="logout--modal flex-column">
                  <h2>Logging Out</h2>
                  <p>You need to log back in.</p>
                  <Loader
                    type="Oval"
                            color="var(--secondary-clr)"
                            height={18}
                            width={18}
                            timeout={5000}
                    />
                  </div>
                  <span onClick={() => props.history.replace("/auth")}>
                    Log In
                  </span>
                </div>
              
              </OptionsModal>
            )}
      </Suspense>
          <div
            style={{
              opacity: openLogoutModal ? "1" : "0",
              display: openLogoutModal ? "block" : "none",
              transition: "all 0.5s ease",
            }}
            className="backdrop "
            onClick={() => setLogoutModal(false)}
          ></div>
        {/* --xx-- */}

      <header ref={headerRef} id="header" className="main--header flex-row">
        <div className="header--inner flex-row">
          <div title="Voxgram" className="header--logo--box flex-row">
            <div style={{
              // opacity: scrolled ? "0" : "1",
              // transform: scrolled ? "translateX(-100%)" : "translateX(0)",
              // transition: "all 0.5s ease-in",
              animation: "0.5s ease-in disappear-item 1",
              // animationDelay: "0.5s"
            }}
            onClick={() => props.history.push("/")} className="ig--logo--img" >
              <img src={receivedData?.profileInfo?.theme === "lightMode" ? HeaderLogoLight : (receivedData?.profileInfo?.theme === "darkMode" || receivedData?.profileInfo?.theme === "blueIzis" || (receivedData?.profileInfo?.theme === "lightDarkAuto" && !isDayTime)) || receivedData?.profileInfo?.theme === "snorkelBlue" || receivedData?.profileInfo?.theme === "icedCoffee" ? HeaderLogoDark : HeaderLogoLight } alt="Instagram Logo" />
            </div>
            <div style={{
              opacity: scrolled ? "0" : "1",
              transform: scrolled ? "translateY(-100%)" : "translateY(0)",
              transition: "all 0.5s ease-in",
              animation: "disappear-item",
              animationDelay: "0.5s"
            }}
            className="logo--verti--divider"></div>
            <Link to="/">
              <h1 className="logoText">Voxgram</h1>
            </Link> 
          </div>
          
         <DeskTopSearch controlSearchBox={(state) => setSeachBox(state)} openSearchBox={openSearchBox}  />
          <nav className="header--nav flex-row">
            <ul className="header--ul flex-row">
              <li title="Home">
                <NavLink
                  exact
                  to="/"
                  activeClassName={!openNoti ? "active-nav-link" : ""}
                  aria-label="Home"
                >
                  <HiHome style={{ fontSize: "26px" }} />
                </NavLink>
              </li>
              {user ? (
                <div className="flex-row" style={{ alignItems: "center" }}>
                  <li className="like__icon__item" title="Messages">
                    <NavLink
                      onClick={() => reverseNotiState("isNewMsg")}
                      to="/messages"
                      activeClassName={!openNoti ? "active-nav-link" : ""}
                      aria-label="Messages"
                    >
                      <FaFacebookMessenger />
                      {receivedData?.notifications?.isNewMsg &&
                      props.location.pathname !== "/messages" ? (
                        <div className="like__noti__dot mt-1"></div>
                      ) : null}
                    </NavLink>
                  </li>
                  <li className="like__icon__item" title="Explore">
                    <NavLink
                      to="/explore"
                      activeClassName={!openNoti ? "active-nav-link" : ""}
                      aria-label="Find People"
                    >
                      <IoIosCompass className="compass__explore__icon" />
                     
                    </NavLink>
                  </li>
                  <li title="Add New">
                    <NavLink
                      to="/add-post"
                      activeClassName={!openNoti ? "active-nav-link" : ""}
                      aria-label="Add New"
                    >
                      <BsFillPlusCircleFill />
                    </NavLink>
                  </li>
                  <li
                    id="notifications"
                    title="Notifications"
                    className="noti--parent--container"
                    onClick={() => {
                      setNoti(true);
                      reverseNotiState("isUpdate");
                    }}
                  >
                    <span className="like__icon__item">
                      <FaHeart
                        style={{ color: openNoti ? "var(--secondary-clr)" : "var(--main-black)" }}
                      />
                      {receivedData?.notifications?.isUpdate &&
                      receivedData.notifications?.list?.length >= 1 ? (
                        <div className="like__noti__dot"></div>
                      ) : null}
                    </span>
                    <div
                      style={{
                        display: openNoti ? "flex" : "none",
                        transition: "all 0.4s ease",
                        opacity: openNoti ? "1" : "0",
                      }}
                      className="noti--popup--window fadeEffect"
                    >
                      <div className="noti--popup--arrow"> </div>
                      <div className="noti--popup--inner">
                        {openNoti && <Notifications closeNotificationOnClick={closeNotificationOnClick} />}
                       
                      </div>
                      <div className="noti__transparent"></div>
                    </div>
                  </li>
                  <li >
                    <span title={receivedData?.userName} onClick={() => setProf(true)}>
                      <Avatar
                        loading="lazy"
                        style={{border: (openProf || props.location.pathname?.toLowerCase() === "/profile" || props.location.pathname?.toLowerCase() === "/edit-profile") ? "2px solid var(--light-black)" : ""}}
                        src={receivedData?.userAvatarUrl}
                        alt={receivedData?.userName}
                        className="header__user__avatar flex-column"
                      />
                    </span>
                    <div
                      style={{
                        display: openProf ? "flex" : "none",
                        transition: "all 0.4s ease",
                        opacity: openProf ? "1" : "0",
                      }}
                      id="profilePopup"
                      className="noti--popup--window fadeEffect"
                    >
                      <div className="noti--popup--inner">
                        <div className="noti--popup--arrow"> </div>
                        <ul className="prof--popup--ul flex-column">
                          <Link onClick={() => setProf(false)} to="/profile">
                            <li>
                              <span className="prof--item--inner flex-row">
                                <CgProfile className="prof__popup" /> <span>Profile</span>
                              </span>
                            </li>
                          </Link>
                          <Link
                            onClick={() => setProf(false)}
                            to="/edit-profile"
                          >
                            <li>
                            <span className="prof--item--inner flex-row">
                              <BiCog className="prof__popup" /> <span>Settings</span>
                              </span>
                            </li>
                          </Link>
                          <Link
                            onClick={() => {changeMainState("activeProfileSection", {activeIndex: 2, activeID: "saved" }); setProf(false)}}
                            to="/profile"
                          >
                            <li>
                            <span className="prof--item--inner flex-row">
                              <RiBookmarkLine className="prof__popup" /> <span>Saved</span>
                              </span>
                            </li>
                          </Link>
                          <Link
                            onClick={() => setProf(false)}
                            to="/about"
                          >
                            <li>
                            <span className="prof--item--inner flex-row">
                              <BiInfoCircle className="prof__popup" /> <span>About</span>
                              </span>
                            </li>
                          </Link>
                          <li
                            onClick={() => onLoggingOut()}
                          >
                             <span className="prof--item--inner flex-row">
                              <BiPowerOff className="prof__popup" /> <span>Log Out</span>
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </li>
                </div>
              ) : null}
            </ul>
            {openProf || openNoti || openSearchBox ? (
              <div
                className="hidden--backdrop"
                onClick={() => {
                  setProf(false);
                  setNoti(false);
                  setSeachBox(false);
                }}
              ></div>
            ) : null}
          </nav>
        </div>
      </header>
    </Auxiliary>
  );
};
export default withRouter(React.memo(Header));
