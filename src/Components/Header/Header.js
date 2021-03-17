import React, { useContext, useState, lazy, Suspense, useEffect } from "react";
import Auxiliary from "../HOC/Auxiliary";
import { NavLink, Link, BrowserRouter } from "react-router-dom";
import "./Header.css";
import { HiHome } from "react-icons/hi";
import { RiSendPlaneFill } from "react-icons/ri";
import { FaHeart } from "react-icons/fa";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { Avatar } from "@material-ui/core";
import { AppContext } from "../../Context";
import { auth } from "../../Config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { BiPowerOff, BiCog } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { RiSearchLine } from "react-icons/ri";
import { TiDelete } from "react-icons/ti";
import NotificationOutput from "../NotificationsOutput/NotificationsOutput";
import { withRouter } from "react-router-dom";
import SearchItem from "../SearchItem/SearchItem.js";
import Loader from "react-loader-spinner";

const Header = (props) => {
  const context = useContext(AppContext);
  const [openNoti, setNoti] = useState(false);
  const [openProf, setProf] = useState(false);
  const [openSearchBox, setSeachBox] = useState(false);
  const [user] = useAuthState(auth);
  const [searchVal, setSearchVal] = useState("");
  const {
    receivedData,
    closeNotificationAlert,
    authLogout,
    igVideoImg,
    handleFollowing,
    getUsersProfile,
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
  useEffect(() => {
    if (searchVal && searchVal !== "") {
      searchUsers(searchVal, "regular");
      setSeachBox(true);
    } else {
      setSeachBox(false);
      setSearchVal("");
    }
  }, [searchVal]);

  const browseUser = (specialUid, name) => {
    if (specialUid) {
      setSeachBox(false);
      getUsersProfile(specialUid);
      props.history.push(`/user-profile/${name}`);
    }
  };
  const clearSearchBox = () => {
    setSearchVal("");
  };
  return (
    <Auxiliary>
      <header id="header" className="main--header flex-row">
        <div className="header--inner flex-row">
          <Link to="/">
            <h1 className="logoText">Voxgram</h1>
          </Link>

          <div className="search--bar--container">
            <input
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
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
                          browseUser={browseUser}
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
                      <RiSendPlaneFill />
                      {receivedData?.notifications?.isNewMsg &&
                      props.location.pathname !== "/messages" ? (
                        <div className="like__noti__dot"></div>
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
                              ?.slice(0, 30)
                              .map((notification, i) => {
                                return (
                                  <div key={notification?.notiId}>
                                    <NotificationOutput
                                      onClick={() => setNoti(false)}
                                      notification={notification}
                                      igVideoImg={igVideoImg}
                                      myData={receivedData}
                                      handleFollowing={handleFollowing}
                                      getUsersProfile={getUsersProfile}
                                      changeMainState={changeMainState}
                                      postIndex={i}
                                    />
                                  </div>
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
                    <span onClick={() => setProf(true)}>
                      <Avatar
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
                          <li
                            onClick={() => {
                              authLogout(props.history);
                              setProf(false);
                              window.location.reload();
                            }}
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
export default withRouter(Header);
