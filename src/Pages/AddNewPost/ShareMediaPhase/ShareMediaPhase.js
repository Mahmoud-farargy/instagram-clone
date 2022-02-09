import React, { Fragment, useState, memo, useRef, useEffect } from "react";
import InputForm from "../../../Components/Generic/InpuForm/InputForm";
import PropTypes from "prop-types";
import * as Consts from "../../../Utilities/Consts";
import API from "../../../Config/API";
import { lastFMKey } from "../../../info";
import CheckboxIOS from "../../../Components/Generic/CheckboxIOS/CheckboxIOS";
import { Button, LinearProgress } from "@material-ui/core";
import { storage } from "../../../Config/firebase";
import { useHistory } from "react-router-dom";
import { Avatar } from "@material-ui/core";
import { GoVerified } from "react-icons/go";
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import ImageMarker from 'react-image-marker';

const ShareMediaPhase = ({ contentType, contentPreview, method, context, uploadedItem, contentName }) => {
    const { mutateLoadingState, loadingState, receivedData } = context;
    const history = useHistory();
    const _isMounted = useRef(true);
    const [loadState, setLoadState] = useState({
      submitted: false
    });
    const [markers, setMarkers] = useState([]);
    const [shareState, setShareState] = useState({
      caption: "",
      location: "",
      artist: "",
      selectedReelGroup: receivedData?.reels && (receivedData?.reels?.length > 0 ? (receivedData?.reels[0].groupName) :"New Group"),
      newGroupName: "",
      showReelFieldErr: false,
      progressBarPercentage: 0,
      songName: "",
      alteredUrl: contentPreview,
      disableComments: false
    });
  const [storagePath, setStoragePath] = useState("content");
  useEffect(() => {
    setStoragePath(method.toLowerCase() === Consts.Reel ? "reels" :  "content");
  },[method]);
  const onInputChange = (val, name) => {
      setShareState({
        ...shareState,
        [name]: val
      });
      if(method.toLowerCase() === Consts.Reel){
        !shareState.selectedReelGroup && (setShareState({...shareState, selectedReelGroup: "New Group"}));
      }
    }
  useEffect(() =>{
      if(contentPreview && new URL(contentPreview).protocol === 'blob:'){
        async function convertBlobToFile() {
          return await fetch(contentPreview).then(r => _isMounted.current && r.blob());
        }
        convertBlobToFile().then(res => {
          if(_isMounted?.current){
              setShareState({
                ...shareState,
                alteredUrl: res || contentPreview
              })
          }
        })
    }
     return () => {
      mutateLoadingState({key: "uploading", val:false});
      _isMounted.current = false;
    };
  }, []);
  

  const resetState = () => {
    // RESET ADDNEWPOST COMPONENT'S DATA AS WELL
    setShareState({
      ...shareState,
      caption: "",
      progressBarPercentage: 0,
      location: "",
      contentName: "",
      showReelFieldErr: false,
      method: "Post"
    });
    mutateLoadingState({key: "uploading", val:false});
    setLoadState({...loadState,
      submitted: false
    });
  }
  const onDataAdding = ({songInfo, type ,url}) =>{
    let { receivedData, uid, notify, generateNewId, addPost } = context;
    if(uid && url && contentType && receivedData?.userName && contentName){
      if(type.toLowerCase() === Consts.Post){
          const addedPost = {
            caption: shareState.caption,
            id: generateNewId(),
            contentType: contentType,
            contentURL: url,
            comments: [],
            date: new Date(),
            likes: { people: [] },
            userName: receivedData?.userName,
            location: shareState.location,
            postOwnerId: uid,
            userAvatarUrl: receivedData?.userAvatarUrl,
            contentName,
            songInfo: songInfo || {},
            disableComments: shareState.disableComments
          }
          addPost(addedPost, Consts.Post).then(() => {
            if(_isMounted?.current){
              notify("Post has been added");
              resetState();
              setLoadState({...loadState, submitted: false});
              history.push("/");
            }
          }).catch(() =>{
            if(_isMounted?.current){
              notify("Failed to make a post. Please try again later!", "error");
            }
          }); 
      }else if(type.toLowerCase() === Consts.Reel){
                //submits reel
                const addedReel = {
                  id: generateNewId(),
                  comments: [],
                  contentURL: url,
                  date: new Date(),
                  likes: [],
                  userName: receivedData?.userName,
                  reelOwnerId: uid,
                  userAvatarUrl: receivedData?.userAvatarUrl,
                  contentName
                }
                addPost(addedReel, Consts.Reel, {selectedGroup:shareState.selectedReelGroup, newGroupName: shareState.newGroupName}).then(() => {
                  if(_isMounted?.current){
                    notify(`Reel has been added to ${shareState.selectedReelGroup.toLowerCase() === "new group" ? shareState.newGroupName : shareState.selectedReelGroup}.`);
                    resetState();
                    setLoadState({...loadState, submitted: false});
                    history.push("/profile");
                  }
                }).catch((err) =>{
                  if(_isMounted?.current){
                    notify((err?.message || "Failed to post reel. Please try again later!"), "error");
                  }
                });
      }
    }else{
      notify(`An error occurred. Please try again later.`, "error");
    }
  }
  
  const onSubmitPost = (x) => {
    x.preventDefault();
    mutateLoadingState({key: "uploading", val: true});
    setLoadState({...loadState, submitted: true});
    let { receivedData, uid, notify } = context;
    if (uid) {
      const metadata = {
          contentType: Object.keys(uploadedItem).length > 0 ? uploadedItem?.type : "" ,
      };
      const uploadContent = storage
      .ref(`${storagePath}/${receivedData?.uid}/${contentName}`)
      .put(shareState.alteredUrl, metadata);
    uploadContent.on(
      "state_changed",
      (snapshot) => {
        //Progress function ..
        const progress =
          Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setShareState({
          ...shareState,
          progressBarPercentage: progress,
        });
      },
      (error) => {
        // Error Function ..
        notify(error.message, "error");
        resetState();
      },
      () => {
          // Complete function..
          storage
            .ref(`${storagePath}/${receivedData?.uid}`)
            .child(contentName)
            .getDownloadURL()
            .then((url) => {
              if(_isMounted?.current){
                      //submits post
                  if(method?.toLowerCase() === Consts.Post){
                    if (shareState.caption.split(" ").length < 250 && shareState.caption.split(" ").length > 0) {
                      if (contentName !== "" && uploadedItem && shareState.alteredUrl) {
                        // upload area
                        // audio
                        if(contentType?.toLowerCase() === "audio"){
                          if(shareState.songName || shareState.artist){
                            if(shareState.songName && shareState.artist){
                                
                                function getSongInfo (songLyrics) {
                                  // Get additional info
                                  API().get(`/?method=track.getinfo&api_key=${lastFMKey}&artist=${shareState.artist?.trim()?.toLowerCase()}&track=${shareState.songName?.trim()?.toLowerCase()}&format=json`).then(res => {
                                    if(_isMounted?.current){
                                      const trackInfo = res?.data?.track;
                                      const songInfo = {
                                        artwork: trackInfo?.album?.image[3]?.["#text"] ? trackInfo?.album?.image[3]?.["#text"] : trackInfo?.album?.image[2]?.["#text"] ? trackInfo?.album?.image[2]?.["#text"] : "",
                                        name: shareState.songName || "",
                                        artist: shareState.artist || "",
                                        songFMUrl: trackInfo?.url || "",
                                        artistFMUrl: trackInfo?.artist?.url || "",
                                        albumFMUrl: trackInfo?.album.url || "",
                                        album: trackInfo?.album?.title || "",
                                        playCountFM: trackInfo?.playcount || "",
                                        songLyrics: songLyrics || "",
                                        summary: trackInfo?.wiki?.summary || "",
                                        publishedDate: trackInfo?.wiki?.published || "",
                                        tags: (trackInfo?.topTags && trackInfo?.topTags?.tag?.length >0) ? trackInfo?.topTags?.tag : []
                                      }
                                      onDataAdding({songInfo, type: Consts.Post, url: url});  
                                    }

                                  }).catch(() =>{
                                    if(_isMounted?.current){
                                      onDataAdding({type: Consts.Post, url: url});
                                    }
                                  });
                                }
                                // Get lyrics
                                  API("lyricsovh").get(`/v1/${shareState.artist?.trim()}/${shareState.songName?.trim()}`).then((res) => {
                                    if(_isMounted?.current){
                                        getSongInfo(res?.data?.lyrics?.replace(/Paroles de la chanson /, "") || "");
                                    }
                                  }).catch(() => {
                                      if(_isMounted?.current){
                                        getSongInfo("");
                                      }
                                  });

                            }else{
                              notify(`${!shareState.songName ? "Song Name" : "Artist"} field is required`,"info");
                            }
                          }else{
                            onDataAdding({type: Consts.Post, url: url});
                          }

                        }else{
                          onDataAdding({type: Consts.Post, url: url});
                        }
                      // xxxx
                      } else {
                        mutateLoadingState({key: "uploading", val:false});
                        notify("Content should be inserted", "error");
                      }
                    } else {
                      mutateLoadingState({key: "uploading", val:false});
                      notify("Caption should be between 2 and 250 characters", "error");
                    }
                } else if(method.toLowerCase() === Consts.Reel) {
                // submits reel
                    if(shareState.selectedReelGroup && (shareState.selectedReelGroup.toLowerCase() === "new group" ? shareState.newGroupName : true)){
                      if(shareState.newGroupName.toLowerCase() !== "new group"){
                          if(shareState.newGroupName?.split("").length <= 25){
                            if(receivedData?.reels && (receivedData?.reels.length > 0 ? (receivedData?.reels?.some(K => K.groupName.toLowerCase() !== shareState.newGroupName.toLowerCase())) : true)){
                                onDataAdding({type: Consts.Reel, url: url});
                            }else{
                              notify("This group name is aleady exit. Please choose another name.", "error");
                            } 
                          }else{
                            notify("Group name should not exceed 25 characters.", "error");
                          }
                      }else{
                        notify(`Can't accept the group name you entered. "New Group" is a reserved word that can't be used. Please choose another name!`, "error");
                      }
                    }else{
                      setShareState({
                        ...shareState,
                        showReelFieldErr: true
                      })
                    }
                }
                // xxxx--xxxx
              }
            })
            .catch((err) => {
              if(_isMounted?.current){
                  notify((err?.message|| `Failed to upload ${contentType}. Please try again later.`), "error");
              }
            });
      }
    );      
  }
}
  const customMarker = (props) => {
    return (
        <p className="custom__marker">My custom marker - {props.itemNumber}</p>
    );
  };
    // xxxxxx
    const isValid = (method.toLowerCase() === Consts.Post) ? shareState.caption && contentType : method.toLowerCase() === Consts.Reel? (contentType && (shareState.selectedReelGroup ||  shareState.newGroupName)) : null;
    return (
        <Fragment>
            <div id="shareMediaPhase" className="uploadPhase flex-row">
                <div className="share--media--container flex-row">
                {/* share */}
                {
                  loadingState.uploading ?
                    <div className="uploading__in__progress flex-column">
                        <h4 className="mb-3">{ shareState.progressBarPercentage <= 0 ? "Preparing..": shareState.progressBarPercentage >= 80 ?  "Finishing up... Hang tight!" : "Uploading..." }</h4>
                        <div className="my-4 w-100">
                        <Box display="flex" alignItems="center">
                            <Box width="100%" mr={1}>
                                  <LinearProgress
                                      variant="buffer"
                                      value={shareState.progressBarPercentage}
                                      valueBuffer={shareState.progressBarPercentage + 20}
                                  />
                            <Box minWidth={35}>
                              <Typography variant="body2" className="mt-3" color="textSecondary">{`${Math.round(
                                shareState.progressBarPercentage,
                              )}%`}</Typography>
                            </Box>
                          </Box>
                        </Box>
                        </div>
                    </div>
                  :
                    (contentType === Consts.Image ?
                    <div className="original--review">
                        {/* <img loading="lazy" className="unselectable" src={contentPreview || ""} alt="new post" />    */}
                        <ImageMarker
                        loading="lazy" 
                        src={contentPreview || ""}
                        markers={markers}
                        alt="new post"
                        className="unselectable"
                        markerComponent={customMarker}
                        onAddMarker={(marker) => setMarkers([...markers, {
                          name: "user",
                          ...marker
                        }])}
                        draggable="false"
                        decoding="auto"
                        />
                    </div>
                    : contentType === Consts.Video ?
                    <div className="original--review">
                        <video src={contentPreview || ""} controls controlsList="nodownload" playsInline autoPlay> </video>
                    </div>
                    : contentType === Consts.Audio ?
                    <div className="original--review">
                      <audio src={contentPreview || ""} controls controlsList="nodownload" autoPlay> </audio>
                    </div>
                    :  <h3>Not found</h3>)

                  }

                {/* end filter */}
                </div>
                <form onSubmit={(x) => onSubmitPost(x)}>
                    <div className="phase--media--right">
                    <div className="flex-row change--photo mb-3">
                        <Avatar
                          className="user__picture mr-3"
                          alt={receivedData?.userName}
                          src={receivedData?.userAvatarUrl}
                        />
                        <div>
                          <h1 className="user__prof__name">{receivedData?.userName} {receivedData?.isVerified && <span><GoVerified className="verified_icon"/></span>}</h1>
                        </div>
                      </div>
                        <div className="phase--media--choices flex-column">
                        <div id="Filter" className="option--container w-100">
                                {/* location, caption.. */}
                                {
                          method.toLowerCase() === Consts.Post ?
                        <div className="mt-2 w-100">
                                <InputForm
                                    required={true}
                                    autoFocus={true}
                                    type="textarea"
                                    name="caption"
                                    label="Enter a caption"
                                    val={shareState.caption}
                                    changeInput={onInputChange}
                                    submitted={loadState.submitted}
                                    disabled={loadingState.uploading}
                                />
                                <InputForm
                                    type="text"
                                    name="location"
                                    label="location"
                                    val={shareState.location}
                                    changeInput={onInputChange}
                                    disabled={loadingState.uploading}
                                  />
                                {
                                  (contentType && contentType === Consts.Audio) &&
                                  <>
                                  <InputForm
                                    type="text"
                                    name="artist"
                                    label="artist"
                                    val={shareState.artist}
                                    changeInput={onInputChange}
                                    submitted={loadState.submitted && (shareState.songName || shareState.artist)}
                                    disabled={loadingState.uploading}
                                  />
                                  <InputForm
                                    type="text"
                                    name="songName"
                                    label="song name"
                                    val={shareState.songName}
                                    changeInput={onInputChange}
                                    submitted={loadState.submitted && (shareState.songName || shareState.artist)}
                                    disabled={loadingState.uploading}
                                  />
                                  </>
                                }
                              {
                                !context.receivedData?.profileInfo?.professionalAcc.disableComments &&
                                <div id="input--form--field">
                                  <div className="form-group flex-column">
                                    <div className="prof--input--row  flex-row">
                                      <label htmlFor="disableComments">Turn off commenting</label>
                                      <CheckboxIOS disabled={loadingState.uploading} checked={shareState.disableComments || false} changeInput={onInputChange} id="disableComments" name="disableComments" />
                                      </div>
                                    </div>
                                  </div>
                              }
                          </div>  
                        : method?.toLowerCase() === Consts.Reel ?
                        <div className="mt-2 w-100">
                          {
                            context.receivedData?.reels?.length > 0 &&
                            <InputForm
                                  required={true}
                                  type="select"
                                  name="selectedReelGroup"
                                  label="selected group"
                                  options={[ "New Group",...context.receivedData?.reels?.map(s => s?.groupName)]}
                                  val={shareState.selectedReelGroup}
                                  changeInput={onInputChange}
                                  submitted={loadState.submitted}
                                  disabled={loadingState.uploading}
                            />
                          }  
                          {
                            ( context.receivedData?.reels?.length <= 0 || shareState.selectedReelGroup?.toLowerCase() === "new group") &&
                            <div>
                                <InputForm
                                    required={true}
                                    autoFocus={true}
                                    type="text"
                                    name="newGroupName"
                                    label="Group Name"
                                    val={shareState.newGroupName}
                                    changeInput={onInputChange}
                                    submitted={loadState.submitted}
                                    disabled={loadingState.uploading}
                              /> 
                            
                            </div>
                          }
                          {
                            shareState.showReelFieldErr && shareState.selectedReelGroup?.toLowerCase() === "new group" && <small  className="text-align-center text-danger">Field above is required</small>
                          } 
                        </div>
                        :null  
                        }
                                {/* xxxxx */}
                        </div>
                        </div>
                        <span className="phase__media__next_btn mt-4">
                      <Button disabled={!isValid || loadingState.uploading} className={`share--btn profile__btn ${(!isValid || loadingState.uploading) && "disabled"}`} type="submit" value="Post" > {loadingState.uploading ? "Uploading..." : "Share"}</Button> 
                        </span>
                    </div>
                </form>
            </div>
        </Fragment>
    )
}
ShareMediaPhase.propTypes = {
  contentType: PropTypes.string.isRequired,
  contentPreview: PropTypes.string.isRequired,
  method: PropTypes.string.isRequired,
  context: PropTypes.object.isRequired,
  uploadedItem: PropTypes.object.isRequired
}
export default memo(ShareMediaPhase);