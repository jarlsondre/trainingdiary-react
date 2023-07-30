import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout, refresh } from "../../actions/authentication";
import { searchUsers } from "../../actions/searchUsers";
import "./navbar.css";
import logo from "./logo.jpg";
import { toggleMetric } from "../../actions/settings";
import { connect } from "react-redux";

function Navbar(props: any) {
  const isAuthenticated = useSelector(
    (state: any) => state.authentication.isAuthenticated
  );
  const [menuExpanded, setMenuExpanded] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>(""); // Step 1: State to hold the search input value
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

  const handleHomeNavigation = () => {
    navigate("/");
    setMenuExpanded(false);
  };

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(event.target.value); // Step 2: Update the search input value
  };

  const handleSearch = () => {
    dispatch(searchUsers("", searchTerm)); // Step 3: Pass the search input value to searchUsers
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
        <div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchInputChange}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
        <div>
          Logged in as: <br /> {user.username}
        </div>
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
              onClick={handleHomeNavigation}
              className="menu-button home-button"
            >
              Home
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

const mapDispatchToProps = (dispatch: any) => {
  return {
    onToggleMetric: (value: boolean) => {
      dispatch(toggleMetric(value));
    },
  };
};
const mapStateToProps = (state: any) => {
  return {
    metric: state.settings.metric,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
