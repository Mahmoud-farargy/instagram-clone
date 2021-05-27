import React,{useContext, memo} from "react";
import Auxiliary from "../HOC/Auxiliary";
import {NavLink, withRouter} from "react-router-dom";
import "../Header/Header.css";
import {HiHome} from "react-icons/hi";
import {FaHeart, FaFacebookMessenger} from "react-icons/fa";
import {BsFillPlusCircleFill} from "react-icons/bs";
import {Avatar} from "@material-ui/core";
import {AppContext} from "../../Context";
import {auth} from '../../Config/firebase';
import {useAuthState} from "react-firebase-hooks/auth";

const MobileNav =(props)=>{
    const context = useContext(AppContext);
    const {receivedData, closeNotificationAlert} = context;
    const [user] = useAuthState(auth);
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
            <header id="mobNav" className="mobile--nav flex-row">
                    <nav className="header--nav">
                        <ul className="header--ul flex-row">
                            <li><NavLink exact to="/" activeClassName="active-nav-link"><HiHome style={{fontSize:"26px"}}/></NavLink></li>
                            {/* hides if user is not logged in */}
                                { user ? <li className="like__icon__item"><NavLink  onClick={()=> reverseNotiState("isNewMsg")}   to="/messages" activeClassName="active-nav-link"><FaFacebookMessenger/>
                                    {
                                      receivedData?.notifications?.isNewMsg && props.location.pathname !== "/messages" ?
                                        <div className="like__noti__dot mt-1"></div>
                                            : null
                                    } </NavLink></li> : null}
                                { user ? <li ><NavLink  to="/add-post" activeClassName="active-nav-link"><BsFillPlusCircleFill/></NavLink></li> : null}
                                { user ? <li className="like__icon__item" onClick={()=> reverseNotiState("isUpdate")}><NavLink to="/notifications" activeClassName="active-nav-link">
                                    <FaHeart />
                                    {
                                      receivedData?.notifications?.isUpdate && receivedData.notifications?.list?.length>=1 ?
                                        <div className="like__noti__dot mt-1"></div>
                                            : null
                                    } 
                                    </NavLink></li> : null}
                                { user ? <li ><NavLink  to="/profile" activeClassName="active--profile--nav"><Avatar src={receivedData?.userAvatarUrl} alt={receivedData?.userName} className="header__user__avatar flex-column"/></NavLink></li> : null}                            
                        </ul>
                    </nav>
            </header>
        </Auxiliary>
    )
}
export default withRouter(memo(MobileNav));