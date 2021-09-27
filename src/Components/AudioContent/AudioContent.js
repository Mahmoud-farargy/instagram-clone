import React, { useState } from "react";
import { MdAudiotrack } from "react-icons/md";
import AudioPlayer from "react-h5-audio-player";
import igAudioImg from "../../Assets/ig-audio.jpeg";
import PropTypes from "prop-types";
import { MdDescription } from "react-icons/md";
import { trimText } from "../../Utilities/TrimText";

const AudioContent = ({ url, userName, doubleClickEvent, songInfo, ...args }) => {
  const [showDetails, setShowingDetails] = useState(false);

  return (
    <div className="audio--content post__card__content__middle flex-column">
      <div className="post__card__content">
        <div className="post--audio--container">
          <img className="audio__artwork__cover" loading="lazy" alt={`Post by ${userName}`} src={songInfo?.artwork || igAudioImg} onClick={() => doubleClickEvent(true)} />
          {
            (showDetails && songInfo && Object.keys(songInfo).length > 0) &&
            <div className="song--details--container fadeEffect">
              {/* top info */}
              <div className="post--song--main--info">
                {songInfo.name && <h3 className="song--title"><a href={songInfo.songFMUrl || "#"} rel="noopener noreferrer" target="_blank">{trimText(songInfo.name, 60)}</a></h3>}
                {songInfo.artist && <h5 className="song--artist"><a href={songInfo.artistFMUrl || "#"} rel="noopener noreferrer" target="_blank">{trimText(songInfo.artist, 30)}</a></h5>}
                {songInfo.album && <h6 className="song--album--title">From "<a href={songInfo.albumFMUrl || "#"} rel="noopener noreferrer" target="_blank">{trimText(songInfo.album, 40)}</a>" album</h6>}
              </div>
              {/* lyrics */}
              {songInfo.songLyrics && <article className="post--song--lyrics">{songInfo.songLyrics}</article>}
              {/* bottom stats */}
              <div className="post-song--stats">
                {songInfo.publishedDate && <span className="post--song--stat--item"><strong>Release date:</strong> {songInfo.publishedDate}</span>}
                {songInfo.playCountFM && <span className="post--song--stat--item mb-3"><strong>Play count on last.fm:</strong> {/^\d+$/.test(songInfo.playCountFM) ? Number(songInfo.playCountFM).toLocaleString() : songInfo.playCountFM}</span>}
                {songInfo.summary && <span className="post--song--stat--item"><strong>Content: </strong>
                  <span dangerouslySetInnerHTML={{
                    __html: trimText(songInfo.summary, 600),
                  }}></span>
                </span>}
                <div className="post--song--tags flex-row">
                  {(songInfo.tags && songInfo.tags.length > 0) &&
                    songInfo.tags?.map(((tagItem, idx) => (tagItem && tagItem.name) && <a className="link--element" rel="noopener noreferrer" target="_blank" href={tagItem.url} key={tagItem.name + idx}>#{tagItem}</a>))
                  }
                </div>

              </div>
            </div>
          }
        </div>

        <AudioPlayer
          {...args}
          // ref={this.testRef}
          draggable="false"
          src={url}
          // onPlay={e => console.log("onPlay")}
          className="pb-3"
        />
        <MdAudiotrack className="video__top__icon" />
        {songInfo && Object.keys(songInfo).length > 0 && <span onClick={() => setShowingDetails(prevState => !prevState)} style={{ color: showDetails ? "var(--sugg-btn-clr)" : "#fff" }} className="lyrics--top--icon flex-column"><MdDescription /></span>}

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