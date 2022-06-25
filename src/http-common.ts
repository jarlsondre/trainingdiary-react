import axios from "axios";
import jwt_decode from "jwt-decode";
import dayjs from "dayjs";
import store from "./store";
import { AUTH_ERROR } from "./actions/types";

const baseURL = "https://api.jarlstrainingdiary.com";

let authToken = localStorage.getItem("authToken")
  ? JSON.parse(localStorage.getItem("authToken")!)
  : null;

const axiosInstance = axios.create({
  baseURL,
  headers: {
    Authorization: `JWT ${authToken?.access}`,
    "Content-type": "application/json",
  },
});

axiosInstance.interceptors.request.use(async (req) => {
  // always reading the token from localstorage
  authToken = localStorage.getItem("authToken")
    ? JSON.parse(localStorage.getItem("authToken")!)
    : null;

  // if there is no token, we call AUTH_ERROR
  if (!authToken) store.dispatch({ type: AUTH_ERROR, payload: null });

  // if there is a token, we want to check if it has expired and then
  // try to refresh it

  const user: any = jwt_decode(authToken?.access);
  const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

  if (!isExpired) {
    req.headers!.Authorization = `JWT ${authToken?.access}`;
    return req;
  }

  await axios
    .post(`${baseURL}/api/token/refresh/`, {
      refresh: authToken.refresh,
    })
    .then((res: any) => {
      localStorage.setItem("authToken", JSON.stringify(res.data));
      req.headers!.Authorization = `JWT ${res.data.access}`;
    })
    .catch((err) => {
      console.log("refreshing token failed");
      store.dispatch({ type: AUTH_ERROR, payload: null });
    });
  return req;
});

export default axiosInstance;
