import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    Authorization: "token ab6c19df64ff379ce9583cc18be350f3e7a6839d",
    "Content-type": "application/json",
  },
});
