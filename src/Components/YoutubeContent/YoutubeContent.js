import React, { useState, useRef, useEffect } from "react";
import YouTube from 'react-youtube';
import LoadContentFail from "../LoadContentFail/LoadContentFail";
import Loader from "react-loader-spinner";
import PropTypes from "prop-types";

const YoutubeContent = ({ youtubeData, autoPlay = false }) => {
    const { id } = youtubeData;
    const [ hasError, setErrorState ] = useState(false);
    const [ isBuffering, setBuffering ] = useState(true);
    const _isMounted = useRef(true);
    const YTSettings = {
        height: '390',
        width: '240',
        playerVars: {
            autoplay: autoPlay ? 1 : 0,
            color: "#0095f6",
            playsinline: 1,
            modestbranding: 1,
            loop: 1,
            // controls: 0
        },
    };
    useEffect(() => () => _isMounted.current = false, []);
    return (
        <div id="youtubeContent">
            {
                _isMounted.current &&
                <YouTube
                videoId={ id }
                id="YTVideo"
                title="Youtube Post"
                opts={YTSettings}
                onError={() => _isMounted.current && setErrorState(true)}
                onPlay={() => (_isMounted.current && hasError) && setErrorState(false)}
                onReady={() => _isMounted.current && setBuffering(false)}
            />
            }
            {    isBuffering &&
                <div className="buffererror flex-column">
                    {
                         hasError ?
                       <LoadContentFail contentType="video"  shape="phrase" />
                        :
                        <div className="vid--buffer">
                            <Loader
                            type="TailSpin"
                            color="var(--white)"
                            arialLabel="loading-indicator"
                            height={60}
                            width={60}/>  
                        </div>
                        
                    }
                </div>
            }
        </div>
    )
};
YoutubeContent.propTypes = {
    youtubeData: PropTypes.object.isRequired,
    autoPlay: PropTypes.bool
}
YoutubeContent.defaultProps = {
    youtubeData: {},
    autoPlay: false
}

export default YoutubeContent;