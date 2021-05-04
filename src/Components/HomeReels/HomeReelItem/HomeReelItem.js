import React, {useContext, useState} from "react";
import reelDefaultIco from "../../../Assets/reels.png";
import { Avatar } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import { AppContext } from "../../../Context";
import Styled from "styled-components";
 const Canvas = Styled.div`
        position: relative;
        border: 2px solid transparent;
        margin:auto;
        border-radius: 50%;
        width: 62px;
        height: 62px;
        justify-content: center;
        align-items:center;
        background-clip: padding-box;
        $border: 1px;
        min-height: 61px;
        z-index: 0;
        
        &::before{
            content: "";
            position: absolute;
            top: 0;
            bottom: 0;
            right:0;
            left:0;
            animation: ${props => props.isReelLoading && "rotateReel 0.5s linear"};
            animation-iteration-count: infinite;
            background: radial-gradient(circle at 30% 107%, #fdf497 1%,#ffc63f 10% , #fd3358 45%,#bc35d8 60%);
            -webkit-text-fill-color: transparent;
            border-radius: inherit;
            margin: -$border;
            z-index: -1;
        }
        .reels__icon{
            position: absolute;
            object-fit: contain;
            width: 54px;
            height: 54px;
            min-height: 54px;
            background-color: #fff;
            padding:2px;
            justify-content:center;
            text-align:center;
            align-items:center;
            img.MuiAvatar-img{
                border-radius: 50%;
            } 
    }
    `;
    
const HomeReelItem = (props) => {
    const { updateReelsProfile, changeMainState, notify } = useContext(AppContext);
    const [isReelLoading, setLoadingReel] = useState(false);
    const history = useHistory();
   
    const openReel = (reelId, groupId , uid ) => {
        setLoadingReel(true);
        updateReelsProfile(uid).then((res) => {
            setTimeout(() =>{
                setLoadingReel(false);
                    //checks indices
                    const checkGroupIndex = res?.reels?.length > 0 && res?.reels?.map(el => el.id).indexOf(groupId);
                    if(checkGroupIndex !== -1){ 
                        const checkReelIndex = res?.reels[checkGroupIndex]?.reelItems?.map(item => item.id).indexOf(reelId);
                        if(checkReelIndex !== -1){
                            changeMainState("currentReel", {groupIndex: checkGroupIndex , groupId: groupId, reelIndex: checkReelIndex, reelId: reelId });
                            history.push("/reels");
                        }else{
                            notify("Reel is not available or got deleted","error");
                        }
                    
                    }else{
                        notify("Reel is not available or got deleted","error");
                    }
            },2000);
            
        })
    }
    const {reel} = props;
    return(
        <li onClick={()=> {reel?.id && openReel(reel?.id,reel?.groupId ,reel?.reelOwnerId)}} className="home-reel-item flex-column" title={reel?.userName}>
            {/* {isReelLoading ? "true": "false"} */}
            <div className=" home-reel-container flex-column">
                    <Canvas isReelLoading={isReelLoading} className="reel--reel--inner  flex-column">
                        <Avatar className="reels__icon flex-column" src={(reel?.userAvatarUrl || reelDefaultIco)} alt={reel.userName}/>
                    </Canvas>
                    <small className="home--reel--user--name">{reel?.userName}</small>
            </div>
        </li>
    )
}
HomeReelItem.propTypes = {
    reel: PropTypes.object.isRequired
}
export default HomeReelItem;