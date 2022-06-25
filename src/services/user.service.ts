import axios from "axios";

class UserService {
  async login(data: any) {
    return await axios
      .post("https://api.jarlstrainingdiary.com/api/token/", data)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async refresh(token: string) {
    return await axios
      .post("https://api.jarlstrainingdiary.com/api/token/refresh/", {
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
