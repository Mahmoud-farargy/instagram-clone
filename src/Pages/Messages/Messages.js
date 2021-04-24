import React, { useEffect, useState, useContext, useRef} from "react";
import Auxiliary from "../../Components/HOC/Auxiliary";
import { AppContext } from "../../Context";
import { Avatar } from "@material-ui/core";
import { BsPencilSquare } from "react-icons/bs";
import TruncateMarkup from "react-truncate";
import { FiSend, FiInfo } from "react-icons/fi";
import { VscSmiley } from "react-icons/vsc";
import { RiMenu4Fill } from "react-icons/ri";
import { MdClose } from "react-icons/md";
import PropTypes from "prop-types";
import { withBrowseUser } from "../../Components/HOC/withBrowseUser";
import GetFormattedDate from "../../Utilities/FormatDate";
// import { updateObject } from "../../Utilities/Utility";


import $ from "jquery";

const Messages = (props) => {
    const autoScroll = useRef(null)
    const context = useContext(AppContext);
    const [compState, setCompState] = useState({
        inputValue: "",
        loadedChatLog: [],
        openSidedrawer: false,
        showEmojis: false,
    })
  const { handleSendingMessage, receivedData, currentChatIndex, changeMainState } = context;
  const { messages } = receivedData;

  useEffect(() =>{
    $(document).ready(() => {
          $("#messagesUL li").on("click", function () {
            $("#messagesUL li").each((i, item) => {
              $(item).removeClass("active-msg");
            });
            $(this).addClass("active-msg");
          });
        });
    changeMainState("currentPage", "Messages");
  },[]);

  useEffect(() =>{
    // setCompState(updateObject(compState, { showEmojis: false }));
    autoScroll && autoScroll.current && autoScroll.current?.scrollIntoView && autoScroll.current.scrollIntoView();
    setCompState({
      ...compState,
      loadedChatLog: messages[ currentChatIndex],
      openSidedrawer: false,
      showEmojis: false,
    });
    // if(
    //   prevState.currentUserIndex !== compState.currentUserIndex &&
    //   this.autoScroll &&
    //   this.autoScroll.scrollIntoViewIfNeeded
    // ) {
    //   this.autoScroll.scrollIntoViewIfNeeded();
    // }
  },[messages, currentChatIndex]);
  // componentDidUpdate = (prevProps, prevState) => {
  //   if (prevProps.messages !== this.props.messages) {
  //     if (this.autoScroll.scrollIntoView) {
  //       this.autoScroll.scrollIntoView({ behavior: "smooth" });
  //       this.setState(updateObject(this.state, { showEmojis: false }));
  //     }
  //   }
  //   if (
  //     prevState.currentUserIndex !== compState.currentUserIndex &&
  //     this.autoScroll &&
  //     this.autoScroll.scrollIntoViewIfNeeded
  //   ) {
  //     this.autoScroll.scrollIntoViewIfNeeded();
  //   }
  // };
  const submitMessage = (v) => {
    v.preventDefault();
    const currUser = receivedData?.messages[currentChatIndex];

    handleSendingMessage(compState.inputValue, currUser?.uid, "text");

    setCompState({
      ...compState,
      inputValue: "",
    });
  }

 const viewUsersMessages = (_, loadedIndex) => {
    changeMainState("currentChatIndex", loadedIndex);
    // setCompState({
    //   ...compState,
    //   loadedChatLog: messages[loadedIndex],
    //   currentUserIndex: loadedIndex,
    //   openSidedrawer: false,
    // });
  }

  const selectEmoji = (emojiText) => {
    setCompState({
      ...compState,
      inputValue: compState.inputValue + emojiText,
    });
  };

    const msg = messages ? messages[currentChatIndex] : [];
    return (
      <Auxiliary>
        <section id="messages" className="messages--container">
          <div className="desktop-comp">
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
                    <h5>general</h5>
                  </div>
                </div>
                <div className="messages--view--users">
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
                            <li
                              className="messages--user  flex-row"
                              key={user.uid + index}
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
                                    <TruncateMarkup line={1} ellipsis="..">
                                      {user.chatLog.length >= 1
                                        ? user.chatLog[user.chatLog?.length - 1]
                                            .textMsg
                                        : null}
                                    </TruncateMarkup>
                                  </span>
                                </div>
                                <p className="messages__user__date">
                                  {user.chatLog.length >= 1
                                    ? <GetFormattedDate date={user.chatLog[user.chatLog?.length - 1]
                                      .date.seconds} />
                                    : null}
                                </p>
                              </div>
                            </li>
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
                </div>
              </div>
              {/* messages side */}
              <div className="messages--side">
                <div className="mobile--msgs--menu mobile-only">
                  {!compState.openSidedrawer ? (
                    <RiMenu4Fill
                      onClick={() => setCompState({...compState, openSidedrawer: true })}
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
                        <h5>general</h5>
                      </div>
                    </div>
                    <div className="messages--view--users">
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
                              <li
                                className="messages--user flex-row"
                                key={user.uid + index}
                                onClick={() => viewUsersMessages(user?.uid, index)} >
                                <Avatar loading="lazy" src={user?.userAvatarUrl} alt={user?.userName} title={user?.userName}/>
                                <div className="messages--user--info space__between">
                                  <div style={{ flex: 1, width: "100%" }}>
                                    <p>
                                      <TruncateMarkup line={1} ellipsis="..">
                                        {user?.userName}
                                      </TruncateMarkup>{" "}
                                    </p>
                                    <span className="last__message">
                                      <TruncateMarkup line={1} ellipsis="..">
                                        {user.chatLog.length >= 1
                                          ? user.chatLog[
                                              user.chatLog?.length - 1
                                            ].textMsg
                                          : null}
                                      </TruncateMarkup>
                                    </span>
                                  </div>
                                  <p className="messages__user__date">
                                    {user.chatLog.length >= 1
                                      ? <GetFormattedDate date={user.chatLog[user.chatLog?.length - 1]
                                        .date.seconds} />
                                      : null}
                                  </p>
                                </div>
                              </li>
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
                            Start messaging people from the pen button above.
                            Users will be here
                          </h4>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>

                {(compState.loadedChatLog < 1 || messages.length <= 0 ) ? (
                  <div className="messages--empty--container flex-column">
                    {/* if there is no messages */}{" "}
                    {/* when loading messages */}
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
                ) : (
                  <div className="messages--chatlog--container">
                    <div className="messages--chatbox--header flex-row">
                      {/* -- header */}
                      <Avatar loading="lazy" src={msg?.userAvatarUrl} alt={msg?.userName} />
                      <div className="messages--user--info space__between">
                        <p style={{cursor:"pointer"}} onClick={() => props.browseUser(msg?.uid, msg?.userName)}>
                          <TruncateMarkup line={1} ellipsis="..">
                            {msg?.userName}
                          </TruncateMarkup>{" "}
                        </p>
                        <div className="desktop-only">
                          <FiInfo />
                        </div>
                      </div>
                      {/* -- */}
                    </div>
                    <div className="messages--chatbox--body">
                      {msg?.chatLog?.map((message, index) => {
                        return (
                          <div
                            key={message?.uid + index}
                            className="message--outer"
                          >
                            <span ref={autoScroll}></span>
                            <div
                              className={
                                message?.uid === receivedData?.uid
                                  ? "sender flex-column"
                                  : "receiver"
                              }
                            >
                              <div className="message--text">
                                <span>{message?.textMsg}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
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
                          <input type="submit" value="Send" />
                        ) : null}
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </Auxiliary>
    );
}
Messages.propTypes = {
  browseUser: PropTypes.func.isRequired
}
export default withBrowseUser(Messages);
