import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout, refresh } from "../../actions/authentication";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { usePersonalUser } from "../../queries/accounts";
import type { AuthTokens } from "../../types/models";
import "./navbar.css";
import logo from "./logo.jpg";

export default function Navbar() {
  const isAuthenticated = useAppSelector(
    (state) => state.authentication.isAuthenticated,
  );
  const [menuExpanded, setMenuExpanded] = useState<boolean>(false);
  const user = usePersonalUser().data;
  const isLoading = useAppSelector((state) => state.authentication.isLoading);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    setMenuExpanded(false);
    navigate("/login");
  };

  const handleMenuToggle = () => {
    setMenuExpanded(!menuExpanded);
  };

  const handleCalculatorNavigation = () => {
    navigate("/calculator");
    setMenuExpanded(false);
  };

  const handleProfileNavigation = () => {
    if (!user?.username) return;
    navigate(`/user/${user.username}`);
    setMenuExpanded(false);
  };

  const handleSearchNavigation = () => {
    navigate("/search");
    setMenuExpanded(false);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: preserving the original auth-check timing; dependency cleanup belongs to a behavior pass
  useEffect(() => {
    const raw = localStorage.getItem("authToken");
    const authToken: AuthTokens | null = raw ? JSON.parse(raw) : null;

    const pathname = location.pathname;
    const isPasswordResetRoute =
      pathname.startsWith("/password-reset") ||
      pathname.startsWith("/password-reset-confirm");
    if (authToken?.refresh && !isAuthenticated) {
      dispatch(refresh(authToken.refresh));
    } else if (!isLoading && !isAuthenticated && !isPasswordResetRoute)
      navigate("/login");
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
