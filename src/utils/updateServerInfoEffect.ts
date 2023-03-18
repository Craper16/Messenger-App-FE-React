import { SerializedError } from '@reduxjs/toolkit';
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  QueryDefinition,
} from '@reduxjs/toolkit/dist/query';
import { QueryActionCreatorResult } from '@reduxjs/toolkit/dist/query/core/buildInitiate';
import { useEffect, Dispatch, SetStateAction } from 'react';
import { ServerData } from '../redux/server/serverSlice';

export const updateServerInfoEffect = ({
  refetch,
  toast,
  updateIsError,
  updateIsSuccess,
  setIsInUpdateServerMode,
  updateErrorData,
}: {
  updateIsSuccess: boolean;
  updateIsError: boolean;
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
  setIsInUpdateServerMode: Dispatch<SetStateAction<boolean>>;
  updateErrorData: FetchBaseQueryError | SerializedError | undefined;
}) =>
  useEffect(() => {
    if (updateIsSuccess) {
      refetch();
      setIsInUpdateServerMode(false);
    }
    if (updateIsError) {
      toast({
        title: 'An error has occured',
        description: (updateErrorData as { message: string }).message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [updateIsSuccess, updateIsError]);
