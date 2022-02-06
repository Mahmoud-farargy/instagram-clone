import React, { useState, useEffect, useRef, memo } from "react";
import { AiOutlineMessage } from "react-icons/ai";
import { GOU } from "../../../Utilities/GetOnlineUsers";
import User from "./User/User";

const Users = (props) => {
  const { messages, uid, blockList, isSending } = props;
  const [onlineList, setOnlineList] = useState([]);
  const _isMounted = useRef(true);
  useEffect(() => {
      GOU(uid).then((k) => {
        if (_isMounted?.current) {
            setOnlineList(k);
        }
      });
    return () => _isMounted.current = false;
  }, [uid]);
  return (
    <>
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
                <div key={user?.uid + index}>
                  {!blockList?.some(
                    (el) => el?.blockedUid === user?.uid
                  ) && (
                    <User
                      user={user}
                      isOnline={onlineList?.some((c) => c.uid === user?.uid)}
                      index={index}
                      isSending={isSending}
                    />
                  )}
                </div>
              );
            })
        ) : (
          <div className="empty--chat--box">
            <div className="empty--card">
              <AiOutlineMessage />
              <h2>People who you message</h2>
              <h4>
                Start messaging people from the pen button above. Users will be
                here
              </h4>
            </div>
          </div>
        )}
      </ul>
    </>
  );
};

export default memo(Users);
