import React from "react";
import { MdAudiotrack } from "react-icons/md";
import AudioPlayer from "react-h5-audio-player";
import igAudioImg from "../../Assets/ig-audio.jpeg";
import PropTypes from "prop-types";

const AudioContent = ({url,userName, doubleClickEvent, songInfo, ...args}) => {
    // const [showDetails, setShowingDetails] = useState(true);
    return(
        <div className="audio--content post__card__content__middle flex-column">
          <div  className="post__card__content">
            <img className="audio__artwork__cover" loading="lazy" alt={`Post by ${userName}`} src={ songInfo?.artwork || igAudioImg } onClick={() => doubleClickEvent(true)} />
            {/* {
             (showDetails && songInfo && Object.keys(songInfo).length > 0) &&
              <div className="song--details--container fadeEffect">
                test
              </div>
           } */}
           <AudioPlayer
              {...args} 
              // ref={this.testRef}
              draggable="false"
              src={url}
              // onPlay={e => console.log("onPlay")}
              className="pb-2"
            />
            <MdAudiotrack className="video__top__icon" />


        </div>       
      </div>
    )
}
AudioContent.propTypes = {
  url: PropTypes.string.isRequired,
  userName: PropTypes.string,
  doubleClickEvent: PropTypes.func,
  songInfo: PropTypes.object
}
export default AudioContent;