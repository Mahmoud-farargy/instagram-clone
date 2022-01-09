import React, { useContext, useState, useRef, useEffect, memo } from "react";
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
            animation: ${props => props.isReelLoading && "rotateReel 0.5s ease-out"};
            animation-iteration-count: 100;
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
            background-color: var(--white);
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
    const { openReel } = useContext(AppContext);
    const [isReelLoading, setLoadingReel] = useState(false);
    const _isMounted = useRef(true);
    const timeouts = useRef(null);
    const history = useHistory();
    useEffect(() => {
        return () => {
            window.clearTimeout(timeouts.current);
            _isMounted.current = false;
        }
    }, []);
    const viewReel = () => {
        if (reel?.id) {
            setLoadingReel(true);
            timeouts.current = setTimeout(() => {

                openReel({ reelId: reel?.id, groupId: reel?.groupId, reelUid: reel?.reelOwnerId }).then(() => {
                    if (_isMounted?.current) {
                        setLoadingReel(false);
                        history.push("/reels");
                    }
                });
                window.clearTimeout(timeouts.current);
            }, 1000);
        }
    }
    const { reel } = props;
    return (
        <div onClick={() => viewReel()} className="home-reel-item flex-column" title={reel?.userName}>
            <div className=" home-reel-container flex-column">
                <Canvas isReelLoading={isReelLoading} className="reel--reel--inner  flex-column">
                    <Avatar className="reels__icon flex-column" src={(reel?.userAvatarUrl || reelDefaultIco)} alt={reel.userName} />
                </Canvas>
                <small className="home--reel--user--name">{reel?.userName}</small>
            </div>
        </div>
    )
}
HomeReelItem.propTypes = {
    reel: PropTypes.object.isRequired
}
export default memo(HomeReelItem);