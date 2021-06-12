import React, { Fragment, PureComponent } from "react";
import { AppContext } from "../../Context";
import { trimText } from "../../Utilities/TrimText";
import "./UserName.scss";
import { Avatar } from "@material-ui/core";
import PropTypes from "prop-types";
import FollowUnfollowBtn from "../../Components/FollowUnfollowBtn/FollowUnfollowBtn";
import MutualFriendsItem from "../../Pages/UsersProfile/MutualFriendsList/MutualFriendsItem";

class UserName extends PureComponent {
    static contextType = AppContext;
    state = {
        focusCounter: 0,
        showUserOnHover: false
    }
    componentWillUnmount(){
        this.resetTimer();
    }
    resetTimer(){
        this.setState({...this.state,focusCounter:0});
        window.clearInterval(this.intervals?.current);
    }
    intervals = React.createRef(null);
   loadUserContent = () => {
        if((window.innerWidth || document.documentElement.clientWidth) >= 670){
            this.intervals.current = setInterval(() => {
                if(this.state.focusCounter <1){
                    this.setState({
                        ...this.state,
                        focusCounter: this.state.focusCounter + 1
                    });
                }else{
                    this.setState({
                        ...this.state,
                        showUserOnHover: true
                    });
                    this.resetTimer();
                }
            },400);
        }
    }
   onUnhovering = (x) => {
    x.stopPropagation();
        this.resetTimer();
        this.setState({
            ...this.state,
            showUserOnHover: false
        })
    }
    render(){
        const { userName= "", userAvatarUrl = "", uid = "",  isVerified = false, posts = [], followers = [], following = [], profileInfo } = this.props?.user;
        const { receivedData } = this.context;
        const similarFollowers = (uid !== receivedData?.uid) && (receivedData?.blockList?.filter(w => w.blockedUid !== uid)) ? receivedData?.following.filter(el => el.receiverUid !== receivedData?.uid && followers.some(item => item.senderUid === el.receiverUid)) : [];
        return (
            <Fragment>
                <div id="userNameStyle">
                    <h5 className="displayed_userName" title={userName} onMouseEnter={() => this.loadUserContent()} onMouseLeave={(x) => this.onUnhovering(x)}>{trimText(userName, 20)}</h5>
                    {
                        this.state.showUserOnHover &&
                        <div className="user--mini--window flex-column fadeEffect">
                            <header className="mini--window--header flex-column">
                                <div className="mini--window--user flex-row">
                                    <Avatar
                                        loading="lazy"
                                        className="user__picture"
                                        title={userName}
                                        src={userAvatarUrl}
                                        alt={userName}
                                    />
                                    <div className="mini--window--info flex-column">
                                        <h5>{trimText(userName, 20)}</h5>
                                        {profileInfo?.name && <h6>{trimText(profileInfo?.name, 20)}</h6>}                                    
                                    </div>  
                                </div>
                                <div className="mini--window--bio flex-column">
                                    <p>{trimText(profileInfo?.bio,70)}</p>
                                    {
                                        similarFollowers && similarFollowers.length > 0 &&
                                        <p  className="similar__followers">Followed by<span>
                                            {
                                            similarFollowers.slice(0,3).map(q => <MutualFriendsItem key={q?.receiverUid} item={q} />)
                                        }
                                        {
                                            similarFollowers.length > 3 && 
                                            <span className="similar__followers__more pl-1">+{ `${(similarFollowers.length - 3)}`} more</span>
                                        }
                                        </span></p>
                                    }
                                </div>
                            </header>
                            <div className="mini--window--media--counters flex-row">
                                <span data-cy="postsCount">
                                    <h5>{posts?.length.toLocaleString()}</h5>
                                    Posts
                                </span>
                                <span>
                                    <h5>{followers?.length.toLocaleString()}</h5>
                                    Followers
                                </span>
                                <span>
                                    <h5>{following?.length.toLocaleString()}</h5>
                                   Following
                                </span>

                            </div>
                            <div className="mini--window--posts">

                            </div>
                            <div className="mini--window--actions">
                                <FollowUnfollowBtn shape="secondary" userData={{userId: uid, uName: userName, uAvatarUrl: userAvatarUrl, isVerified: isVerified}}  />
                            </div>
                        </div>
                    }
                </div>
                
            </Fragment>
        )  
    }

}
UserName.propTypes = {
    user: PropTypes.object.isRequired
};
export default UserName;