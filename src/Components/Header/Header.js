import React, { useContext, useState, useEffect, lazy, Suspense, useRef } from "react";
import Auxiliary from "../HOC/Auxiliary";
import { NavLink, Link } from "react-router-dom";
import "./Header.css";
import { HiHome } from "react-icons/hi";
import { FaHeart , FaFacebookMessenger} from "react-icons/fa";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { Avatar } from "@material-ui/core";
import { AppContext } from "../../Context";
import { auth } from "../../Config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { BiPowerOff, BiCog, BiInfoCircle } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { RiSearchLine } from "react-icons/ri";
import { TiDelete } from "react-icons/ti";
import NotificationOutput from "../NotificationsOutput/NotificationsOutput";
import { withRouter } from "react-router-dom";
import SearchItem from "../SearchItem/SearchItem.js";
import Loader from "react-loader-spinner";
import LoadingScreen from "../../Components/Generic/LoadingScreen/LoadingScreen";
import HeaderLogo from "../../Assets/instagram-icon-logo.c1dbcbd5.svg";
const OptionsModal = lazy(() => import("../../Components/Generic/OptionsModal/OptionsModal"));

const Header = (props) => {
  // Refs
  const headerRef = useRef(null);
  const _isMounted = useRef(true);
  // --xx-- //

  // state
  const context = useContext(AppContext);
  const [openNoti, setNoti] = useState(false);
  const [openProf, setProf] = useState(false);
  const [openSearchBox, setSeachBox] = useState(false);
  const [user] = useAuthState(auth);
  const [searchVal, setSearchVal] = useState("");
  const [capitalizeWord, setCapitalizedWord] = useState("");
  const [openLogoutModal, setLogoutModal] = useState(false);
  const [scrolled, setScrollingState] = useState(false);
   // --xx--//
  const {
    receivedData,
    closeNotificationAlert,
    authLogout,
    igVideoImg,
    handleFollowing,
    changeMainState,
    searchUsers,
    searchInfo,
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
    if(_isMounted){
        if (searchVal && searchVal !== "") {
        searchUsers(searchVal, "regular");
        setSeachBox(true);
      } else {
        setSeachBox(false);
        setSearchVal("");
      }
    }
    
  }, [searchVal]);
  useEffect(() => {
    if(_isMounted){
        window.addEventListener("scroll", () =>{
        if(window.scrollY > 0 && headerRef && headerRef.current){
          headerRef.current?.classList && headerRef.current.classList.add("shorter_header");
          setScrollingState(true);
        }else{
          // setScrollingState(false);
          headerRef.current?.classList && headerRef.current.classList.remove("shorter_header");
        }
      })
    }
        
    return () =>{
      window.removeEventListener("scroll", ()=> {});
      _isMounted.current = false;
      headerRef.current = false;
      setScrollingState(false);
  }
  }, []);
