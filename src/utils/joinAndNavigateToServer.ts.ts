import { ActionCreatorWithPayload, SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
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
  isError,
  error,
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
  isError: boolean;
  error: FetchBaseQueryError | SerializedError | undefined;
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
    if (isError) {
      toast({
        title: 'An error has occured',
        description: (error as { message: string; status: number })?.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [isSuccess, dispatch, isError]);
