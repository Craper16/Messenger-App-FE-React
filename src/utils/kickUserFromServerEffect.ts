import { SerializedError } from '@reduxjs/toolkit';
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  QueryDefinition,
} from '@reduxjs/toolkit/dist/query';
import { QueryActionCreatorResult } from '@reduxjs/toolkit/dist/query/core/buildInitiate';
import { useEffect } from 'react';
import { ServerData } from '../redux/server/serverSlice';

export const kickUserFromServerEffect = ({
  kickMemberIsError,
  kickMemberIsSuccess,
  refetch,
  toast,
  data,
  error,
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
