import axios from "axios";
import dayjs from "dayjs";
import jwt_decode from "jwt-decode";

import { useAuthStore } from "./stores/auth";
import type { AuthTokens } from "./types/models";

// API base URL: defaults to production so a build is always prod-safe. For local
// dev, .env.development sets REACT_APP_API_URL=http://localhost:8000 (CRA loads it
// automatically on `npm start`; production builds fall back to the URL below).
export const baseURL =
  process.env.REACT_APP_API_URL ?? "https://api.jarlstrainingdiary.com";

const readAuthToken = (): AuthTokens | null => {
  const raw = localStorage.getItem("authToken");
  return raw ? (JSON.parse(raw) as AuthTokens) : null;
};

// Fail stuck requests (e.g. offline) so optimistic mutations actually roll back
// instead of hanging forever.
const REQUEST_TIMEOUT_MS = 20000;

const axiosInstance = axios.create({
  baseURL,
  timeout: REQUEST_TIMEOUT_MS,
  headers: {
    Authorization: `JWT ${readAuthToken()?.access}`,
    "Content-type": "application/json",
  },
});

axiosInstance.interceptors.request.use(async (req) => {
  // Fail fast when the device is offline, so mutations roll back (and queries
  // error) immediately instead of hanging until the timeout.
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    throw new Error("You appear to be offline.");
  }

  // always reading the token from localstorage
  const authToken = readAuthToken();

  // Logged out: flag it and send the request without credentials. (This used
  // to fall through into jwt_decode(undefined) and crash every request.)
  if (!authToken) {
    useAuthStore.getState().loggedOut();
    return req;
  }

  // if there is a token, we want to check if it has expired and then
  // try to refresh it
  const user = jwt_decode<{ exp: number }>(authToken.access);
  const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

  if (!isExpired) {
    if (req.headers) req.headers.Authorization = `JWT ${authToken.access}`;
    return req;
  }

  try {
    const res = await axios.post<AuthTokens>(
      `${baseURL}/api/token/refresh/`,
      { refresh: authToken.refresh },
      { timeout: REQUEST_TIMEOUT_MS },
    );
    localStorage.setItem("authToken", JSON.stringify(res.data));
    if (req.headers) req.headers.Authorization = `JWT ${res.data.access}`;
    return req;
  } catch (error) {
    // Refresh failed (expired/invalid token, or the server hung) — don't then
    // send a request we already know can't succeed. Sign out and reject now so
    // the caller's error handling runs immediately, not after a second timeout.
    useAuthStore.getState().loggedOut();
    throw error;
  }
});

export default axiosInstance;
