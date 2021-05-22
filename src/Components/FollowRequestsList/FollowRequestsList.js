import React, { useContext,useState } from "react";
import FollowRequestItem from "./FollowRequestItem/FollowRequestItem";
import { Avatar } from "@material-ui/core";
import { AppContext } from "../../Context";

const FollowRequestsList = () => {
    const [showFollowRequests, setShowingRequests] = useState(false);
    const { receivedData, handleFollowRequests } = useContext(AppContext);
    return(
        <>
         {
           !showFollowRequests && receivedData?.followRequests && receivedData?.followRequests?.received?.length > 0 &&
            <div className="requests--button w-100 space__between noti--popup-item" title="Follow Requests" onClick={()=> setShowingRequests(true)}>
                    <div className="flex-row noti--row">
                        <div><Avatar className="noti__user__img" src={receivedData?.followRequests.received?.[0]?.userAvatarUrl} alt={receivedData?.followRequests.received?.[0]?.userName} /></div>
                        <div className="flex-column noti--user--info">
                            <h6>Follow Requests</h6>
                            <p className="noti__text">Approve or ignore requests</p>
                        </div> 
                    </div>
                    <div className="flex-row align-items-center">
                      <span className="requests--bubble">{receivedData?.followRequests?.received?.length?.toLocaleString()}</span>
                    </div>
            </div>
         }
         {
           showFollowRequests && receivedData?.followRequests?.received?.length > 0 &&
           <ul className="m-0 w-100 requests--noti noti--popup--ul flex-column" style={{minHeight:"30px"}}>
             { receivedData?.followRequests?.received?.length > 0 && receivedData?.followRequests?.received?.map(request =>(
                request &&
                <FollowRequestItem key={request?.uid} request={request} handleFollowRequests={handleFollowRequests} />
               ))
             }
           </ul>
         }
        </>
    )
}
export default FollowRequestsList;