import React, { RefObject } from 'react';
import { MessageDataModel } from '../../helpers/servers/sendMessageToServer';

type props = {
  message: MessageDataModel;
  messagesDivRef: RefObject<HTMLDivElement>;
  userId: string;
};

export default function MessageItem({
  message,
  messagesDivRef,
  userId,
}: props) {
  return (
    <div
      ref={messagesDivRef}
      className={
        message.sender._id === userId
          ? `flex flex-col border border-solid items-end
       border-y-cyan-800 m-2 p-2`
          : `flex flex-col border border-solid
       border-y-cyan-800 m-2 p-2`
      }
    >
      <div className="font-bold font-sans">{message.sender.displayName}</div>
      <div>{message.content}</div>
    </div>
  );
}
