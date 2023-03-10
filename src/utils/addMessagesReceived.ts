import { Dispatch, SetStateAction, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { MessageDataModel } from '../helpers/servers/sendMessageToServer';

export const addMessagesReceived = ({
  socket,
  setSentAndReceivedMessages,
}: {
  socket: Socket;
  setSentAndReceivedMessages: Dispatch<SetStateAction<MessageDataModel[]>>;
}) =>
  useEffect(() => {
    socket.on('receive_message', (data: MessageDataModel) => {
      setSentAndReceivedMessages((prevSentAndReceivedMessages) => [
        ...prevSentAndReceivedMessages,
        data!,
      ]);
    });
  }, [socket]);
