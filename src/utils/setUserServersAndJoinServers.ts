import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { ServerData } from '../redux/server/serverSlice';
import { AppDispatch } from '../redux/store';

export const setUserServersAndJoinServers = ({
  data,
  dispatch,
  setUserServers,
  socket,
}: {
  data: ServerData[] | undefined;
  dispatch: AppDispatch;
  setUserServers: ActionCreatorWithPayload<
    { servers: ServerData[] },
    'server/setUserServers'
  >;
  socket?: Socket | undefined;
}) =>
  useEffect(() => {
    if (data) {
      dispatch(setUserServers({ servers: data }));
      if (socket) {
        socket.emit('join_servers', [...data.map((server) => server._id)]);
      }
    }
  }, [data]);
