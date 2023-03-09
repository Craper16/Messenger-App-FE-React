import { SearchIcon } from '@chakra-ui/icons';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ServerSearchItem from '../../../components/Server/ServerSearchItem';
import { SERVER_NAV } from '../../../consts/routeNames';
import { ErrorResponse } from '../../../redux/api/authApi';
import {
  useJoinServerMutation,
  useSearchServersMutation,
} from '../../../redux/api/serverApi';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { joinServer, ServerData } from '../../../redux/server/serverSlice';

export default function SearchServers() {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const [searchedServers, setSearchedServers] = useState<ServerData[]>([]);
  const [search, setSearch] = useState('');

  const { userId } = useAppSelector((state) => state.auth);

  const [searchServers, searchServersReturnedObj] = useSearchServersMutation();

  const [joinServerMutation, joinServerMutationReturnObj] =
    useJoinServerMutation();

  const socket = useAppSelector((state) => state.socket.socket);

  const searchingButNoServersFound =
    search && searchServersReturnedObj.data?.length === 0;

  useEffect(() => {
    if (joinServerMutationReturnObj.isSuccess) {
      dispatch(joinServer({ server: joinServerMutationReturnObj.data.server }));
      navigate(SERVER_NAV(joinServerMutationReturnObj.data.server._id));
      socket.emit('join_servers', [
        joinServerMutationReturnObj.data.server._id,
      ]);
    }
  }, [joinServerMutationReturnObj.isSuccess, dispatch]);

  useEffect(() => {
    if (search) {
      searchServers(search);
    }
    if (!search) {
      setSearchedServers([]);
    }
  }, [search]);

  useEffect(() => {
    if (searchServersReturnedObj.data) {
      setSearchedServers(searchServersReturnedObj.data);
    }
  }, [searchServersReturnedObj.data]);

  return (
    <div className="flex flex-col">
      <InputGroup className="w-14">
        <Input
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
        />
        <InputRightElement children={<SearchIcon color="purple.900" />} />
      </InputGroup>
      {searchServersReturnedObj.isError && (
        <Text>
          {
            (
              searchServersReturnedObj.error as {
                message: string;
                status: number;
              }
            )?.message
          }
        </Text>
      )}
      <div className="ml-auto m-auto mr-auto w-96 justify-center align-middle">
        {searchedServers.map((server) => (
          <ServerSearchItem
            key={server._id}
            joinServerMutation={() =>
              joinServerMutation({ serverId: server._id })
            }
            server={server}
            userId={userId!}
            navigate={navigate}
          />
        ))}
        {searchingButNoServersFound && (
          <Text>{`Server \'${search}' not found`}</Text>
        )}
      </div>
    </div>
  );
}
