// routes
import { PATH_AUTH } from '../routes/paths';
//
import axios from './axios';

// ----------------------------------------------------------------------

const isValidToken = (accessToken: string, expire_at: string | null) => {
  if (!accessToken || !expire_at) {
    return false;
  }
  const date = new Date(expire_at);
  // Get the Unix timestamp in seconds
  const expirationTime = Math.floor(date.getTime() / 1000);

  const currentTime = Date.now() / 1000;

  return expirationTime > currentTime;
};

const handleTokenExpired = (exp: number) => {
  // eslint-disable-next-line prefer-const
  let expiredTimer;

  const currentTime = Date.now();

  // Test token expires after 10s
  // const timeLeft = currentTime + 10000 - currentTime; // ~10s
  const timeLeft = exp * 10000 - currentTime;

  clearTimeout(expiredTimer);

  expiredTimer = setTimeout(() => {
    alert('Token expirado!');

    localStorage.removeItem('accessToken');
    localStorage.removeItem('expire_at');

    window.location.href = PATH_AUTH.login;
  }, timeLeft);
};

const setSession = (accessToken: string | null, expire_at: string | null) => {
  if (accessToken && expire_at) {
    localStorage.setItem('accessToken', accessToken);
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

    // This function below will handle when token is expired
    const date = new Date(expire_at);
  // Get the Unix timestamp in seconds
    const expirationTime = Math.floor(date.getTime() / 1000);
    // const { exp } = jwtDecode<{ exp: number }>(accessToken); // ~5 days by minimals server
    handleTokenExpired(expirationTime);
  } else {
    localStorage.removeItem('accessToken');
    delete axios.defaults.headers.common.Authorization;
  }
};

export { isValidToken, setSession };
