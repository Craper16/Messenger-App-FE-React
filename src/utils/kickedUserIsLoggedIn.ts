import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { useEffect } from 'react';
import { NavigateFunction } from 'react-router';
import { Socket } from 'socket.io-client';
import { AppDispatch } from '../redux/store';
import { HOME } from '../consts/routeNames';

export const kickedUserIsLoggedIn = ({
  dispatch,
  leaveServer,
  navigate,
  socket,
  toast,
  userId,
}: {
  socket: Socket;
  toast: any;
  dispatch: AppDispatch;
  leaveServer: ActionCreatorWithPayload<
    { serverId: string },
    'server/leaveServer'
  >;
  navigate: NavigateFunction;
  userId: string | null;
}) =>
  useEffect(() => {
    if (socket) {
      socket.on(
        'user_kicked_from_server',
        ({
          serverId,
          kickedUserId,
          serverName,
        }: {
          serverId: string;
          kickedUserId: string;
          serverName: string;
        }) => {
          if (kickedUserId === userId) {
            toast({
              title: 'Kicked',
              description: `You have been kicked from ${serverName}`,
              status: 'error',
              duration: 5000,
              isClosable: true,
            });
            socket.emit('leave_server', serverId);
            dispatch(leaveServer({ serverId }));
            if (window.location.pathname.includes(serverId)) {
              navigate(HOME);
            }
          }
        }
      );
    }
  }, [socket]);
