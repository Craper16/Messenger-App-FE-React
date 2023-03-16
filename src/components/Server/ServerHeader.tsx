import React from 'react';
import { Text, Button } from '@chakra-ui/react';
import { MdSettings } from 'react-icons/md';

export default function ServerHeader({
  owner,
  serverName,
  userId,
  handleNavigateToManageServer,
}: {
  owner: string;
  userId: string;
  serverName: string;
  handleNavigateToManageServer: () => void;
}) {
  return (
    <>
      <Text className="text-2xl text-white">{serverName}</Text>
      {owner === userId ? (
        <Button
          className="ml-56 text-purple-900"
          leftIcon={<MdSettings />}
          onClick={handleNavigateToManageServer}
        >
          Manage Server
        </Button>
      ) : null}
    </>
  );
}
