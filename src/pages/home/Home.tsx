import { Button, Input } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { connect } from 'socket.io-client';
import { ACCESS_TOKEN } from '../../consts/constants';
import { useAppSelector } from '../../redux/hooks';
import { openWebSocketOnMount } from '../../utils/openWebSocketOnMount';

interface MessageModel {
  content: string;
  sender: string;
  receiver: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function Home() {
  const [message, setMessage] = useState('');

  const { displayName, userId } = useAppSelector((state) => state.auth);

  const socket = connect(import.meta.env.VITE_API_KEY, {
    query: { access_token: localStorage.getItem(ACCESS_TOKEN) },
    reconnection: true,
    rejectUnauthorized: true,
  });

  async function sendMessage() {
    if (!message) return;

    const messageData: MessageModel = {
      content: message,
      receiver: '63f15a1fe14c72f913df92f7',
      sender: userId!,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await socket!.emit('send_message', messageData);
    setMessage('');
  }

  // openWebSocketOnMount(localStorage.getItem(ACCESS_TOKEN)!);

  useEffect(
    useCallback(() => {
      socket!.on('connect', () => {
        console.log('We are here');
      });

      return () => {
        socket!.disconnect();
      };
    }, []),
    [socket]
  );

  useEffect(() => {
    console.log('This is causing rerenders');
    socket!.on('receive_message', (data: MessageModel) => {
      console.log(data);
    });
  }, [socket]);

  return (
    <div>
      <div>{displayName}</div>
      <Input
        value={message}
        onChange={(e) => setMessage(e.currentTarget.value)}
      />
      <Button onClick={sendMessage}>Send Message</Button>
    </div>
  );
}
