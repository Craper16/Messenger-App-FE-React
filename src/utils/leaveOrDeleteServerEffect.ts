import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { AppDispatch } from '../redux/store';

export const leaveOrDeleteServerEffect = ({
  dispatch,
  leaveServer,
  toast,
  deleteServerMutationResponse,
  leaveServerMutationResponse,
  socket,
}: {
  dispatch: AppDispatch;
  leaveServer: ActionCreatorWithPayload<
    {
      serverId: string;
    },
    'server/leaveServer'
  >;
  toast: any;
  deleteServerMutationResponse: any;
  leaveServerMutationResponse: any;
  socket: Socket;
}) =>
  useEffect(() => {
    if (
      deleteServerMutationResponse.isSuccess ||
      leaveServerMutationResponse.isSuccess
    ) {
      dispatch(
        leaveServer({
          serverId:
            deleteServerMutationResponse?.data?.server._id! ||
            leaveServerMutationResponse?.data?.server._id!,
        })
      );
      toast({
        title: 'Success',
        description:
          leaveServerMutationResponse?.data?.message ||
          deleteServerMutationResponse?.data?.message,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      socket.emit(
        'leave_server',
        deleteServerMutationResponse?.data?.server._id ||
          leaveServerMutationResponse?.data?.server?._id
      );
    }
  }, [deleteServerMutationResponse.data, leaveServerMutationResponse.data]);
