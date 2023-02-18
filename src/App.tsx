import MainNavbar from './components/MainNavbar';
import Signin from './pages/auth/Signin';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import { defaultAuth } from './redux/auth/authSlice';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import Home from './pages/home/Home';
import Signup from './pages/auth/Signup';
import { HOME, SIGNIN } from './consts/routeNames';

function App() {
  const dispatch = useAppDispatch();
  const access_token = useAppSelector((state) => !!state.auth.access_token);

  function handleLogout() {
    dispatch(defaultAuth());
    localStorage.clear();
  }

  return (
    <Router>
      <MainNavbar handleLogout={handleLogout} />
      <Routes>
        <Route
          path="/"
          element={!access_token ? <Navigate to={SIGNIN} /> : <Home />}
        />
        <Route
          path="/signin"
          element={access_token ? <Navigate to={HOME} /> : <Signin />}
        />
        <Route
          path="/signup"
          element={access_token ? <Navigate to={HOME} /> : <Signup />}
        />
      </Routes>
    </Router>
  );
}

export default App;
