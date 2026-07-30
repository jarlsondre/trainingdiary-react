import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import { login } from "../../auth/operations";
import { useAuthStore } from "../../stores/auth";

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const loginFailed = useAuthStore((state) => state.loginFailed);

  const handleLogin = () => {
    login({ username: username, password: password });
  };

  const handleReset = () => {
    navigate("/password-reset");
  };

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  return (
    <div className="login-page">
      <h1>Login</h1>
      <div className="input-container">
        <input
          type="text"
          id="username"
          name="username"
          autoCapitalize="none"
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
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleLogin();
            }
          }}
        ></input>
      </div>

      {isLoading && <p>Logging in...</p>}
      {loginFailed && <p>Wrong username or password</p>}

      <button className="login-button" onClick={handleLogin}>
        Login
      </button>
      <button className="reset-button" onClick={handleReset}>
        Reset Password
      </button>
    </div>
  );
}
