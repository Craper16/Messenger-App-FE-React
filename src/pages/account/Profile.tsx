import { useState } from 'react';
import {
  Box,
  Button,
  SimpleGrid,
  List,
  ListItem,
  Menu,
  MenuButton,
  MenuItem,
  Divider,
  MenuList,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from '../../components/ErrorMessage';
import {
  CHANGE_PASSWORD,
  SERVER_NAV,
  UPDATE_USER_INFO,
} from '../../consts/routeNames';
import { useGetUserDataQuery } from '../../redux/api/authApi';
import { setUserInfo } from '../../redux/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { storeAuthDataOnUserInfoChange } from '../../utils/storeAuthDataOnUserInfoChange';
import { Text } from '@chakra-ui/react';
import { useFetchUserServersQuery } from '../../redux/api/serverApi';
import { setUserServersAndJoinServers } from '../../utils/setUserServersAndJoinServers';
import { setUserServers } from '../../redux/server/serverSlice';
import { MdList } from 'react-icons/md';
import ServerRowItem from '../../components/Server/ServerRowItem';

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { userServers } = useAppSelector((state) => state.server);

  const { displayName, email, phoneNumber, userId } = useAppSelector(
    (state) => state.auth
  );

  const userServersLengthBiggerThanFive = userServers.length > 5;
  const [userServersTooLong, setUserServersTooLong] = useState(() =>
    userServersLengthBiggerThanFive ? true : false
  );

  const getUserDataQuery = useGetUserDataQuery();
  const getUserServers = useFetchUserServersQuery();

  const serversToShow = userServersTooLong
    ? userServers.slice(0, 5)
    : userServers;

  setUserServersAndJoinServers({
    dispatch,
    setUserServers,
    data: getUserServers.data,
  });

  storeAuthDataOnUserInfoChange({
    data: getUserDataQuery.data,
    dispatch,
    isSuccess: getUserDataQuery.isSuccess,
    navigate: undefined,
    setUserInfo,
    toast: undefined,
  });

  if (getUserDataQuery.isError || getUserServers.isError) {
    return (
      <ErrorMessage
        message={
          (getUserDataQuery.error as { message: string; status: number })
            .message ||
          (getUserServers.error as { message: string; status: number }).message
        }
      />
    );
  }

  return (
    <div className="ml-12 mt-12">
      <div className="ml-auto m-auto mr-auto justify-center align-middle">
        <Text>Display Name</Text>
        <div>{displayName}</div>
        <div>{email}</div>
        <div>{phoneNumber}</div>
        <Button onClick={() => navigate(CHANGE_PASSWORD)}>
          Change Password
        </Button>
        <Button onClick={() => navigate(UPDATE_USER_INFO)}>Update Info</Button>
        <Text>Your Servers: </Text>
        {serversToShow.map((server) => (
          <ServerRowItem
            key={server._id}
            navigate={navigate}
            server={server}
            userId={userId!}
          />
        ))}
        {userServersLengthBiggerThanFive && (
          <Button
            onClick={() =>
              setUserServersTooLong(
                (prevUserServersTooLong) => !prevUserServersTooLong
              )
            }
          >
            {userServersTooLong ? 'Show More' : 'Show Less'}
          </Button>
        )}
      </div>
    </div>
  );
}
