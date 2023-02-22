import { useEffect } from 'react';
import { connect } from 'socket.io-client';

export const openWebSocketOnMount = () =>
  useEffect(() => {
    const socket = connect(import.meta.env.VITE_API_KEY);

    socket.on('connect', () => {
      console.log('We are here');
    });
  }, []);
