import React, {useContext, useState} from "react";
import Auxiliary from "../HOC/Auxiliary";
import {NavLink, Link} from "react-router-dom";
import "./Header.css";
import {HiHome} from "react-icons/hi";
import {RiSendPlaneFill} from "react-icons/ri";
import {FaHeart} from "react-icons/fa";
import {BsFillPlusCircleFill} from "react-icons/bs";
import {Avatar} from "@material-ui/core";
import {AppContext} from "../../Context";
import {auth} from "../../Config/firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import {BiPowerOff} from "react-icons/bi";
import {CgProfile} from "react-icons/cg";
import NotificationOutput from "../NotificationsOutput/NotificationsOutput";
import {withRouter} from "react-router-dom";

const Header =(props)=>{
    const context = useContext(AppContext);
    const [openNoti, setNoti] = useState(false);
    const [openProf, setProf] = useState(false);
    const [user] = useAuthState(auth);
    const {receivedData, closeNotificationAlert, authLogout, igVideoImg, handleFollowing, getUsersProfile, changeMainState} = context;
    const reverseNotiState=(type)=>{
      const notiUpdate = receivedData?.notifications?.isUpdate;
      const notiMsg = receivedData?.notifications?.isNewMsg;
        
        if(type === "isUpdate" && notiUpdate){
            closeNotificationAlert(type);
        }else if(type === "isNewMsg" && notiMsg){
            closeNotificationAlert(type);
        }
    }
    return(
        <Auxiliary>
            <header id="header" className="main--header flex-row">
                <div className="header--inner flex-row">
                   <Link to="/"><h1 className="logoText">Voxgram</h1></Link>
                    <nav className="header--nav flex-row">
                        <ul className="header--ul flex-row">
                            <li><NavLink exact to="/" activeClassName={!openNoti ? "active-nav-link" : "" }><HiHome style={{fontSize:"26px"}}/></NavLink></li>
                           {
                               user ?
                            <div className="flex-row" style={{alignItems:"center"}} >
                            <li className="like__icon__item"><NavLink onClick={()=> reverseNotiState("isNewMsg")}  to="/messages" activeClassName={!openNoti ? "active-nav-link" : "" }>
                                <RiSendPlaneFill/>
                                {
                                      receivedData?.notifications?.isNewMsg && props.location.pathname !== "/messages" ?
                                        <div className="like__noti__dot"></div>
                                        : null
                                } 
                            </NavLink></li>
                            <li><NavLink  to="/add-post" activeClassName={!openNoti ? "active-nav-link" : "" }><BsFillPlusCircleFill/></NavLink></li>
                            <li className="noti--parent--container" onClick={()=> {setNoti(true); reverseNotiState("isUpdate")}}>
                                
                                <span className="like__icon__item">
                                    <FaHeart style={{color: openNoti ? "#0095f6" :"#363636"}} />
                                  {
                                      receivedData?.notifications?.isUpdate && receivedData.notifications?.list?.length>=1 ?
                                        <div className="like__noti__dot"></div>
                                        : null
                                  } 
                                </span>
                                <div style={{
                                    display: openNoti ? "flex" : "none",
                                    transition: "all 0.4s ease",
                                    opacity: openNoti ? "1" : "0"
                                }} className="noti--popup--window">
                                
                                    <div className="noti--popup--inner">
                                        <div className="noti--popup--arrow"> </div>
                                        {
                                             receivedData?.notifications?.list.length >=1 ?
                                            <ul className="noti--popup--ul flex-column">
                                                {
                                                    receivedData?.notifications?.list?.map( (notification, i) =>{
                                                        return(
                                                            <div key={notification?.notiId}>
                                                                <NotificationOutput onClick={()=> setNoti(false)}  notification={notification} igVideoImg={igVideoImg} myData={receivedData} handleFollowing={handleFollowing} getUsersProfile={getUsersProfile} changeMainState={changeMainState} postIndex={i} />                                                                
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </ul>
                                        : 
                                            <div><h4 style={{textAlign:"center"}}>No notifications available right now</h4></div>
                                        }
                                        <div className="noti__transparent"></div>
                                    </div>
                                </div>
                            </li>
                            <li><span onClick={()=> setProf(true)}><Avatar src="" alt="" className="header__user__avatar flex-column"/></span>
                            <div style={{
                                    display: openProf ? "flex" : "none",
                                    transition: "all 0.4s ease",
                                    opacity: openProf ? "1" : "0"
                                }} id="profilePopup" className="noti--popup--window" >
                                
                                    <div  className="noti--popup--inner">
                                        <div className="noti--popup--arrow"> </div>
                                        <ul className="prof--popup--ul flex-column">
                                            <li onClick={()=> setProf(false)}><Link to="/profile"><CgProfile className="prof__popup" /> Profile</Link></li>
                                            <li onClick={()=> {authLogout(); setProf(false); window.location.reload()}}><Link to="/auth"><BiPowerOff className="prof__popup"/> Log Out</Link></li>
                                        </ul>
                                        <div className="noti__transparent"></div>
                                    </div>
                                </div>
                            </li>
                            </div>
                            : null
                            }
                        </ul>
                        {
                            openProf || openNoti ?
                                <div className="hidden--backdrop" onClick={()=> {setProf(false); setNoti(false)}}></div>
                            : null
                        }
                    </nav>
                </div>
            </header>
        </Auxiliary>
    )
}
export default withRouter(Header);