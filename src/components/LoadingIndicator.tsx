import { Spinner } from '@chakra-ui/react';
import React from 'react';

export default function LoadingIndicator() {
  return (
    <div className="flex justify-center align-middle mt-52">
      <Spinner
        size="xl"
        className="text-purple-900"
      />
    </div>
  );
}
