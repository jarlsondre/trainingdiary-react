import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout, refresh } from "../../auth/operations";
import { usePersonalUser } from "../../queries/accounts";
import { useAuthStore } from "../../stores/auth";
import type { AuthTokens } from "../../types/models";
import "./navbar.css";
import logo from "./logo.jpg";

export default function Navbar() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const [menuExpanded, setMenuExpanded] = useState<boolean>(false);
  const user = usePersonalUser().data;
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
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

  // Single redirect authority for the whole app (Navbar is always mounted).
  // While auth is settled/in-flight we do nothing; only once we know the user
  // is unauthenticated *and* nothing is pending do we act.
  useEffect(() => {
    // Authenticated, or a login/refresh is in flight — wait it out.
    if (isAuthenticated || isLoading) return;

    const raw = localStorage.getItem("authToken");
    const authToken: AuthTokens | null = raw ? JSON.parse(raw) : null;

    const pathname = location.pathname;
    const isPasswordResetRoute =
      pathname.startsWith("/password-reset") ||
      pathname.startsWith("/password-reset-confirm");

    if (authToken?.refresh) {
      // Stored token: silently refresh (sets isLoading, so this won't re-fire).
      refresh(authToken.refresh);
    } else if (!isPasswordResetRoute) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, location.pathname, navigate]);

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
