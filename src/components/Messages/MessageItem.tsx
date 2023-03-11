import React, { RefObject } from 'react';
import { MessageDataModel } from '../../helpers/servers/sendMessageToServer';

type props = {
  message: MessageDataModel;
  messagesDivRef: RefObject<HTMLDivElement>;
};

export default function MessageItem({ message, messagesDivRef }: props) {
  return (
    <div
      ref={messagesDivRef}
      className="border border-solid border-y-cyan-800 m-2 p-2"
    >
      <div className="font-bold font-sans">{message.sender.displayName}</div>
      <div>{message.content}</div>
    </div>
  );
}
