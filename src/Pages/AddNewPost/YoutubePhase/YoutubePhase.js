import React, { useState, useContext, useEffect, useRef } from "react";
import YouTube from 'react-youtube';
import { AppContext } from "../../../Context";
import InputForm from "../../../Components/Generic/InpuForm/InputForm";
import { useHistory } from "react-router-dom";
import * as Consts from "../../../Utilities/Consts";
import { debounce } from "../../../Utilities/Debounce";
import API from "../../../Config/API";
import Loader from "react-loader-spinner";
import { FaYoutube } from "react-icons/fa";
import "./YoutubePhase.scss";

const YoutubePhase = () => {
    const history = useHistory();
    const timeIntervalId = useRef(null);
    const _isMounted = useRef(true);
    const { notify, generateNewId, receivedData, uid, addPost } = useContext(AppContext);
    const [doesVidExist, setVidExistingState] = useState(false);
    const [YTID, setYTID] = useState("");
    const [formState, setFormState] = useState({
        youtubeUrl: "",
        vidThumbnail: "",
        caption: "",
        isSubmitted: false,
        isLoading: false,
        vidChecking: false
    });
    useEffect(() => () => _isMounted.current = false, []);
    const onSubmission = (w) => {
        w.preventDefault();
        setFormState({
            ...formState,
            isSubmitted: true,
            isLoading: true
        })
        if (formState.youtubeUrl && YTID) {
            setFormState({ ...formState, isLoading: true });
            const addedPost = {
                caption: formState.caption || "",
                id: generateNewId(),
                contentType: Consts.YoutubeVid,
                contentURL: "",
                youtubeData: { id: YTID, thumbnail: formState.vidThumbnail },
                comments: [],
                date: new Date(),
                likes: { people: [] },
                userName: receivedData?.userName,
                location: "",
                postOwnerId: uid,
                userAvatarUrl: receivedData?.userAvatarUrl,
                contentName: false,
                songInfo: {},
                disableComments: false
            }
            addPost(addedPost, Consts.Post).then(() => {
                if (_isMounted.current) {
                    notify("YouTube video has been posted");
                    setFormState(
                        {
                            ...formState,
                            youtubeUrl: "",
                            caption: "",
                            isSubmitted: false,
                            isLoading: false,
                            vidChecking: false
                        });
                    history.push("/");
                }
            }).catch(() => {
                if (_isMounted.current) {
                    setFormState({ ...formState, isLoading: false });
                    notify("Failed to post a YouTube video. Please try again later!", "error");
                }
            });
        } else {
            notify("The URL is required", "error");
        }
    }
    function youtubeParser(url) {
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        var match = url.match(regExp);
        return (match && match[7].length === 11) ? match[7] : "";
    }
    function ytVidId(url) {
        return /((http|https):\/\/)?(www\.)?(youtube\.com|youtu\.be)(\/)?([a-zA-Z0-9\-.]+)\/?/.test(url);
    }
    useEffect(() => {
        if (formState.youtubeUrl !== "" && ytVidId(formState.youtubeUrl)) {
            (debounce(function () {
                const vidId = youtubeParser(formState.youtubeUrl);
                setYTID(vidId);
                setFormState({
                    ...formState,
                    vidChecking: true
                })
                API().get(`https://www.youtube.com/oembed?url=http://www.youtube.com/watch?v=${vidId}&format=json`).then((res) => {
                    if(_isMounted.current){
                        if (res.data) {
                            const { thumbnail_url = "" } = res.data;
                            setVidExistingState(true);
                            setFormState({
                                ...formState,
                                vidChecking: false,
                                vidThumbnail: thumbnail_url
                            })
                        } else {
                            setVidExistingState(false);
                            setFormState({
                                ...formState,
                                vidChecking: false
                            })
                        }
                    }
                }).catch(() => {
                    if(_isMounted.current){
                        setVidExistingState(false);
                        setFormState({
                            ...formState,
                            vidChecking: false
                        })
                    }
                });
            }, 1400, timeIntervalId, false))();
        }
    }, [formState.youtubeUrl]);

    const onInputChange = (val, name) => {
        if (name && typeof val !== "undefined") {
            setFormState({
                ...formState,
                [name]: val
            });
        }
    }

    const YTSettings = {
        height: '340',
        width: '240',
        playerVars: {
            autoplay: 1,
            color: "#0095f6",
            playsinline: 1,
            modestbranding: 1,
        },
    };
    return (
        <div id="youtubePhase">
            <div className="youtube--phase--inner flex-row">
                <div className="youtube--preview">
                    {
                        formState.vidChecking ?
                            <div className="checking--video">
                                <Loader
                                    type="ThreeDots"
                                    color="var(--white)"
                                    arialLabel="loading-indicator"
                                    height={30}
                                    width={30} />
                            </div>
                            :
                            (doesVidExist && formState.youtubeUrl && YTID) ?
                                <YouTube
                                    videoId={YTID}
                                    id="YTVideo"
                                    title="Youtube Preview"
                                    opts={YTSettings} />
                            :
                            <FaYoutube className="youtube__idle__icon"/>

                    }
                </div>
                <div className="youtube--form--container">
                    <form onSubmit={(w) => onSubmission(w)}>
                        <InputForm
                            type="text"
                            inputType="url"
                            name="youtubeUrl"
                            label={`YouTube URL`}
                            autoFocus={true}
                            changeInput={onInputChange}
                            submitted={formState.isSubmitted}
                            required={true}
                            val={formState.youtubeUrl}
                            maxLength={150}
                            extraText={
                                <small>
                                    You can copy and paste a YouTube URL here.
                                </small>
                              }
                        />
                        <InputForm
                            type="textarea"
                            inputType="url"
                            name="caption"
                            label={`Caption`}
                            changeInput={onInputChange}
                            submitted={formState.isSubmitted}
                            required={false}
                            val={formState.caption}
                            maxLength={150}
                        />
                        <input type="submit" disabled={(!formState.youtubeUrl || formState.vidChecking || !doesVidExist || formState.isLoading)} className={`${(!formState.youtubeUrl || formState.vidChecking || !doesVidExist || formState.isLoading) ? "disabled" : ""} profile__btn primary__btn`} value={formState.isLoading ? "Publishing..." : "Publish"} />
                    </form>
                </div>

            </div>
        </div>
    )
}

export default YoutubePhase;