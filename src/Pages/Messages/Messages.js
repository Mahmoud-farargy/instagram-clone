import React, { useEffect, useState, useContext, useRef, lazy, Suspense, memo} from "react";
import Auxiliary from "../../Components/HOC/Auxiliary";
import { AppContext } from "../../Context";
import { Avatar } from "@material-ui/core";
import { BsPencilSquare } from "react-icons/bs";
import { FiSend, FiInfo, FiEye } from "react-icons/fi";
import { RiMenu4Fill } from "react-icons/ri";
import { TiMessageTyping } from "react-icons/ti";
import { MdClose } from "react-icons/md";
import PropTypes from "prop-types";
import { withBrowseUser } from "../../Components/HOC/withBrowseUser";
import ChatLogList from "./ChatLogList/ChatLogList";
import { AiOutlinePicture } from "react-icons/ai";
import { FaRegHeart } from "react-icons/fa";
import { storage, database, firebase } from "../../Config/firebase";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { GoVerified } from "react-icons/go";
import { withRouter } from 'react-router-dom';
import Loader from "react-loader-spinner";
import LoadingScreen from "../../Components/Generic/LoadingScreen/LoadingScreen";
import { trimText } from "../../Utilities/TrimText";
import { insertIntoText } from "../../Utilities/InsertIntoText";
import NewMsgModal from "../../Components/NewMsgModal/NewMsgModal";
import FollowUnfollowBtn from "../../Components/FollowUnfollowBtn/FollowUnfollowBtn";
import MSGUsers from "./Users/Users";
import { retry } from "../../Utilities/RetryImport";
import { connect } from "react-redux";
import * as Consts from "../../Utilities/Consts";
import * as actionTypes from "../../Store/actions/actions";

const EmojiPicker = lazy(() => retry(() => import("../../Components/Generic/EmojiPicker/EmojiPicker")));
const OptionsModal = lazy(() => retry(() => import("../../Components/Generic/OptionsModal/OptionsModal")));

