import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout, refresh } from "../../actions/authentication";
import "./navbar.css";
import logo from "./logo.jpg";

export default function Navbar(props: any) {
  const isAuthenticated = useSelector(
    (state: any) => state.authentication.isAuthenticated
  );
  const [menuExpanded, setMenuExpanded] = useState<boolean>(false);
  const user = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    setMenuExpanded(false);
    navigate("/login");
  };

  const handleUnitChange = () => {
    props.onToggleMetric(!props.metric);
    setMenuExpanded(false);
    navigate("/");
  };

  const handleMenuToggle = () => {
    setMenuExpanded(!menuExpanded);
  };

  const handleCalculatorNavigation = () => {
    navigate("/calculator");
    setMenuExpanded(false);
  };

  const handleProfileNavigation = () => {
    navigate(`/user/${user.username}`);
    setMenuExpanded(false);
  };

  const handleSearchNavigation = () => {
    navigate("/search");
    setMenuExpanded(false);
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
        <div className="dropdown-menu">
          <button className="dropdown-button" onClick={handleMenuToggle}>
            Menu
          </button>
          <div
            className={
              menuExpanded
                ? "dropdown-content dropdown-content-expanded"
                : "dropdown-content"
            }
          >
            <button
              onClick={handleProfileNavigation}
              className="menu-button home-button"
            >
              Profile
            </button>
            <button
              onClick={handleSearchNavigation}
              className="menu-button home-button"
            >
              Search
            </button>
            <button
              onClick={handleCalculatorNavigation}
              className="menu-button calculator-button"
            >
              Calculator
            </button>
            <button
              onClick={handleUnitChange}
              className="menu-button unit-button"
            >
              Change units
            </button>
            <button
              onClick={handleLogout}
              className="menu-button logout-button"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  return (
    <div className="navbar-container">
      <Link to="/login">
        <img src={logo} alt="logo" className="logo" />
      </Link>
    </div>
  );
}
