import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  MutationDefinition,
} from '@reduxjs/toolkit/dist/query';
import { MutationTrigger } from '@reduxjs/toolkit/dist/query/react/buildHooks';
import { Dispatch, SetStateAction } from 'react';
import { Socket } from 'socket.io-client';
import { ServerData } from '../../redux/server/serverSlice';

export interface MessageDataModel {
  content: string;
  sender: {
    _id: string;
    displayName: string;
    email: string;
    phoneNumber: number;
  };
  sentAt: Date;
  serverId: string;
  serverName: string;
}

export async function sendMessageToServer({
  displayName,
  email,
  message,
  phoneNumber,
  serverData,
  userId,
  socket,
  setSentAndReceivedMessages,
  setMessageToSend,
  addMessageToServerMutation,
}: {
  message: string;
  userId: string;
  displayName: string;
  email: string;
  phoneNumber: number;
  serverData: ServerData;
  socket: Socket;
  setSentAndReceivedMessages: Dispatch<SetStateAction<MessageDataModel[]>>;
  setMessageToSend: Dispatch<SetStateAction<string>>;
  addMessageToServerMutation: MutationTrigger<
    MutationDefinition<
      MessageDataModel,
      BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, {}>,
      never,
      ServerData,
      'serverApi'
    >
  >;
}) {
  if (!message) return;

  const messageData: MessageDataModel = {
    content: message!,
    sender: {
      _id: userId!,
      displayName: displayName!,
      email: email!,
      phoneNumber: phoneNumber!,
    },
    sentAt: new Date(),
    serverId: serverData._id!,
    serverName: serverData.name,
  };

  await (socket as Socket).emit('send_message', messageData);

  setSentAndReceivedMessages((prevSentAndReceivedMessages) => [
    ...prevSentAndReceivedMessages,
    messageData!,
  ]);
  addMessageToServerMutation(messageData);
  setMessageToSend('');
}
