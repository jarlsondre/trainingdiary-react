import React from "react";
import { Link } from "react-router-dom";
import "./login.css";

export default function Login() {
  return (
    <div className="login-page">
      <Link to="/">Home</Link>
      <h1>Login</h1>
      <div className="input-container">
        <input type="text" id="username" name="username"></input>
        <input type="password" id="password" name="password"></input>
      </div>
      <button>Login</button>
    </div>
  );
}
