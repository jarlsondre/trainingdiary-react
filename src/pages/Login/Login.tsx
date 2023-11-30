import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../actions/authentication";

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useSelector(
    (state: any) => state.authentication.isAuthenticated
  );

  const isLoading = useSelector((state: any) => state.authentication.isLoading);
  const loginFailed = useSelector(
    (state: any) => state.authentication.loginFailed
  );

  const handleLogin = async () => {
    const data = {
      username: username,
      password: password,
    };
    dispatch(login(data));
  };

  const handleReset = () => {
    navigate("/password-reset");
  };

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
