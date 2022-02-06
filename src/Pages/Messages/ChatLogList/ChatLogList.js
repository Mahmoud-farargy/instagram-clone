import React, { memo } from "react";
import Message from "./ChatMessage/ChatMessage";
const MessageList = (props) => {
  const { chatLog, messagerUid, receivedData, openSidedrawer, isSending } = props;
  return (
    <>
      {chatLog &&
        chatLog.length > 0 &&
        chatLog?.map((message, index) => {
          return (
            <Message
              key={message?.uid + index}
              user={{ uid: messagerUid }}
              openSidedrawer={openSidedrawer}
              receivedData={receivedData}
              message={message}
              index={index}
              isSending={isSending}
            />
          );
        })}
    </>
  );
};

export default memo(MessageList);
