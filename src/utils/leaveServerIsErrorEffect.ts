import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { useEffect } from 'react';

export const leaveServerIsErrorEffect = ({
  leaveServerMutationIsError,
  toast,
  leaveServerMutationError,
  deleteServerMutationIsError,
  deleteServerMutationError,
}: {
  leaveServerMutationIsError: boolean;
  toast: any;
  leaveServerMutationError: FetchBaseQueryError | SerializedError | undefined;
  deleteServerMutationIsError: boolean;
  deleteServerMutationError: FetchBaseQueryError | SerializedError | undefined;
}) =>
  useEffect(() => {
    if (leaveServerMutationIsError || deleteServerMutationIsError) {
      toast({
        title: 'An error has occured',
        description:
          (leaveServerMutationError as { message: string })?.message ||
          (deleteServerMutationError as { message: string })?.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [leaveServerMutationIsError, deleteServerMutationIsError]);
