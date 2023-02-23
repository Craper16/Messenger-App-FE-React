import { useEffect } from 'react';
import { connect } from 'socket.io-client';

export const openWebSocketOnMount = (access_token: string) =>
  useEffect(() => {
    const socket = connect(import.meta.env.VITE_API_KEY, {
      query: { access_token: access_token },
    });

    socket.on('connect', () => {
      console.log('We are here');
    });

    // return () => {
    //   socket.disconnect();
    // };
  }, []);
