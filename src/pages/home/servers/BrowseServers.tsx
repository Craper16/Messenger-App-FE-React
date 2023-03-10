import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Spinner, Text } from '@chakra-ui/react';
import ServerSearchItem from '../../../components/Server/ServerSearchItem';
import {
  useFetchAllServersQuery,
  useJoinServerMutation,
} from '../../../redux/api/serverApi';
import { useAppSelector } from '../../../redux/hooks';
import { ServerData } from '../../../redux/server/serverSlice';
import { displaySearchedServersIfFound } from '../../../utils/displaySearchedServersIfFound';

export default function BrowseServers() {
  const navigate = useNavigate();

  const [fetchedServers, setFetchedServers] = useState<ServerData[]>([]);
  const [pageQuery, setPageQuery] = useState(1);

  const { isError, isFetching, data, error } =
    useFetchAllServersQuery(pageQuery);

  const [joinServerMutation] = useJoinServerMutation();

  const { userId } = useAppSelector((state) => state.auth);

  displaySearchedServersIfFound({
    data,
    setSearchedServers: setFetchedServers,
  });

  if (isError) {
    return (
      <Text>{(error as { message: string; status: number })?.message}</Text>
    );
  }

  return (
    <div className="flex flex-col justify-center align-middle mt-6">
      <div className="ml-auto m-auto mr-auto w-96 justify-center align-middle">
        {isFetching && (
          <div className="flex justify-center align-middle mt-52">
            <Spinner
              size="xl"
              className="text-purple-900"
            />
          </div>
        )}
        {fetchedServers?.map((server) => (
          <div
            key={server._id}
            className="flex justify-center align-middle mt-6"
          >
            <ServerSearchItem
              userId={userId!}
              joinServerMutation={() =>
                joinServerMutation({ serverId: server._id })
              }
              navigate={navigate}
              server={server}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
