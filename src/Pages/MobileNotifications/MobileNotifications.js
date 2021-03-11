import React, {useEffect} from 'react';
import Auxiliary from "../../Components/HOC/Auxiliary";
import NotificationOutput from "../../Components/NotificationsOutput/NotificationsOutput";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../../Config/firebase";

const MobileNotifications =(props)=>{
    const {_, loading} = useAuthState(auth);
    const {igVideoImg, handleFollowing, getUsersProfile, changeMainState, receivedData,  } = props.context;
    useEffect(() =>{
        changeMainState("currentPage","Notifications");
    },[]);
    return(
        <Auxiliary>
          {
              !loading ?
            <div className="mob--notifications--container noti--popup--inner desktop-comp">
                <div className="mob--noti--title">
                    <h4>Activity</h4>
                </div>
               {
                   receivedData?.notifications?.list.length >=1  ?

                    <ul id="mobNotifications" className="noti--popup--ul mob--notifications flex-column">
                        {
                            receivedData?.notifications?.list?.map( (notification, i) =>{
                                return(
                                    <div key={notification?.notiId}>   
                                            <NotificationOutput  notification={notification} igVideoImg={igVideoImg} myData={receivedData} handleFollowing={handleFollowing} getUsersProfile={getUsersProfile} changeMainState={changeMainState} postIndex={i} /> 
                                    </div>
                                )
                            })
                        }
                    </ul>
                    :
                    (<div><h4 style={{textAlign:"center"}}>No notifications available right now</h4></div>)
               } 
                
            </div>
            : <h3>Loading...</h3>
            }
        </Auxiliary>
    )
}
export default MobileNotifications;