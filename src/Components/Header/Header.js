import React, { useState, useEffect, lazy, Suspense, useRef, useCallback } from "react";
import Auxiliary from "../HOC/Auxiliary";
import { NavLink, Link } from "react-router-dom";
import "./Header.css";
import { HiHome } from "react-icons/hi";
import { FaHeart, FaFacebookMessenger } from "react-icons/fa";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { Avatar } from "@material-ui/core";
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
import { IoIosCompass } from "react-icons/io";
import DeskTopSearch from "../../Components/DesktopSearch/DesktopSearch";
import { retry } from "../../Utilities/RetryImport";
const OptionsModal = lazy(() => retry(() => import("../../Components/Generic/OptionsModal/OptionsModal")));

const Header = (props) => {
  const {
    history,
    location,
    receivedData,
    closeNotificationAlert,
    authLogout,
    changeMainState,
  } = props
  // Refs
  const headerRef = useRef(null);
  const _isMounted = useRef(true);
  const timeouts = useRef(null);
  // --xx-- //

  // state
  const [openNoti, setNoti] = useState(false);
  const [openProf, setProf] = useState(false);
  const [openSearchBox, setSeachBox] = useState(false);
  const [user] = useAuthState(auth);
  const [openLogoutModal, setLogoutModal] = useState(false);
  const [scrolled, setScrollingState] = useState(false);
  const [bodyCurrClass, setbodyCurrClass] = useState("lightMode");
  // --xx--//
  const reverseNotiState = (type) => {
    const notiUpdate = receivedData?.notifications?.isUpdate;
    const notiMsg = receivedData?.notifications?.isNewMsg;
    if (type === "isUpdate" && notiUpdate) {
      closeNotificationAlert(type);
    } else if (type === "isNewMsg" && notiMsg) {
      closeNotificationAlert(type);
    }
  };
  // callbacks
  const memoizedControlSearchBox = useCallback((val) => {
    setSeachBox(val);
  }, [],
  )
  // useEffects
  useEffect(() => {
    if (_isMounted?.current && ((window.innerWidth || document.documentElement.clientWidth) >= 670)) {
      window.addEventListener("scroll", () => {
        if (headerRef && headerRef.current && _isMounted.current) {
          if (window.scrollY > 0) {
            headerRef.current?.classList && headerRef.current.classList.add("shorter_header");
            setScrollingState(true);
          } else {
            setScrollingState(false);
            headerRef?.current?.classList && headerRef.current.classList.remove("shorter_header");
          }
        }
      })
    }

    return () => {
      window.removeEventListener("scroll", () => { });
      window.clearTimeout(timeouts?.current);
      headerRef.current = false;
      setNoti(false);
      setLogoutModal(false);
      setScrollingState(false);
      _isMounted.current = false;
    }
  }, []);

  useEffect(() => { 
    const bodyActiveClass = document.body?.classList?.[0];
    if(bodyActiveClass){
        setbodyCurrClass(bodyActiveClass?.toLowerCase()); 
    }    
  }, [((document.body?.classList?.[0]) && document.body.classList[0])]);
  // ---xxx-- //
  const onLoggingOut = () => {
    setLogoutModal(true);
    setProf(false);

    timeouts.current = setTimeout(() => {
      authLogout(history).then(() => {
        if (_isMounted?.current) {
          setLogoutModal(false);
        }
      }).catch(() => {
        if (_isMounted?.current) {
          setLogoutModal(false);
          window.clearTimeout(timeouts?.current);
        }
      });
    }, 500);
  }
  const closeNotificationOnClick = (w) => {
    w.persist();
    if (w.target.tagName === "H6" && _isMounted?.current) {
      timeouts.current = setTimeout(() => {
        setNoti(false);
        window.clearTimeout(timeouts?.current);
      }, 900);
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
                  arialLabel="loading-indicator"
                  height={18}
                  width={18}
                  timeout={5000}
                />
              </div>
              <span onClick={() => history.replace("/auth")}>
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
              animation: "0.5s ease-in disappear-item 1",
            }}
              onClick={() => history.push("/")} className="ig--logo--img" >
              <img src={ (bodyCurrClass === "darkmode" || bodyCurrClass === "blueizis" || bodyCurrClass === "snorkelblue" || bodyCurrClass === "icedcoffee") ? HeaderLogoDark : HeaderLogoLight} alt="Instagram Logo" />
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

          <DeskTopSearch controlSearchBox={memoizedControlSearchBox} openSearchBox={openSearchBox} />
          <nav className="header--nav flex-row">
            <ul className="header--ul flex-row">
              <li title="Home">
                <NavLink
                  exact
                  to="/"
                  activeClassName={!openNoti ? "active-nav-link" : ""}
                  tabIndex="0"
                >
                  <HiHome style={{ fontSize: "26px" }} aria-label="Home"/>
                </NavLink>
              </li>
              {user ? (
                <>
                  <li className="like__icon__item" title="Messages">
                    <NavLink
                      onClick={() => reverseNotiState("isNewMsg")}
                      to="/messages"
                      activeClassName={!openNoti ? "active-nav-link" : ""}
                      tabIndex="0"
                    >
                      <FaFacebookMessenger aria-label="Messages"/>
                      {receivedData?.notifications?.isNewMsg &&
                        location.pathname !== "/messages" ? (
                          <div className="like__noti__dot mt-1"></div>
                        ) : null}
                    </NavLink>
                  </li>
                  <li className="like__icon__item" title="Explore">
                    <NavLink
                      to="/explore"
                      activeClassName={!openNoti ? "active-nav-link" : ""}
                      tabIndex="0"
                    >
                      <IoIosCompass className="compass__explore__icon" aria-label="Find People"/>

                    </NavLink>
                  </li>
                  <li title="Add New">
                    <NavLink
                      to="/add-post"
                      activeClassName={!openNoti ? "active-nav-link" : ""}
                      tabIndex="0"
                    >
                      <BsFillPlusCircleFill aria-label="Add New"/>
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
                        style={{ border: (openProf || location.pathname?.toLowerCase() === "/profile" || location.pathname?.toLowerCase() === "/edit-profile") ? "2px solid var(--light-black)" : "" }}
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
                            onClick={() => { changeMainState("activeProfileSection", { activeIndex: 3, activeID: "saved" }); setProf(false) }}
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
                </>
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
