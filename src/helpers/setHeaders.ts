import axios from 'axios';
import dayjs from 'dayjs';
import jwtDecode from 'jwt-decode';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../consts/constants';
import { AuthModel } from '../redux/auth/authSlice';

export const setHeaders = async (headers: Headers) => {
  const access_token = localStorage.getItem(ACCESS_TOKEN);
  const refresh_token = localStorage.getItem(REFRESH_TOKEN);

  if (access_token && refresh_token) {
    const user: { exp: number } = jwtDecode(access_token);
    const isAccessTokenExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

    if (!isAccessTokenExpired)
      return headers.set('Authorization', `Bearer ${access_token}`);

    const response = await axios.post(
      `${import.meta.env.VITE_API_KEY}/auth/refresh`,
      { refresh_token: refresh_token }
    );
    const data: AuthModel = response.data;

    await localStorage.setItem(ACCESS_TOKEN, data.access_token!);
    await localStorage.setItem(REFRESH_TOKEN, data.refresh_token!);

    return headers.set('Authorization', `Bearer ${data?.access_token}`);
  }
};
