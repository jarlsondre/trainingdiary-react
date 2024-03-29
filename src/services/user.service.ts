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

  async fetchPersonalUser() {
    return await http
      .get(baseURL + "/accounts/get-personal-account/")
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async fetchUser(username: string) {
    return await http
      .get(baseURL + "/accounts/get-account/?username=" + username)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async updateUser(id: string, data: any) {
    return await http
      .patch(baseURL + "/accounts/" + id + "/", data)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async searchUsers(cursor: string | null, searchString: string | null) {
    return await http
      .get(baseURL + "/accounts/?cursor=" + cursor + "&search=" + searchString)

      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async followUser(id: string) {
    return await http
      .post(baseURL + "/accounts/" + id + "/follow/")
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async unfollowUser(id: string) {
    return await http
      .post(baseURL + "/accounts/" + id + "/unfollow/")
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

  async resetPassword(email: string) {
    return await axios
      .post(baseURL + "/account/password-reset-request/", {
        email: email,
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  }

  async confirmPassword(username: string, token: string, newPassword: string) {
    return await axios
      .post(
        baseURL +
          "/account/password-reset-confirm/" +
          username +
          "/" +
          token +
          "/",
        {
          new_password: newPassword,
        }
      )
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  }
}

export default new UserService();
