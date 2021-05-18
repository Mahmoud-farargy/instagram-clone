import React, { useEffect, useState, useContext, useRef, lazy, Suspense} from "react";
import Auxiliary from "../../Components/HOC/Auxiliary";
import { AppContext } from "../../Context";
import { Avatar } from "@material-ui/core";
import { BsPencilSquare, BsFillCameraVideoFill } from "react-icons/bs";
import TruncateMarkup from "react-truncate";
import { FiSend, FiInfo } from "react-icons/fi";
import { RiMenu4Fill } from "react-icons/ri";
import { MdClose, MdAudiotrack } from "react-icons/md";
import PropTypes from "prop-types";
import { withBrowseUser } from "../../Components/HOC/withBrowseUser";
import GetFormattedDate from "../../Utilities/FormatDate";
import Message from "./Message/Message";
import { AiOutlinePicture,  AiOutlineMessage } from "react-icons/ai";
import { FaRegHeart } from "react-icons/fa";
import { storage } from "../../Config/firebase";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FcLike } from "react-icons/fc";
import { GoVerified } from "react-icons/go";
import { CgFileDocument } from "react-icons/cg";
import { withRouter } from 'react-router-dom';
import Loader from "react-loader-spinner";
import LoadingScreen from "../../Components/Generic/LoadingScreen/LoadingScreen";
import { trimText } from "../../Utilities/TrimText";
import { insertIntoText } from "../../Utilities/InsertIntoText";
import NewMsgModal from "../../Components/NewMsgModal/NewMsgModal";
const EmojiPicker = lazy(() =>  import("../../Components/Generic/EmojiPicker/EmojiPicker"));
const OptionsModal = lazy(() => import("../../Components/Generic/OptionsModal/OptionsModal"));

