import { Spinner, Text } from '@chakra-ui/react';
import React from 'react';
import LoadingIndicator from '../components/LoadingIndicator';

export default function StartupPage() {
  return (
    <div className="flex justify-center align-middle m-auto mt-9">
      <div className="flex flex-col align-middle">
        <LoadingIndicator />
        <Text className="text-purple-900 font-bold mt-4">
          Loading Messenger...
        </Text>
      </div>
    </div>
  );
}
