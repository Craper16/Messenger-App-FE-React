import { CloseIcon, SearchIcon } from '@chakra-ui/icons';
import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ServerSearchItem from '../../../components/Server/ServerSearchItem';
import {
  useJoinServerMutation,
  useSearchServersMutation,
} from '../../../redux/api/serverApi';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { joinServer, ServerData } from '../../../redux/server/serverSlice';
import { displaySearchedServersIfFound } from '../../../utils/displaySearchedServersIfFound';
import { joinAndNavigateToServer } from '../../../utils/joinAndNavigateToServer.ts';
import { searchServersAndClearSearchedServers } from '../../../utils/searchServersAndClearSearchedServers.ts';

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

  joinAndNavigateToServer({
    data: joinServerMutationReturnObj.data,
    dispatch,
    isSuccess: joinServerMutationReturnObj.isSuccess,
    joinServer,
    navigate,
    socket,
  });

  searchServersAndClearSearchedServers({
    search,
    searchServers,
    setSearchedServers,
  });

  displaySearchedServersIfFound({
    data: searchServersReturnedObj.data,
    setSearchedServers,
  });

  return (
    <div className='flex flex-col'>
      <InputGroup className='w-14'>
        <InputLeftElement children={<SearchIcon color='purple.900' />} />
        <Input
          placeholder='Search'
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
        />
        <InputRightElement
          onClick={() => setSearch('')}
          children={
            search ? (
              <CloseIcon color='purple.900' className='cursor-pointer' />
            ) : null
          }
        />
      </InputGroup>
      {searchServersReturnedObj.isLoading && (
        <div className='flex justify-center align-middle mt-52'>
          <Spinner size='xl' className='text-purple-900' />
        </div>
      )}
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
      <div className='ml-auto m-auto mr-auto w-96 justify-center align-middle'>
        {searchedServers.map((server) => (
          <div
            key={server._id}
            className='flex justify-center align-middle mt-6'
          >
            <ServerSearchItem
              joinServerMutation={() =>
                joinServerMutation({ serverId: server._id })
              }
              server={server}
              userId={userId!}
              navigate={navigate}
            />
          </div>
        ))}
        {searchingButNoServersFound && (
          <div className='flex justify-center align-middle mt-6'>
            <Text>{`Server \'${search}' not found`}</Text>
          </div>
        )}
      </div>
    </div>
  );
}
