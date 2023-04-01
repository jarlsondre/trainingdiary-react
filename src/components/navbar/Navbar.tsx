import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout, refresh } from "../../actions/authentication";
import "./navbar.css";
import logo from "./logo.jpg";
import { toggleMetric } from "../../actions/settings";
import { connect } from "react-redux";

function Navbar(props: any) {
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
          Logged in as: <br /> {user.username}
        </div>
        <button onClick={handleUnitChange} className="unit-button">
          {props.metric ? "kg" : "lbs"}
        </button>
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
              onClick={handleLogout}
              className="menu-button logout-button"
            >
              Logout
            </button>
          </div>
        </div>
        {/* <button onClick={handleLogout} className="logout-button">
          Logout
        </button> */}
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
