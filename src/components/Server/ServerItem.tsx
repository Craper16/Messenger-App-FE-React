import { Card, CardBody, CardHeader, Text } from '@chakra-ui/react';
import React from 'react';
import { NavigateFunction } from 'react-router';
import { SERVER_NAV } from '../../consts/routeNames';
import { ServerData } from '../../redux/server/serverSlice';

type ServerItemProps = {
  server: ServerData;
  userId: string;
  navigate: NavigateFunction;
};

export default function ServerItem({
  server,
  userId,
  navigate,
}: ServerItemProps) {
  return (
    <Card
      key={server._id}
      className='col-start-auto w-48 h-48 cursor-pointer m-10 bg-red-400'
      onClick={() => navigate(SERVER_NAV(server._id))}
    >
      <CardHeader className='font-bold'>{server.name}</CardHeader>
      <CardBody>
        <Text>Members: {server.members.length}</Text>
        {server.owner === userId ? <Text>Owner</Text> : <Text>Member</Text>}
      </CardBody>
    </Card>
  );
}