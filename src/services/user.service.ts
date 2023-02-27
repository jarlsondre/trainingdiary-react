import axios from "axios";
import http, { baseURL } from "../http-common";

class UserService {
  async login(data: any) {
    return await axios
      .post(baseURL + "/api/token/", data)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async fetchUser() {
    return await http
      .get(baseURL + "/accounts/")
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async refresh(token: string) {
    return await axios
      .post(baseURL + "/api/token/refresh/", {
        refresh: token,
      })
      .then((res: any) => {
        return res;
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

export default new UserService();
