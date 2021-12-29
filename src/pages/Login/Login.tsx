import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";

type TokenResponse = {
  token: string;
};

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [remember, setRemember] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleLogin = () => {
    console.log(username);
    console.log(password);
    console.log(remember);
    const data = {
      username: username,
      password: password,
    };

    fetch("http://127.0.0.1:8000/log-in/", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      method: "POST",
    })
      .then(async (res) => {
        if (res.ok) {
          const jsonRes = (await res.json()) as unknown as TokenResponse;
          console.log(jsonRes);
          if (remember) {
            localStorage.setItem("token", jsonRes["token"]);
            sessionStorage.setItem("token", "");
          } else {
            sessionStorage.setItem("token", jsonRes["token"]);
            localStorage.setItem("token", "");
          }
          navigate("/");
        } else {
          console.log("login failed, probably incorrect credentials");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="login-page">
      <h1>Login</h1>
      <div className="input-container">
        <input
          type="text"
          id="username"
          name="username"
          onChange={(event) => {
            setUsername(event.target.value);
          }}
        ></input>

        <input
          type="password"
          id="password"
          name="password"
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        ></input>
      </div>
      <div className="remember-me-container">
        <input
          type="checkbox"
          id="remember-me"
          name="remember-me"
          onChange={(event) => {
            setRemember(!remember);
          }}
        ></input>
        <label htmlFor="remember-me">Remember me</label>
      </div>

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
