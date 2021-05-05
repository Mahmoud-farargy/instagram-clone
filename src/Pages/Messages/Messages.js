import React, { useEffect, useState, useContext, useRef, lazy, Suspense} from "react";
import Auxiliary from "../../Components/HOC/Auxiliary";
import { AppContext } from "../../Context";
import { Avatar } from "@material-ui/core";
import { BsPencilSquare, BsFillCameraVideoFill } from "react-icons/bs";
import TruncateMarkup from "react-truncate";
import { FiSend, FiInfo } from "react-icons/fi";
import { VscSmiley } from "react-icons/vsc";
import { RiMenu4Fill } from "react-icons/ri";
import { MdClose } from "react-icons/md";
import PropTypes from "prop-types";
import { withBrowseUser } from "../../Components/HOC/withBrowseUser";
import GetFormattedDate from "../../Utilities/FormatDate";
import Message from "./Message/Message";
import { AiOutlinePicture } from "react-icons/ai";
import { FaRegHeart } from "react-icons/fa";
import { storage } from "../../Config/firebase";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FcLike } from "react-icons/fc";
import { GoVerified } from "react-icons/go";
import { withRouter } from 'react-router-dom';
import Loader from "react-loader-spinner";
import LoadingScreen from "../../Components/Generic/LoadingScreen/LoadingScreen";
import { trimText } from "../../Utilities/TrimText";
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
        showEmojis: false,
        loading: {uid: "", state: false, progress: 0}
    })
  const { handleSendingMessage, receivedData, currentChat, changeMainState, notify, modalsState, changeModalState, deleteChat, handleUserBlocking, handleFollowing } = context;
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
          showEmojis: false,
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
    }
  }

  const selectEmoji = (emojiText) => {
    setCompState({
      ...compState,
      inputValue: compState.inputValue + emojiText,
    });
  };
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
          if (
            /(image|video)/g.test(metadata.contentType) &&
            uploadedItem.size <= 12378523
          ) {
            const itemType = /image/g.test(metadata.contentType) ? "picture" : "video";
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
          } else {
            notify(
              "Please choose an image or video that doesn't exceed the size of 12MB.",
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
                                  className={`messages--user  flex-row ${index === currentChat.index && "active-msg"}`}
                                  
                                  onClick={() => viewUsersMessages(user?.uid, index)}
                                >
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
                                          : <span>Empty message</span>
                                      } 
                                      </span>
                                    </div>
                                    <p className="messages__user__date">
                                      {user?.chatLog?.length >= 1
                                        ? <GetFormattedDate date={user?.chatLog[user.chatLog?.length - 1]
                                          .date.seconds} />
                                        : null}
                                    </p>
                                  </div>
                                </li>
                            }   
                            </div>
                            
                          );
                        })
                    ) : (
                      <h4
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          textAlign: "center",
                        }}
                      >
                        Start messaging people from the pen button above. Users
                        will be here
                      </h4>
                    )}
                  </ul>
    )
    return (
      <Auxiliary>
        {/* modals */}
        <Suspense fallback={<LoadingScreen />}>
          {modalsState?.options && (
              <OptionsModal>
              <span className="text-danger font-weight-bold" onClick={() => deleteChat(currUser?.uid)}>Delete Chat</span>
              <span className={`font-weight-bold ${isFollowed ? "text-danger" : "text-primary"}`} onClick={() => { currUser?.uid && handleFollowing(
                          isFollowed,
                          currUser?.uid,
                          currUser?.userName,
                          currUser?.userAvatarUrl,
                          receivedData?.uid, //these data is already available in context (refactor if possible)
                          receivedData?.userName,
              receivedData?.userAvatarUrl)}}>{isFollowed ? "Unfollow" : "Follow"}</span>
              <span className="text-danger font-weight-bold" onClick={() => blockUser(currUser?.uid, currUser?.userName, currUser?.userAvatarUrl, currUser?.profileInfo?.name)}>Block this user</span>
              <span>Cancel</span>
              </OptionsModal>
            )}
      </Suspense>
        <section id="messages" className="messages--container">
          <input id="contentUploader" type ="file" name="contentUploader" accept={['image/*','video/*']} ref={fileUploadEl} onChange={(x) => onPickingContent(x)} />
          <div className="desktop-comp messages--main--container flex-column">
            <div className="messages--desktop--card flex-row">
              {/* users side */}
              <div className="messages--users--side desktop-only flex-column">
                <div className="users--side--header flex-row">
                  <span className="space__between">
                    <h4>Direct</h4>
                    <BsPencilSquare className="pen__logo" />
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
                      : "translate(200vw)",
                    transition: "all 0.5s linear",
                    opacity: compState.openSidedrawer ? "1" : "0",
                  }}
                  id="mobileChat"
                  className="mobile--users--sidedrawer"
                >
                  {" "}
                  {/*mobile */}
                  <div className="messages--users--side mobile-only flex-column">
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
                      <button>Send message</button>
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
                    {compState.showEmojis ? (
                      <div
                        style={{
                          opacity: compState.showEmojis ? "1" : "0",
                          transition: "all 0.5s ease",
                        }}
                        className="chat--emojis--box flex-row"
                      >
                        <span
                          role="img"
                          aria-label="emoji"
                          onClick={() => selectEmoji("😍 ")}
                        >
                          😍
                        </span>
                        <span
                          role="img"
                          aria-label="emoji"
                          onClick={() => selectEmoji("😂 ")}
                        >
                          😂
                        </span>
                        <span
                          role="img"
                          aria-label="emoji"
                          onClick={() => selectEmoji("😄")}
                        >
                          😄
                        </span>
                        <span
                          role="img"
                          aria-label="emoji"
                          onClick={() => selectEmoji("😊 ")}
                        >
                          😊
                        </span>
                        <span
                          role="img"
                          aria-label="emoji"
                          onClick={() => selectEmoji("😘 ")}
                        >
                          😘
                        </span>
                        <span
                          role="img"
                          aria-label="emoji"
                          onClick={() => selectEmoji("😁 ")}
                        >
                          😁
                        </span>
                        <span
                          role="img"
                          aria-label="emoji"
                          onClick={() => selectEmoji("😢 ")}
                        >
                          😢
                        </span>
                        <span
                          role="img"
                          aria-label="emoji"
                          onClick={() => selectEmoji("😎 ")}
                        >
                          😎
                        </span>
                        <span
                          role="img"
                          aria-label="emoji"
                          onClick={() => selectEmoji("😋 ")}
                        >
                          😋
                        </span>
                        <span
                          role="img"
                          aria-label="emoji"
                          onClick={() => selectEmoji("😜 ")}
                        >
                          😜
                        </span>
                        <span
                          role="img"
                          aria-label="emoji"
                          onClick={() => selectEmoji("😫 ")}
                        >
                          😫
                        </span>
                      </div>
                    ) : null}
                    <div className="messages--bottom--form flex-row">
                      <form
                        onSubmit={(v) => submitMessage(v)}
                        className="flex-row"
                      >
                        <VscSmiley
                          onClick={() =>
                            setCompState({
                              ...compState,
                              showEmojis: !compState.showEmojis,
                            })
                          }
                          className="smiley__icon"
                        />
                        <input
                          onChange={(e) =>
                            
                            setCompState({...compState, inputValue: e.target.value })
                          }
                          value={compState.inputValue}
                          className="message__input"
                          placeholder="Message..."
                        />
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
