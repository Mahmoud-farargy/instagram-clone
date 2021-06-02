import React, { Fragment, memo, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import GetFormattedDate from "../../../../Utilities/FormatDate";
import TruncateMarkup from "react-truncate";
import { BsFillCameraVideoFill } from "react-icons/bs";
import { CgFileDocument } from "react-icons/cg";
import { FcLike } from "react-icons/fc";
import { MdAudiotrack } from "react-icons/md";
import { Avatar } from "@material-ui/core";
import { trimText } from "../../../../Utilities/TrimText";
import { AiOutlinePicture } from "react-icons/ai";
import { AppContext } from "../../../../Context";
import { GoVerified } from "react-icons/go";

const User = ({ user, index, isOnline }) => {
  const {
    currentChat,
    closeNewMsgNoti,
    changeMainState,
    receivedData,
  } = useContext(AppContext);
  const viewUsersMessages = (loadedUid, loadedIndex) => {
    const checkIndex = receivedData?.messages
      ?.map((user) => user.uid)
      .indexOf(loadedUid);
    if (checkIndex === loadedIndex && checkIndex !== -1) {
      changeMainState("currentChat", { uid: loadedUid, index: loadedIndex });
      if (receivedData?.messages?.[checkIndex]?.notification) {
        closeNewMsgNoti(loadedUid);
      }
    }
  };
  useEffect(() => {
    if( index === currentChat.index ){
      const userId = user?.uid;
      const checkIndex = receivedData?.messages
        ?.map((user) => user.uid)
        .indexOf(userId);
      if (receivedData?.messages?.[checkIndex]?.notification ) {
        closeNewMsgNoti(userId);
      }
    }
  }, []);
  return (
    <Fragment>
      <li
        className={`messages--user like__icon__item flex-row ${
          index === currentChat.index && "active-msg"
        }`}
        onClick={() => viewUsersMessages(user?.uid, index)}
      >
        {user?.notification && <div className="like__noti__dot"></div>}
        <Avatar
          loading="lazy"
          src={user?.userAvatarUrl}
          alt={user?.userName}
          title={user?.userName}
        />
        <div className="messages--user--info space__between">
          <div style={{ flex: 1, width: "60%" }}>
            <span className="flex-row" title={user?.userName}>
              <p>
                <TruncateMarkup line={1} ellipsis="..">
                  {trimText(user?.userName, 20)}
                </TruncateMarkup>{" "}
              </p>
              {user?.isVerified ? (
                <span>
                  <GoVerified className="verified_icon" />
                </span>
              ) : null}
              {isOnline && <span className="online__user"></span>}
            </span>

            <span className="last__message">
              {user?.chatLog?.[user.chatLog?.length - 1]?.type === "text" ? (
                <TruncateMarkup
                  line={1}
                  ellipsis=".."
                  style={{ textTransform: "none" }}
                >
                  {user?.chatLog?.length >= 1
                    ? user?.chatLog?.[user.chatLog?.length - 1].textMsg
                    : null}
                </TruncateMarkup>
              ) : user?.chatLog?.[user.chatLog?.length - 1]?.type ===
                "picture" ? (
                <span>
                  <AiOutlinePicture />
                </span>
              ) : user?.chatLog?.[user.chatLog?.length - 1]?.type ===
                "video" ? (
                <span>
                  <BsFillCameraVideoFill />
                </span>
              ) : user?.chatLog?.[user.chatLog?.length - 1]?.type === "like" ? (
                <span>
                  <FcLike />
                </span>
              ) : user?.chatLog?.[user.chatLog?.length - 1]?.type ===
                "audio" ? (
                <span>
                  <MdAudiotrack />
                </span>
              ) : user?.chatLog?.[user.chatLog?.length - 1]?.type ===
                "document" ? (
                <span>
                  <CgFileDocument />
                </span>
              ) : (
                <span>Empty message</span>
              )}
            </span>
          </div>
          <p className="messages__user__date">
            {user?.chatLog?.length >= 1 ? (
              <span>
                <span className="messages__user__date__divider">• </span>
                <GetFormattedDate
                  date={user?.chatLog[user.chatLog?.length - 1].date.seconds}
                />
              </span>
            ) : null}
          </p>
        </div>
      </li>
    </Fragment>
  );
};
User.propTypes = {
  user: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  isOnline: PropTypes.bool.isRequired,
};
export default memo(User);
