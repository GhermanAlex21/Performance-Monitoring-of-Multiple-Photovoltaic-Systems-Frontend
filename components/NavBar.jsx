import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/">
          Aplicația Mea
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/user-save">
                Add User
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/series/add">
                Add Serie
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/marca/add">
                Adauga Marca
              </NavLink>
            </li>
            {/* Alte link-uri pot fi adăugate aici */}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;