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
} from './consts/routeNames';
import { useRefreshTokensMutation } from './redux/api/authApi';
import Error from './pages/Error';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './consts/constants';
import { useEffect } from 'react';
import StartupPage from './pages/StartupPage';
import Profile from './pages/account/Profile';
import ChangePassword from './pages/account/ChangePassword';

function App() {
  const dispatch = useAppDispatch();
  const access_token = useAppSelector((state) => !!state.auth.access_token);

  const [refreshTokens, { data, isLoading, isSuccess }] =
    useRefreshTokensMutation();

  function handleLogout() {
    dispatch(defaultAuth());
    localStorage.clear();
  }

  async function tryAutoLogin() {
    const refresh_token = localStorage.getItem(REFRESH_TOKEN);

    if (refresh_token) {
      return await refreshTokens({ refresh_token });
    }
    return;
  }

  async function storeDataIfAutoLoginSuccess() {
    return (
      dispatch(setUser({ ...data! })),
      localStorage.setItem(ACCESS_TOKEN, data?.access_token!),
      localStorage.setItem(REFRESH_TOKEN, data?.refresh_token!)
    );
  }

  useEffect(() => {
    tryAutoLogin();
  }, []);

  useEffect(() => {
    if (isSuccess) {
      storeDataIfAutoLoginSuccess();
    }
  }, [isSuccess]);

  if (isLoading) {
    return <StartupPage />;
  }

  return (
    <Router>
      <MainNavbar handleLogout={handleLogout} />
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