const Messages = (props) => {
    const { location, history } = props;
    const autoScroll = useRef(null);
    const fileUploadEl = useRef(null);
    const _isMounted = useRef(true);
    const context = useContext(AppContext);
    const [compState, setCompState] = useState({
        inputValue: "",
        loadedChatLog: [],
        openSidedrawer: false,
        loading: {uid: "", state: false, progress: 0}
    })
  const { handleSendingMessage, receivedData, currentChat, changeMainState, notify, modalsState, changeModalState, deleteChat, handleUserBlocking, handleFollowing, confirmPrompt, closeNewMsgNoti } = context;
  const { messages } = receivedData;
  const currUser = receivedData?.messages[currentChat.index];
  const isFollowed = receivedData?.following && receivedData?.following?.length > 0 &&
  receivedData?.following?.some(
    (el) => el?.receiverUid === currentChat.uid
  );
  // const isBlocked = 
  useEffect(() =>{
    //if index is not correct then correct it
    if(receivedData?.messages.length >0 ){
        const makeADefaultSelection = () => {
            const firstUserUid = receivedData?.messages?.filter(el => !receivedData?.blockList?.some(k => k.blockedUid === el.uid))[0]?.uid;
            const pickFirstContent = receivedData?.messages?.map(user => user.uid).indexOf(firstUserUid);
            if(pickFirstContent !== -1){
              const timeout = setTimeout(() => {
                  changeMainState("currentChat", { uid: firstUserUid,index: pickFirstContent });
                  clearTimeout(timeout);
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
    window.scrollTo(0,0);
    changeMainState("currentPage", "Messages");
    return () => {
      _isMounted.current = false;
      fileUploadEl.current =false;
      autoScroll.current = false;
    }
  },[]);
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
    if(_isMounted){
        autoScroll && autoScroll.current && autoScroll.current?.scrollIntoView && autoScroll.current.scrollIntoView({block: "end"});
        setCompState({
          ...compState,
          loadedChatLog: messages[currentChat.index],
          openSidedrawer: false,
        });
    }
  },[messages, currentChat, compState.loading.state, _isMounted]);
  const submitMessage = (v) => {
    v.preventDefault();
    if(compState?.inputValue){
        handleSendingMessage({content:compState.inputValue, uid: currUser?.uid, type: "text", pathname: ""});  
        setCompState({
          ...compState,
          inputValue: "",
        });
    }

  }

 const viewUsersMessages = (loadedUid, loadedIndex) => {
    const checkIndex = receivedData?.messages?.map(user => user.uid ).indexOf(loadedUid);
    if(checkIndex === loadedIndex && checkIndex !== -1){
       changeMainState("currentChat", { uid: loadedUid ,index: loadedIndex});
       if(receivedData?.messages?.[checkIndex]?.notification){
          closeNewMsgNoti(loadedUid);
       }
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
      if(_isMounted && fileUploadEl?.current){
          fileUploadEl.current && fileUploadEl.current.click();
      }
    }else if(type === "like") {
      handleSendingMessage({content: "", uid: currUser?.uid, type: "like", pathname: ""});
    }
  }
    const msg = messages ? messages[currentChat.index] : [];

    const onPickingContent = (event) => {
      if(event){
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
                      notify((error?.message || `Failed to send ${itemType}. Please try again later.`), "error");
                    },
                    () => {
                      // Complete function..
                      storage
                        .ref(`messages/${receivedData?.uid}`)
                        .child(fileName)
                        .getDownloadURL()
                        .then((url) => {
                          //post content on db
                        setCompState({...compState,loading: { uid: "",state:false, progress: 0 }});
                          handleSendingMessage({content: url,uid: currUser?.uid,type: itemType, pathname: fileName });
                          uploadedItem = "";
                        })
                        .catch((err) => {
                          notify((err.message|| `Failed to upload ${itemType}. Please try again later.`), "error");
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
                `${itemType} does not exceed the size of 12MB.`,
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
      handleUserBlocking(true, blockedUid || "", userName || "", userAvatarUrl || "", profileName || "").then(() => history.push("/"));
    }
    const messagedUsers = (
      <ul id="messagesUL">
                    {messages?.length >= 1 ? (
                      messages
                        // ?.sort(
                        //   (a, b) =>
                        //     new Date(
                        //       b.chatLog &&
                        //         b.chatLog[b.chatLog?.length - 1]?.date
                        //           ?.seconds * 1000
                        //     ) -
                        //     new Date(
                        //       a.chatLog &&
                        //         a.chatLog[a.chatLog?.length - 1]?.date
                        //           ?.seconds * 1000
                        //     )
                        // )
                        .map((user, index) => {
                          return (
                            //Desktop
                            <div key={user?.uid + index}>
                            {
                              !receivedData?.blockList?.some(el => el?.blockedUid === user?.uid) &&
                                <li
                                  className={`messages--user like__icon__item flex-row ${index === currentChat.index && "active-msg"}`}
                                  
                                  onClick={() => viewUsersMessages(user?.uid, index)}
                                >
                                { user?.notification && <div className="like__noti__dot"></div>}
                                <Avatar loading="lazy" src={user?.userAvatarUrl} alt={user?.userName} title={user?.userName}/>
                                  <div className="messages--user--info space__between">
                                    <div style={{ flex: 1, width: "60%" }}>
                                      <p>
                                        <TruncateMarkup line={1} ellipsis="..">
                                          {user?.userName}
                                        </TruncateMarkup>{" "}
                                      </p>
                                      <span className="last__message">
                                      
                                      {
                                        user?.chatLog?.[user.chatLog?.length - 1]?.type === "text" ?
                                        <TruncateMarkup line={1} ellipsis=".." style={{textTransform:"none"}}>
                                            {user?.chatLog?.length >= 1
                                              ? user?.chatLog?.[user.chatLog?.length - 1]
                                                  .textMsg
                                              : null}
                                          </TruncateMarkup>
                                          : user?.chatLog?.[user.chatLog?.length - 1]?.type === "picture" ?
                                          <span>
                                              <AiOutlinePicture />
                                          </span>
                                          : user?.chatLog?.[user.chatLog?.length - 1]?.type === "video" ?
                                          <span>
                                            <BsFillCameraVideoFill />
                                          </span>
                                          : user?.chatLog?.[user.chatLog?.length - 1]?.type === "like" ?
                                          <span>
                                            <FcLike />
                                          </span>
                                          : user?.chatLog?.[user.chatLog?.length - 1]?.type === "audio" ?
                                          <span>
                                            <MdAudiotrack />
                                          </span>
                                          : user?.chatLog?.[user.chatLog?.length - 1]?.type === "document" ?
                                          <span>
                                            <CgFileDocument />
                                          </span>
                                          : <span>Empty message</span>
                                      } 
                                      </span>
                                    </div>
                                    <p className="messages__user__date">                             
                                      {user?.chatLog?.length >= 1
                                        ? <span><span className="messages__user__date__divider">• </span><GetFormattedDate date={user?.chatLog[user.chatLog?.length - 1].date.seconds} /></span> : null}
                                    </p>
                                  </div>
                                </li>
                            }   
                            </div>
                            
                          );
                        })
                    ) : (
                      <div className="empty--chat--box">
                        <div className="empty--card">
                          <AiOutlineMessage />
                          <h2>People who you message</h2>
                            <h4>Start messaging people from the pen button above. Users
                          will be here</h4>
                        </div>                        
                      </div>

                    )}
                  </ul>
    )
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
        const secondUserUid = receivedData?.messages?.filter(el => !receivedData?.blockList?.some(k => k.blockedUid === el.uid))[1]?.uid;
        const pickFirstContent = receivedData?.messages?.map(user => user.uid).indexOf(secondUserUid);
        if(pickFirstContent !== -1){
          const timeout = setTimeout(() => {
              changeMainState("currentChat", { uid: secondUserUid,index: 0 });
              clearTimeout(timeout);
          },300);
        }
      });
    }
    return (
      <Auxiliary>
        {/* modals */}
        <Suspense fallback={<LoadingScreen />}>
          {modalsState?.options ? (
              <OptionsModal>
              <span className="text-danger font-weight-bold" onClick={() => delChat()}>Delete Chat</span>
              <span className={`font-weight-bold ${isFollowed ? "text-danger" : "text-primary"}`} onClick={() => { currUser?.uid && handleFollowing(
                          isFollowed,
                          currUser?.uid,
                          currUser?.userName,
                          currUser?.userAvatarUrl,
                          receivedData?.uid, //these data is already available in context (refactor if possible)
                          receivedData?.userName,
              receivedData?.userAvatarUrl)}}>{isFollowed ? "Unfollow" : "Follow"}</span>
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
          <div className="desktop-comp messages--main--container flex-column">
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
                  {messagedUsers}
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
                  <div
                    className="backdrop mobile-only"
                    onClick={() => setCompState({...compState, openSidedrawer: false })}
                  ></div>
                ) : null}

                <div
                  style={{
                    transform: compState.openSidedrawer
                      ? "translate(0)"
                      : "translate(150vw)",
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
                      {messagedUsers}
                    </div>
                  </div>
                </div>

                {(compState.loadedChatLog < 1 || messages.length <= 0 ) ? (
                  <div className="messages--empty--container flex-column">
                    {/* if there is no messages */}{" "}
                    {/* when loading them */}
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
                             {trimText(msg?.userName, 70)}
                             { msg?.isVerified && <span><GoVerified className="verified_icon"/></span>}
                          </p>

                        </div>
                      </div>
                      <div onClick={() => changeModalState("options", true)} style={{fontSize: "22px"}} className="msg--info--btn desktop-only">
                          <FiInfo />
                      </div>
                      {/* -- */}
                    </div>
                    <div className="messages--chatbox--body" >
                      {msg?.chatLog?.map((message, index) => {
                        return (
                          <Message key={message?.uid + index} user={{ uid: msg?.uid }} openSidedrawer={compState.openSidedrawer} receivedData={receivedData} message={message} index={index} />
                        );
                      })}
                     {
                      compState.loading.state && currUser?.uid === compState.loading.uid &&
                       <div className="loading--message--container flex-row">
                         <div className="loading--message--inner flex-column">
                         <Loader
                            className="loading--message--anim"
                            type="TailSpin"
                            color="#fff"
                            height={60}
                            width={60}
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
                                    onChange={(e) =>
                                      setCompState({...compState, inputValue: e.target.value })
                                    }
                                    value={compState.inputValue}
                                    className="message__input"
                                    placeholder="Message..."
                                  />
                                </div>
                            </div>
                              {compState.inputValue ? (
                                <input type="submit" value="Send" className={`${!compState.inputValue && "disabled"}`} disabled={!compState.inputValue} />
                              ) : 
                              <div className="message--mini--toolbox flex-row">
                                <AiOutlinePicture onClick={() => onMessageAction("content")} className="message--pic--ico" />
                                <FaRegHeart onClick={() => onMessageAction("like")} className="message--heart--ico"/> 
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
  history: PropTypes.object
}
export default withBrowseUser(withRouter(Messages));
