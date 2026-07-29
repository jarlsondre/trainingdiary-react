import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import { login } from "../../actions/authentication";
import { useAppDispatch, useAppSelector } from "../../hooks";

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useAppSelector(
    (state) => state.authentication.isAuthenticated,
  );

  const isLoading = useAppSelector((state) => state.authentication.isLoading);
  const loginFailed = useAppSelector(
    (state) => state.authentication.loginFailed,
  );

  const handleLogin = () => {
    dispatch(login({ username: username, password: password }));
  };

  const handleReset = () => {
    navigate("/password-reset");
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: navigate is stable; matching the original redirect timing
  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated]);

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
