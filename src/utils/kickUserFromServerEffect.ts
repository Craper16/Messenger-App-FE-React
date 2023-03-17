import { SerializedError } from '@reduxjs/toolkit';
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  QueryDefinition,
} from '@reduxjs/toolkit/dist/query';
import { QueryActionCreatorResult } from '@reduxjs/toolkit/dist/query/core/buildInitiate';
import { useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { ServerData } from '../redux/server/serverSlice';

export const kickUserFromServerEffect = ({
  kickMemberIsError,
  kickMemberIsSuccess,
  refetch,
  toast,
  data,
  error,
  socket,
}: {
  kickMemberIsSuccess: boolean;
  kickMemberIsError: boolean;
  toast: any;
  refetch: () => QueryActionCreatorResult<
    QueryDefinition<
      {
        serverId: string;
      },
      BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, {}>,
      never,
      ServerData,
      'serverApi'
    >
  >;
  data:
    | {
        message: string;
        kickedUser: { _id: string };
        server: ServerData;
      }
    | undefined;
  error: FetchBaseQueryError | SerializedError | undefined;
  socket: Socket;
}) =>
  useEffect(() => {
    if (kickMemberIsSuccess) {
      refetch();
      toast({
        title: 'Success',
        description: data?.message,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      socket.emit('kick_from_server', {
        serverId: data?.server._id,
        kickedUserId: data?.kickedUser._id,
        serverName: data?.server.name,
      });
    }
    if (kickMemberIsError) {
      toast({
        title: 'An error as occured',
        description: (error as { message: string; status: number })?.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [kickMemberIsSuccess, kickMemberIsError]);
