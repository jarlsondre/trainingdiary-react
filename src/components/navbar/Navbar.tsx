import React from "react";
import { Link } from "react-router-dom";
import "./navbar.css";

export default function Navbar() {
  return (
    <div className="navbar-container">
      <Link to="/" className="link-element">
        Home
      </Link>
      <Link to="/login" className="link-element">
        Login
      </Link>
    </div>
  );
}
