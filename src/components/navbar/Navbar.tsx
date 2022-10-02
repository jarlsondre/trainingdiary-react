import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout, refresh } from "../../actions/authentication";
import "./navbar.css";
import logo from "./logo.jpg";

export default function Navbar() {
  const isAuthenticated = useSelector(
    (state: any) => state.authentication.isAuthenticated
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  useEffect(() => {
    let authToken = localStorage.getItem("authToken")
      ? JSON.parse(localStorage.getItem("authToken")!)
      : null;
    if (authToken && authToken.refresh && !isAuthenticated) {
      dispatch(refresh(authToken!.refresh));
    } else navigate("/login");
  }, [isAuthenticated]);

  if (isAuthenticated)
    return (
      <div className="navbar-container">
        <Link to="/">
          <img src={logo} alt="logo" className="logo" />
        </Link>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
    );
  return (
    <div className="navbar-container">
      <Link to="/login" className="link-element">
        Login
      </Link>
    </div>
  );
}