// ---xxx-- //
  const clearSearchBox = () => {
    setSearchVal("");
  };
  const onLoggingOut = () => {
   setLogoutModal(true);
   setProf(false);
    setTimeout(() => {
      authLogout(props.history).then(() => {
        setLogoutModal(false);
      }).catch(() => {
        setLogoutModal(false);
      });      
    },1500);
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
                            color="#0095f6"
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
              <img src={HeaderLogo} alt="Instagram Logo" />
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

         

          <div className="search--bar--container">
            <input
              value={capitalizeWord.charAt(0).toUpperCase() + searchVal.slice(1)}
              onChange={(e) => {setSearchVal(e.target.value); setCapitalizedWord(e.target.value)}}
              type="text"
              className="search__input"
              aria-label="search bar"
              placeholder="Search"
              autoCapitalize="none"
            />
            <span className="search__icon">
              <RiSearchLine />
            </span>
            {searchInfo?.loading ? (
              <span className="loading--search--box">
                <Loader
                  type="Puff"
                  color="#919191"
                  height={19}
                  width={19}
                  timeout={5000}
                />
              </span>
            ) : searchVal ? (
              <span
                onClick={() => clearSearchBox()}
                className="clear--search--box"
              >
                <TiDelete />
              </span>
            ) : null}

            <div
              style={{
                display: openSearchBox ? "flex" : "none",
                transition: "all 0.4s ease",
                opacity: openSearchBox ? "1" : "0",
              }}
              className="search--pop--window"
            >
              <div className="search--popup--arrow"> </div>
              <div className="search--popup--inner">
                <ul className="noti--popup--ul flex-column">
                  {searchInfo?.results && searchInfo?.results.length > 0 ? (
                    searchInfo?.results?.map((user, i) => {
                      return (
                        <SearchItem
                          key={user?.uid || i}
                          user={user}
                          closeSearchBox={setSeachBox}
                        />
                      );
                    })
                  ) : (
                    <div className="empty--box flex-row">
                      <h4>No Results found</h4>
                    </div>
                  )}
                  <div className="noti__transparent"></div>
                </ul>
              </div>
            </div>
          </div>

          <nav className="header--nav flex-row">
            <ul className="header--ul flex-row">
              <li>
                <NavLink
                  exact
                  to="/"
                  activeClassName={!openNoti ? "active-nav-link" : ""}
                >
                  <HiHome style={{ fontSize: "26px" }} />
                </NavLink>
              </li>
              {user ? (
                <div className="flex-row" style={{ alignItems: "center" }}>
                  <li className="like__icon__item">
                    <NavLink
                      onClick={() => reverseNotiState("isNewMsg")}
                      to="/messages"
                      activeClassName={!openNoti ? "active-nav-link" : ""}
                    >
                      <FaFacebookMessenger />
                      {receivedData?.notifications?.isNewMsg &&
                      props.location.pathname !== "/messages" ? (
                        <div className="like__noti__dot mt-1"></div>
                      ) : null}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/add-post"
                      activeClassName={!openNoti ? "active-nav-link" : ""}
                    >
                      <BsFillPlusCircleFill />
                    </NavLink>
                  </li>
                  <li
                    className="noti--parent--container"
                    onClick={() => {
                      setNoti(true);
                      reverseNotiState("isUpdate");
                    }}
                  >
                    <span className="like__icon__item">
                      <FaHeart
                        style={{ color: openNoti ? "#0095f6" : "#363636" }}
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
                      className="noti--popup--window"
                    >
                      <div className="noti--popup--arrow"> </div>
                      <div className="noti--popup--inner">
                        {receivedData?.notifications?.list.length >= 1 ? (
                          <ul className="noti--popup--ul flex-column">
                            {receivedData?.notifications?.list
                              ?.slice(0, 30).sort((a,b) =>{
                                return b.date.seconds - a.date.seconds
                              })
                              .map((notification, i) => {
                                return (
                                    <NotificationOutput
                                    key={notification?.notiId}
                                      notification={notification}
                                      igVideoImg={igVideoImg}
                                      myData={receivedData}
                                      handleFollowing={handleFollowing}
                                      changeMainState={changeMainState}
                                      closeNotiBox={setNoti}
                                      postIndex={i}
                                    />
                                );
                              })}
                          </ul>
                        ) : (
                          <div className="empty--box flex-row">
                            <h4>No notifications available right now</h4>
                          </div>
                        )}
                      </div>
                      <div className="noti__transparent"></div>
                    </div>
                  </li>
                  <li>
                    <span title={receivedData?.userName} onClick={() => setProf(true)}>
                      <Avatar
                        style={{border: (openProf || props.location.pathname?.toLowerCase() === "/profile" || props.location.pathname?.toLowerCase() === "/edit-profile") ? "2px solid #111" : ""}}
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
                      className="noti--popup--window"
                    >
                      <div className="noti--popup--inner">
                        <div className="noti--popup--arrow"> </div>
                        <ul className="prof--popup--ul flex-column">
                          <Link onClick={() => setProf(false)} to="/profile">
                            <li>
                              <CgProfile className="prof__popup" /> Profile
                            </li>
                          </Link>
                          <Link
                            onClick={() => setProf(false)}
                            to="/edit-profile"
                          >
                            <li>
                              <BiCog className="prof__popup" /> Settings
                            </li>
                          </Link>
                          <Link
                            onClick={() => setProf(false)}
                            to="/about"
                          >
                            <li>
                              <BiInfoCircle className="prof__popup" /> About
                            </li>
                          </Link>
                          <li
                            onClick={() => onLoggingOut()}
                          >
                            <BiPowerOff className="prof__popup" /> Log Out
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
