import MainNavbar from './components/MainNavbar';
import Signin from './pages/auth/Signin';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
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

function App() {
  const dispatch = useAppDispatch();
  const access_token = useAppSelector((state) => !!state.auth.access_token);

  const [refreshTokens, { data, isLoading, isSuccess, isError }] =
    useRefreshTokensMutation();

  tryAutoLoginUseEffect(refreshTokens);

  storeDataIfAutoLoginSuccessUseEffect({
    data,
    defaultAuth,
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
    <Router>
      <MainNavbar handleLogout={() => handleLogout(dispatch, defaultAuth)} />
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
    </Router>
  );
}

export default App;
