import {
  Text,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Socket } from 'socket.io-client';
import {
  useAddMessageToServerMutation,
  useFetchServerDataQuery,
} from '../../../redux/api/serverApi';
import { useAppSelector } from '../../../redux/hooks';
import { MdSend } from 'react-icons/md';
import { ServerData } from '../../../redux/server/serverSlice';

export interface MessageDataModel {
  content: string;
  sender: {
    _id: string;
    displayName: string;
    email: string;
    phoneNumber: number;
  };
  sentAt: Date;
  server: ServerData;
}

export default function Server() {
  const [messageToSend, setMessageToSend] = useState('');
  const [sentAndReceivedMessages, setSentAndReceivedMessages] = useState<
    MessageDataModel[]
  >([]);

  const { serverId } = useParams<{ serverId: string }>();

  const socket = useAppSelector((state) => state.socket.socket);
  const { userId, displayName, email, phoneNumber } = useAppSelector(
    (state) => state.auth
  );

  const { isError, isFetching, error, data } = useFetchServerDataQuery({
    serverId: serverId!,
  });

  const [addMessageToServerMutation, addMessageToServerMutationResponse] =
    useAddMessageToServerMutation();

  async function sendMessageToServer(message: string) {
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
      server: data!,
    };

    await (socket as Socket).emit('send_message', messageData);

    setSentAndReceivedMessages((prevSentAndReceivedMessages) => [
      ...prevSentAndReceivedMessages,
      messageData!,
    ]);
    addMessageToServerMutation(messageData);
    setMessageToSend('');
  }

  useEffect(() => {
    if (data) {
      setSentAndReceivedMessages([...data?.messages]);
    }
  }, [data]);

  useEffect(() => {
    (socket as Socket).on('receive_message', (data: MessageDataModel) => {
      setSentAndReceivedMessages((prevSentAndReceivedMessages) => [
        ...prevSentAndReceivedMessages,
        data!,
      ]);
    });
  }, [socket]);

  if (isError) {
    return (
      <Text>{(error as { message: string; status: number })?.message}</Text>
    );
  }

  return (
    <div>
      {isFetching && (
        <div className="flex justify-center align-middle mt-52">
          <Spinner
            size="xl"
            className="text-purple-900"
          />
        </div>
      )}
      <div className="overflow-y-auto overflow-x-hidden h-96">
        {sentAndReceivedMessages.map((message, i) => (
          <div
            key={i}
            className="border border-solid border-y-cyan-800 m-2 p-2"
          >
            <div className="font-bold font-sans">
              {message.sender.displayName}
            </div>
            <div>{message.content}</div>
          </div>
        ))}
      </div>

      <InputGroup className="flex justify-center align-middle">
        <Input
          className="w-40"
          value={messageToSend}
          onChange={(e) => setMessageToSend(e.currentTarget.value)}
        />
        <InputRightElement
          onClick={() => sendMessageToServer(messageToSend)}
          className="cursor-pointer"
          children={<MdSend className="text-purple-900" />}
        />
      </InputGroup>
    </div>
  );
}
