import MainNavbar from './components/MainNavbar';
import Signin from './pages/auth/Signin';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { defaultAuth, setUser } from './redux/auth/authSlice';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import Home from './pages/home/Home';
import Signup from './pages/auth/Signup';
import {
  CHANGE_PASSWORD,
  HOME,
  PROFILE,
  SIGNIN,
  SIGNUP,
  UPDATE_USER_INFO,
  BROWSE_SERVERS,
  SEARCH_SERVERS,
  SERVER,
  MANAGE_SERVER,
} from './consts/routeNames';
import { useRefreshTokensMutation } from './redux/api/authApi';
import Error from './pages/Error';
import StartupPage from './pages/StartupPage';
import Profile from './pages/account/Profile';
import ChangePassword from './pages/account/ChangePassword';
import { handleLogout } from './utils/handleLogout';
import { tryAutoLoginUseEffect } from './utils/tryAutoLogin';
import { storeDataIfAutoLoginSuccessUseEffect } from './utils/storeDataIfAutoLoginSuccess';
import UpdateUserInfo from './pages/account/UpdateUserInfo';
import { defaultServers, leaveServer } from './redux/server/serverSlice';
import { defaultSocket } from './redux/socket/socketSlice';
import BrowseServers from './pages/home/servers/BrowseServers';
import SearchServers from './pages/home/servers/SearchServers';
import Server from './pages/home/servers/Server';
import ManageServer from './pages/home/servers/ManageServer';
import { useToast } from '@chakra-ui/react';
import { kickedUserIsLoggedIn } from './utils/kickedUserIsLoggedIn';
import { receivedMessageNotification } from './utils/receivedMessageNotification';
import { MdMessage } from 'react-icons/md';

export interface kickedUserDataReceived {
  serverId: string;
  userId: string;
}

const App = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { access_token, userId } = useAppSelector((state) => state.auth);
  const socket = useAppSelector((state) => state.socket.socket);

  const [refreshTokens, { data, isLoading, isSuccess, isError }] =
    useRefreshTokensMutation();

  receivedMessageNotification({ socket, toast, toastIcon: <MdMessage /> });

  kickedUserIsLoggedIn({
    dispatch,
    leaveServer,
    navigate,
    socket,
    toast,
    userId,
  });

  tryAutoLoginUseEffect(refreshTokens);

  storeDataIfAutoLoginSuccessUseEffect({
    data,
    defaultAuth,
    defaultServers,
    defaultSocket,
    dispatch,
    handleLogout,
    isError,
    isSuccess,
    setUser,
  });

  if (isLoading) {
    return <StartupPage />;
  }

  return (
    <>
      <MainNavbar
        handleLogout={() =>
          handleLogout({
            defaultAuth,
            dispatch,
            defaultServers,
            defaultSocket,
          })
        }
      />
      <Routes>
        <Route
          path={HOME}
          element={!access_token ? <Navigate to={SIGNIN} /> : <Home />}
        />
        <Route
          path={PROFILE}
          element={!access_token ? <Navigate to={SIGNIN} /> : <Profile />}
        />
        <Route
          path={CHANGE_PASSWORD}
          element={
            !access_token ? <Navigate to={SIGNIN} /> : <ChangePassword />
          }
        />
        <Route
          path={UPDATE_USER_INFO}
          element={
            !access_token ? <Navigate to={SIGNIN} /> : <UpdateUserInfo />
          }
        />
        <Route
          path={MANAGE_SERVER}
          element={!access_token ? <Navigate to={SIGNIN} /> : <ManageServer />}
        />
        <Route
          path={BROWSE_SERVERS}
          element={!access_token ? <Navigate to={SIGNIN} /> : <BrowseServers />}
        />
        <Route
          path={SEARCH_SERVERS}
          element={!access_token ? <Navigate to={SIGNIN} /> : <SearchServers />}
        />
        <Route
          path={SERVER}
          element={!access_token ? <Navigate to={SIGNIN} /> : <Server />}
        />
        <Route
          path={SIGNIN}
          element={access_token ? <Navigate to={HOME} /> : <Signin />}
        />
        <Route
          path={SIGNUP}
          element={access_token ? <Navigate to={HOME} /> : <Signup />}
        />
        <Route
          path="*"
          element={<Error />}
        />
      </Routes>
    </>
  );
};

export default App;
