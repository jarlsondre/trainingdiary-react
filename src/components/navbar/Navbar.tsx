import { useEffect } from "react";
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
  const user = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleUnitChange = () => {
    props.onToggleMetric(!props.metric);
    navigate("/");
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
