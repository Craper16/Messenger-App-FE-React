import { Card, CardBody, CardHeader, Text, Button } from '@chakra-ui/react';
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  MutationDefinition,
} from '@reduxjs/toolkit/dist/query';
import { MutationActionCreatorResult } from '@reduxjs/toolkit/dist/query/core/buildInitiate';
import { NavigateFunction } from 'react-router';
import { SERVER_NAV } from '../../consts/routeNames';
import { ServerData } from '../../redux/server/serverSlice';

type ServerSearchItemProps = {
  server: ServerData;
  userId: string;
  joinServerMutation: ({
    serverId,
  }: {
    serverId: string;
  }) => MutationActionCreatorResult<
    MutationDefinition<
      {
        serverId: string;
      },
      BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, {}>,
      never,
      {
        message: string;
        server: ServerData;
      },
      'serverApi'
    >
  >;
  navigate: NavigateFunction;
};

export default function ServerSearchItem({
  server,
  userId,
  joinServerMutation,
  navigate,
}: ServerSearchItemProps) {
  return (
    <div
      key={server._id}
      className="flex justify-center align-middle mt-6"
    >
      <Card
        key={server._id}
        backgroundColor="purple.200"
        className="col-start-auto w-72 h-56 cursor-pointer bg-red-400"
        onClick={() => {
          if (server.members.find((member) => member === userId)) {
            return navigate(SERVER_NAV(server._id));
          }
          return;
        }}
      >
        <CardHeader className="font-bold">{server.name}</CardHeader>
        <CardBody>
          <Text>Members: {server.members.length}</Text>
          {server.owner === userId && <Text>Owner</Text>}
          {server.members.find((member) => member === userId) ? (
            <Text>You are already a member of this server</Text>
          ) : (
            <Button
              className="mt-3"
              onClick={() => joinServerMutation({ serverId: server._id })}
            >
              {`Join ${server.name}`}
            </Button>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
