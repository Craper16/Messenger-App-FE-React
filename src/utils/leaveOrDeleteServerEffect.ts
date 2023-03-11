import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { useEffect } from 'react';
import { AppDispatch } from '../redux/store';

export const leaveOrDeleteServerEffect = ({
  dispatch,
  leaveServer,
  toast,
  deleteServerMutationResponse,
  leaveServerMutationResponse,
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
          leaveServerMutationResponse.data?.message ||
          deleteServerMutationResponse.data?.message,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [deleteServerMutationResponse.data, leaveServerMutationResponse.data]);
