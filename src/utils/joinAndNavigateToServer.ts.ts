import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { useEffect } from 'react';
import { NavigateFunction } from 'react-router';
import { Socket } from 'socket.io-client';
import { SERVER_NAV } from '../consts/routeNames';
import { ServerData } from '../redux/server/serverSlice';
import { AppDispatch } from '../redux/store';

export const joinAndNavigateToServer = ({
  data,
  dispatch,
  isSuccess,
  navigate,
  socket,
  joinServer,
  toast,
}: {
  data: { message: string; server: ServerData } | undefined;
  isSuccess: boolean;
  dispatch: AppDispatch;
  navigate: NavigateFunction;
  socket: Socket;
  joinServer: ActionCreatorWithPayload<
    { server: ServerData },
    'server/joinServer'
  >;
  toast: any;
}) =>
  useEffect(() => {
    if (isSuccess) {
      dispatch(joinServer({ server: data!.server }));
      navigate(SERVER_NAV(data!.server._id));
      socket.emit('join_servers', [data!.server._id]);
      toast({
        title: 'Success',
        description: data?.message,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [isSuccess, dispatch]);