const Messages = (props) => {
    const { location, history, changeModalState, modalsState} = props;
    // refs
    const autoScroll = useRef(null);
    const fileUploadEl = useRef(null);
    const _isMounted = useRef(true);
    const timeouts = useRef(null);
    const inputRef = useRef(null);
    // end refs
    const context = useContext(AppContext);
    const [isSending, setSendingState] = useState(false);
    const [compState, setCompState] = useState({
        inputValue: "",
        loadedChatLog: [],
        openSidedrawer: false,
        loading: {uid: "", state: false, progress: 0}
    })
  const [userInfo, setUserInfo] = useState({
    last_changed:0,
    state: "offline",
    typingTo: "",
    viewing: "",
  });
  const { handleSendingMessage, receivedData, currentChat, changeMainState, notify, deleteChat, handleUserBlocking, confirmPrompt } = context;
  const { messages } = receivedData;
  const currUser = receivedData?.messages[currentChat.index];
  const unreadedMessagesCount = receivedData?.messages?.filter(user => user?.notification)?.length;
  const msg = messages ? messages[currentChat.index] : [];

  const updateRealTimeData = (objName, newVal) => {
    const refToDatabase = database.ref("/status/" + receivedData?.uid);
    const objectToSubmit = {
      [objName]: newVal
    }
    refToDatabase.update(objectToSubmit);
  }
  useEffect(() =>{
    //if index is not correct then correct it
    if(receivedData?.messages.length >0 && _isMounted){

        const makeADefaultSelection = () => {
            const firstUserUid = receivedData?.messages?.filter(el => !receivedData?.blockList?.some(k => k.blockedUid === el.uid))[0]?.uid;
            const pickFirstContent = receivedData?.messages?.map(user => user.uid).indexOf(firstUserUid);
            if(pickFirstContent !== -1){
              timeouts.current = setTimeout(() => {
                  changeMainState("currentChat", { uid: firstUserUid,index: pickFirstContent });
                  window.clearTimeout(timeouts?.current);
              },300);
            }
          }
          if(currentChat.uid){
            const checkIndex = receivedData?.messages?.map(user =>  user.uid).indexOf(currentChat.uid);
            if(checkIndex !== currentChat.index){
              changeMainState("currentChat", {...currentChat,index: checkIndex});
            }
          }else{
            makeADefaultSelection();
          }
    }
    return () => {
      fileUploadEl.current =false;
      autoScroll.current = false;
      window.clearTimeout(timeouts?.current);
      _isMounted.current = false;
      updateRealTimeData("viewing", "");
    }
  },[]);
  useEffect(() => {
    var unsubscribe = firebase.database().ref(`/status/${msg?.uid}`).on('value', snapshot =>{
        setUserInfo(snapshot?.val());
    });
    return () => typeof unsubscribe === "function" && unsubscribe();
  },[msg, currentChat]);
  useEffect(() => {
    if(location.pathname === "/messages"){
      // autoScroll && autoScroll.current && autoScroll.current?.scrollIntoView && autoScroll.current.scrollIntoView({block: "end", behavoir:"smooth"});
      if( (window.innerWidth || document.documentElement.clientWidth) >= 670 ){
        document.body.style.overflow = "hidden";
      }else{
        document.body.style.overflow = "visible";
      }
    }
    return () => {
       document.body.style.overflow = "visible";
    }
  }, [location, _isMounted]);

  useEffect(() =>{
    if(_isMounted?.current){
        autoScroll && autoScroll.current && autoScroll.current?.scrollIntoView && autoScroll.current.scrollIntoView({block: "end"});
        setCompState({
          ...compState,
          loadedChatLog: messages[currentChat.index],
          openSidedrawer: false,
        });
        updateRealTimeData("viewing", msg?.uid ? msg?.uid : "");
    }
    changeMainState("currentPage", `${ (unreadedMessagesCount && unreadedMessagesCount > 0) ? `(${unreadedMessagesCount}) `: ''} Messages`);
  },[messages, currentChat, compState.loading.state, _isMounted, userInfo]);
  useEffect(() => {
    compState.inputValue && setCompState({...compState, inputValue: ""});
  }, [currUser?.uid]);
  const submitMessage = (v) => {
    v.preventDefault();
    if(compState?.inputValue){
        setSendingState(true);
        handleSendingMessage({content:compState.inputValue, uid: currUser?.uid, type: "text", pathname: ""}).then(() => {
          _isMounted.current && setSendingState(false);
        }).catch(() => {
          _isMounted.current && setSendingState(false);
        }); 
        setCompState({
          ...compState,
          inputValue: ""
        });
        (inputRef && inputRef?.current) && inputRef.current.blur();
    }
  }


  const selectEmoji = (e, x) => {
    e.persist();
    setCompState({
      ...compState,
      inputValue: insertIntoText(compState?.inputValue, x.emoji)
    })
  }
  const onMessageAction = (type) => {
    if(type === "content"){
      if(_isMounted?.current && fileUploadEl?.current){
          fileUploadEl.current && fileUploadEl.current.click();
      }
    }else if(type === "like") {
      setSendingState(true);
      handleSendingMessage({content: "", uid: currUser?.uid, type: "like", pathname: ""}).then(() => {
        _isMounted.current && setSendingState(false);
      }).catch(() => {
        _isMounted.current && setSendingState(false);
      });
    }
  }

    const onPickingContent = (event) => {
      if(event && event.target.files[0]){
            let uploadedItem = event.target.files[0];
            const fileName = `${Math.random()}${uploadedItem?.name}`;
            const metadata = {
              contentType: uploadedItem !== "" ? uploadedItem?.type : "",
            }
          const itemType = /image/g.test(metadata.contentType) ? "picture" : /video/g.test(metadata.contentType) ? "video": /audio/g.test(metadata.contentType) ? "audio" : "document";
          if (
            /(image|video|audio|pdf|plain)/g.test(metadata.contentType)
          ) {
            if(uploadedItem.size <= 12378523){

                if (uploadedItem.name.split("").length < 300) {
                  const uploadContent = storage
                    .ref(`messages/${receivedData?.uid}/${fileName}`)
                    .put(uploadedItem, metadata);
                  uploadContent.on(
                    "state_changed",
                    (snapshot) => {
                      //Progress function ..
                      const progress =
                        Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        setCompState({...compState,loading: {uid: currUser?.uid,state:true, progress: progress }});
                    },
                    (error) => {
                      setCompState({...compState,loading: { uid: "",state:false, progress: 0 }});
                      notify((error?.message || `Failed to send ${itemType}. Please try again later.`), "error");
                    },
                    () => {
                      // Complete function..
                      storage
                        .ref(`messages/${receivedData?.uid}`)
                        .child(fileName)
                        .getDownloadURL()
                        .then((url) => {
                          if(_isMounted?.current){
                            //post content on db
                            setCompState({...compState,loading: { uid: "",state:false, progress: 0 }});
                            setSendingState(true);
                            handleSendingMessage({content: url,uid: currUser?.uid,type: itemType, pathname: fileName }).then(() => {
                              _isMounted.current && setSendingState(false);
                            }).catch(() => {
                              _isMounted.current && setSendingState(false);
                            });
                            uploadedItem = "";
                          }
                        })
                        .catch((err) => {
                          if(_isMounted?.current){
                            setCompState({...compState,loading: { uid: "",state:false, progress: 0 }});
                            notify((err?.message|| `Failed to upload ${itemType}. Please try again later.`), "error");
                          }
                        });
                    }
                  );
                } else {
                  notify(
                    `The name of the ${itemType} is too long. it should not exceed 250 characters`,
                    "info"
                  );
                }
            }else{
              notify(
                `The ${itemType} must not exceed the size of 12MB.`,
                "info"
              );
            }

          } else {
            notify(
              "Only images, videos, audio, txts, and pdfs are accepted.",
              "info"
            );
          }
      }
        
    }
    const blockUser = (blockedUid, userName, userAvatarUrl, profileName) => {
      handleUserBlocking(true, blockedUid || "", userName || "", userAvatarUrl || "", profileName || "").then(() => _isMounted?.current && history.push("/"));
    }
    
    const openNewMsg = () => {
      changeModalState("newMsg", true);
      setCompState({...compState, openSidedrawer: false });
    }
    
    const block = (uid, userName, avatarUrl, name) => {
      const buttons = [
        {
          label: "No",
        },
        {
          label: "Yes",
          onClick: () => {
            blockUser(uid, userName, avatarUrl, name);
           }
          }]
      confirmPrompt(
        "Confirmation",
        buttons,
        `Block ${userName}?`
      );
    }
    const delChat = () => {
      deleteChat(currUser?.uid).then(() => {
        if(_isMounted?.current){
          const secondUserUid = receivedData?.messages?.filter(el => !receivedData?.blockList?.some(k => k.blockedUid === el.uid))[1]?.uid;
          const pickFirstContent = receivedData?.messages?.map(user => user.uid).indexOf(secondUserUid);
          if(pickFirstContent !== -1){
            timeouts.current = setTimeout(() => {
              if(_isMounted.current){
                changeMainState("currentChat", { uid: secondUserUid,index: 0 });
                window.clearTimeout(timeouts.current);
              }
            },300);
          }
        }
      });
    }
    const typing = (state) => {
      updateRealTimeData("typingTo",  state ? msg?.uid : "");
    }
    return (
      <Auxiliary>
        {/* modals */}
        <Suspense fallback={<LoadingScreen />}>
          {modalsState?.options ? (
              <OptionsModal>
              <span className="text-danger font-weight-bold" onClick={() => delChat()}>Delete Chat</span>
              <span className="p-0">
                <FollowUnfollowBtn shape="quaternary" userData={{userId: currUser?.uid, uName: currUser?.userName, uAvatarUrl: currUser?.userAvatarUrl, isVerified: currUser?.isVerified}} />
              </span>
              <span className="text-danger font-weight-bold" onClick={() => block(currUser?.uid, currUser?.userName, currUser?.userAvatarUrl, currUser?.profileInfo?.name)}>Block this user</span>
              <span>Cancel</span>
              </OptionsModal>
            ): modalsState?.newMsg ?
            <NewMsgModal />
            : null
          }
            
      </Suspense>
        <section id="messages" className="messages--container">
          <input id="contentUploader" type ="file" name="contentUploader" accept={['image/*','video/*','audio/*','application/pdf','text/plain']} ref={fileUploadEl} onChange={(x) => onPickingContent(x)} />
          <div className="desktop-comp messages--main--container">
            <div className="messages--desktop--card flex-row">
              {/* users side */}
              <div className="messages--users--side desktop-only flex-column">
                <div className="users--side--header flex-row">
                  <span className="space__between">
                    <h4>Direct</h4>
                    <BsPencilSquare onClick={() => openNewMsg()} className="pen__logo" />
                  </span>
                </div>
                <div className="messages--top--nav flex-row">
                  <div className="space__between">
                    <h5>private</h5>
                    <h5 className="disabled">general</h5>
                  </div>
                </div>
                <div className="messages--view--users">
                  <MSGUsers
                  messages={receivedData?.messages || []}
                  uid={receivedData?.uid}
                  blockList={receivedData.blockList}
                  isSending={isSending}
                   />
                </div>
              </div>
              {/* messages side */}
              <div className="messages--side">
                <div className="mobile--msgs--menu mobile-only">
                  {!compState.openSidedrawer ? (
                    <RiMenu4Fill
                      onClick={() => {setCompState({...compState, openSidedrawer: true }); changeModalState("options", false);}}
                    />
                  ) : (
                    <MdClose
                      onClick={() => setCompState({...compState, openSidedrawer: false })}
                    />
                  )}
                </div>
                {compState.openSidedrawer ? (
                  <>
                  <div
                    className="backdrop mobile-only"
                    onClick={() => setCompState({...compState, openSidedrawer: false })}
                  ></div>
                                  <div
                  style={{
                    transform: compState.openSidedrawer
                      ? "translate(0)"
                      : "translate(90vw)",
                    transition: "all 0.5s linear",
                    opacity: compState.openSidedrawer ? "1" : "0",
                  }}
                  id="mobileChat"
                  className="mobile--users--sidedrawer"
                >
                  {" "}
                  {/*mobile */}
                  <div className="messages--users--side mobile-only flex-column">
                    <div className="pen__logo__container flex-row" ><BsPencilSquare onClick={() => openNewMsg()} className="pen__logo" /></div>
                    <div className="messages--top--nav flex-row">
                      <div className="space__between">
                        <h5>private</h5>
                        <h5 className="disabled">general</h5>
                      </div>
                    </div>
                    <div className="messages--view--users">
                      <MSGUsers
                       messages={receivedData?.messages || []}
                       uid={receivedData?.uid}
                       blockList={receivedData.blockList}
                       isSending={isSending}
                      />
                    </div>
                  </div>
                </div>
                  </>
                ) : null}

                {(compState.loadedChatLog < 1 || messages.length <= 0 ) ? (
                  <div className="messages--empty--container flex-column">
                    {/* if there is no messages */}{" "}
                    <div className="messages--side--inner flex-column">
                      <div>
                        <FiSend className="messages__send__logo" />
                      </div>
                      <h3>Your Messages</h3>
                      <p>
                        Send private photos and messages to a friend or group.
                      </p>
                      <button onClick={() => openNewMsg()}>Send message</button>
                    </div>
                  </div>
                ) : !receivedData?.blockList?.some(el => el?.blockedUid === currentChat.uid) ? (
                  <div className="messages--chatlog--container">
                    <div className="messages--chatbox--header flex-row">
                      {/* -- header */}
                      <div className="flex-row">
                        <Avatar loading="lazy" src={msg?.userAvatarUrl} alt={msg?.userName} />
                        <div className="messages--user--info space__between">
                          <p style={{cursor:"pointer"}} onClick={() => props.browseUser(msg?.uid, msg?.userName)}>
                             {trimText(msg?.userName, 17)}
                             { msg?.isVerified && <span><GoVerified className="verified_icon"/></span>}
                             {
                               userInfo?.viewing === receivedData?.uid &&
                               <span className="user_on_chat"><FiEye /></span>
                             }
                          </p>

                        </div>
                      </div>
                      <div onClick={() => changeModalState("options", true)} style={{fontSize: "22px"}} className="msg--info--btn desktop-only">
                          <FiInfo />
                      </div>
                      {/* -- */}
                    </div>
                    <div className="messages--chatbox--body fadeEffect" >
                      <ChatLogList
                        isSending={isSending}
                        chatLog={msg?.chatLog}
                        messagerUid={msg?.uid}
                        receivedData={receivedData}
                        openSidedrawer={compState.openSidedrawer}
                       />
                      {
                        userInfo?.typingTo === receivedData?.uid &&
                        <div className="user--typing--row flex-row fadeEffect">
                          <Avatar loading="lazy" src={msg?.userAvatarUrl} className="messsage--sender--img" alt={msg?.userName} />
                          <span className="user_typing flex-row">
                            <TiMessageTyping className="user__typing__icon" />
                            <h5>Typing...</h5>
                          </span>
                        </div>
                      }
                     {
                      compState.loading.state && currUser?.uid === compState.loading.uid &&
                       <div className="loading--message--container flex-row">
                         <div className="loading--message--inner flex-column">
                         <Loader
                            className="loading--message--anim"
                            type="TailSpin"
                            color="var(--white)"
                            height={60}
                            width={60}
                            arialLabel="loading-indicator"
                            timeout={100000}
                          /> 
                          <h5 className="mt-3">{compState?.loading?.progress}%</h5>
                          <p>Sending..</p>
                         </div>
                       </div>
                     }
                      <span ref={autoScroll}></span>
                    </div>

                    <div className="messages--bottom--form flex-row">
                        <form
                          onSubmit={(v) => submitMessage(v)}
                          className="flex-row"
                        >
                          <div className="form--input--container flex-row">
                              <div className="form--input--container--inner flex-row">
                                <EmojiPicker onEmojiClick={selectEmoji} />
                                  <input
                                    ref={inputRef}
                                    onChange={(e) =>
                                      setCompState({...compState, inputValue: e.target.value })
                                    }
                                    value={compState.inputValue}
                                    className="message__input"
                                    placeholder="Message..."
                                    onFocus={() => typing(true)}
                                    onBlur={() => typing(false)}
                                    spellCheck="true"
                                  />
                                </div>
                            </div>
                              {compState.inputValue ? (
                                <input type="submit" value="Send" className={`${(!compState.inputValue || isSending) && "disabled"}`} disabled={(!compState.inputValue || isSending)} />
                              )
                              : isSending ? 
                                <Loader
                                  type="TailSpin"
                                  color="#0095f6"
                                  arialLabel="loading-indicator"
                                  height={23}
                                  width={23}
                                />
                              : 
                              <div className="message--mini--toolbox flex-row">
                                <AiOutlinePicture onClick={() => onMessageAction("content")} className="message--pic--ico" />
                                <FaRegHeart onClick={() => onMessageAction("like")} data-cy="heart_emoji" className="message--heart--ico"/> 
                                <HiOutlineDotsHorizontal onClick={() => changeModalState("options", true)} className="mobile-only message--heart--ico" />
                              </div>
                              }
                        </form>
                    </div>
                  </div>
                ) :
                <h2 className="text-center">Not available</h2>
              }
              </div>
            </div>
          </div>
        </section>
      </Auxiliary>
    );
}
Messages.propTypes = {
  browseUser: PropTypes.func.isRequired,
  location: PropTypes.object,
  history: PropTypes.object,
  changeModalState: PropTypes.func.isRequired
}
const mapDispatchToProps = dispatch => {
  return {
      changeModalState: (modalType, hasDataList, usersList, usersType) => dispatch({type: actionTypes.CHANGE_MODAL_STATE, payload: {modalType, hasDataList, usersList, usersType}})
  }
}
const mapStateToProps = state => {
  return {
      modalsState: state[Consts.reducers.MODALS].modalsState
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(withBrowseUser(withRouter(memo(Messages))));
