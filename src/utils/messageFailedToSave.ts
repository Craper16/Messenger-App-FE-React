import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { useEffect } from 'react';

export const messageFailedToSaveToServer = ({
  addMessageToServerIsError,
  toast,
  addMessageToServerError,
}: {
  addMessageToServerIsError: boolean;
  toast: any;
  addMessageToServerError: FetchBaseQueryError | SerializedError | undefined;
}) =>
  useEffect(() => {
    if (addMessageToServerIsError) {
      toast({
        title: 'An error has Occured',
        description:
          (addMessageToServerError as { message: string }).message ||
          (addMessageToServerError as { error: string }).error,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [addMessageToServerIsError]);
