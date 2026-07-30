import axios from "axios";
import http, { baseURL } from "../http-common";
import type {
  AccountInterface,
  AccountSummaryInterface,
  AuthTokens,
  CursorPage,
} from "../types/models";

export interface LoginData {
  username: string;
  password: string;
}

class UserService {
  login(data: LoginData) {
    return axios.post<AuthTokens>(baseURL + "/api/token/", data);
  }

  fetchPersonalUser() {
    return http.get<AccountInterface>("/accounts/get-personal-account/");
  }

  fetchUser(username: string) {
    return http.get<AccountInterface>(
      "/accounts/get-account/?username=" + username,
    );
  }

  updateUser(id: number, data: Partial<AccountInterface>) {
    return http.patch<AccountInterface>("/accounts/" + id + "/", data);
  }

  searchUsers(cursor: string | null, searchString: string | null) {
    return http.get<CursorPage<AccountSummaryInterface>>(
      "/accounts/?cursor=" + cursor + "&search=" + searchString,
    );
  }

  followUser(id: number) {
    return http.post("/accounts/" + id + "/follow/");
  }

  unfollowUser(id: number) {
    return http.post("/accounts/" + id + "/unfollow/");
  }

  refresh(token: string) {
    return axios.post<AuthTokens>(baseURL + "/api/token/refresh/", {
      refresh: token,
    });
  }

  resetPassword(email: string) {
    return axios.post(baseURL + "/account/password-reset-request/", {
      email: email,
    });
  }

  confirmPassword(username: string, token: string, newPassword: string) {
    return axios.post(
      baseURL +
        "/account/password-reset-confirm/" +
        username +
        "/" +
        token +
        "/",
      {
        new_password: newPassword,
      },
    );
  }
}

export default new UserService();
