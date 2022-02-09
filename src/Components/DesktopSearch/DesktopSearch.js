import React, { useState, useContext, useEffect, useRef, lazy } from "react";
import { AppContext } from "../../Context";
import PropTypes from "prop-types";
import SearchItem from "../../Components/SearchItem/SearchItem";
import { RiSearchLine, RiMic2Fill } from "react-icons/ri";
import { TiDelete } from "react-icons/ti";
import { BsMicFill } from "react-icons/bs";
import Loader from "react-loader-spinner";
import { debounce } from "../../Utilities/Debounce";
import { retry } from "../../Utilities/RetryImport" ;
const OptionsModal = lazy(() => retry(() => import("../../Components/Generic/OptionsModal/OptionsModal")));

const DesktopSearch = ({ controlSearchBox, openSearchBox }) => {
  const [searchVal, setSearchVal] = useState("");
  const [openVoiceBox, setVoiceBox] = useState(false);
  const isVoiceSearching = useRef(false);
  const timeIntervalId = useRef(null);
  const { searchInfo, convertSpeech, searchUsers, pauseMedia, changeMainState } = useContext(AppContext);
  const _isMounted = useRef(true);
  useEffect(() => {
    if (_isMounted?.current) {
      if (searchVal && searchVal !== "") {
        if (!openVoiceBox) {
          (debounce(function () {
            searchUsers(searchVal, "regular");
          }, 900, timeIntervalId, false))();
        }
        controlSearchBox(true);
      } else {
        controlSearchBox(false);
        clearSearchBox();
      }
    }
  }, [searchVal]);
  useEffect(() => () => {
    ("SpeechRecognition" in window && window.SpeechRecognition) && searchByVoice("stop");
    return () => {
       _isMounted.current = false;
    }
  }, []);
  const searchByVoice = (actionProp) => {
    if (actionProp === "start") {
      isVoiceSearching.current = true;
      convertSpeech({ type: "stt", action: "start" }).then(sentence => {
        if (_isMounted?.current && sentence && isVoiceSearching?.current) {
          setSearchVal(sentence);
          searchUsers(sentence, "regular").then((results) => {
            if (_isMounted?.current && results) {
              isVoiceSearching.current = false;
              setVoiceBox(false);
              if (results.length > 0) {
                convertSpeech({ type: "tts", phrase: `Here are the results found for ${sentence}` });
              } else {
                convertSpeech({ type: "tts", phrase: `No results found. Please try another word or speak more clearly` });
              }
            }
          })
        }
      });
    } else if (actionProp === "stop") {
      isVoiceSearching.current = false;
      convertSpeech({ type: "stt", action: "stop" });
    }

  }
  const clearSearchBox = () => {
    setSearchVal("");
    changeMainState("searchInfo", { results: [], loading: false });
  };
  useEffect(() => {
    if (openVoiceBox) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }
    return () => document.body.style.overflow = "visible";
  }, [openVoiceBox]);
  return (
    <>
      {/* modals */}
      {openVoiceBox && (
        <OptionsModal closeModalFunc={(k) => setVoiceBox(k)}>
          <div id="logoutModal" className="desktop--search">
            <div className="logout--modal ">
              <h3 className="flex-column pt-3">Search with your voice</h3>
              <p>To search by voice, go to your browser settings and allow access to microphone</p>
            </div>
            <div className="voice__search__option flex-column py-3" >
              <div className="flex-column align-items-center justify-content-center text-align-center">
                <RiMic2Fill onClick={() => searchByVoice(!pauseMedia ? "start" : "stop")} className={`voice__search__btn ${pauseMedia && "boundingEffect"}`} />
                <div className="voice__speach__listening fadeEffect">
                  {pauseMedia && <h5>Listening..</h5>}
                </div>

              </div>

            </div>
            <span >
              Cancel
                  </span>
          </div>
        </OptionsModal>
      )}
      <div
        style={{
          opacity: openVoiceBox ? "1" : "0",
          display: openVoiceBox ? "block" : "none",
          transition: "all 0.5s ease",
        }}
        className="backdrop "
        onClick={() => setVoiceBox(false)}
      ></div>
      <div className="search--bar--container">
        <input
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          type="text"
          className="search__input"
          aria-label="search bar"
          placeholder="Search"
          autoCapitalize="none"
        />
        <span className="search__icon">
          <RiSearchLine />
        </span>
        {searchInfo?.loading ? (
          <span className="loading--search--box">
            <Loader
              type="Puff"
              color="#919191"
              height={19}
              width={19}
              timeout={5000}
            />
          </span>
        ) : searchVal ? (
          <span
            onClick={() => clearSearchBox()}
            className="clear--search--box"
          >
            <TiDelete />
          </span>
        ) : <span
          onClick={() => setVoiceBox(true)}
          className="clear--search--box voice__search__icon"
        >
              <BsMicFill />
            </span>}

        <div
          style={{
            display: openSearchBox ? "flex" : "none",
            transition: "all 0.4s ease",
            opacity: openSearchBox ? "1" : "0",
          }}
          className="search--pop--window fadeEffect"
        >
          <div className="search--popup--arrow"> </div>
          <div className="search--popup--inner">
            <ul className="noti--popup--ul flex-column">
              {(searchInfo?.results && searchInfo?.results.length > 0 && !searchInfo?.loading) ? (
                searchInfo?.results?.map((user, i) => {
                  return (
                    <SearchItem
                      key={user?.uid || i}
                      user={user}
                      closeSearchBox={controlSearchBox}
                    />
                  );
                })
              ) : searchInfo?.loading ?
                  (
                    <div className="empty--box flex-row">
                      <Loader
                        type="TailSpin"
                        color="#919191"
                        arialLabel="loading-indicator"
                        height={35}
                        width={35}
                        timeout={5000}
                      />
                    </div>
                  )
                  : (
                    <div className="empty--box flex-row">
                      <h4>No Results found</h4>
                    </div>
                  )}
              <div className="noti__transparent"></div>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
DesktopSearch.propTypes = {
  controlSearchBox: PropTypes.func.isRequired
}
export default DesktopSearch;