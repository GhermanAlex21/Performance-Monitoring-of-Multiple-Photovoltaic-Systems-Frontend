import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NavBar = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role');
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container px-5">
        <Link className="navbar-brand" to="/">Home</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarResponsive">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {userRole === 'ADMIN' && (
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownManage" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Manage
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdownManage">
                  <li><Link className="dropdown-item" to="/user-save">Add User</Link></li>
                  <li><Link className="dropdown-item" to="/series/add">Add Serie</Link></li>
                  <li><Link className="dropdown-item" to="/marca/add">Add Marca</Link></li>
                  <li><Link className="dropdown-item" to="/invertor/add">Add Invertor</Link></li>
                </ul>
              </li>
            )}
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownView" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                View
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdownView">
                <li><Link className="dropdown-item" to="/serie/all">All Series</Link></li>
                <li><Link className="dropdown-item" to="/marca/all">All Marcas</Link></li>
                <li><Link className="dropdown-item" to="/users/all">All Users</Link></li>
                <li><Link className="dropdown-item" to="/invertor/all">All Invertors</Link></li>
                <li><Link className="dropdown-item" to="/chart">Grafic</Link></li>
                <li><Link className="dropdown-item" to="/compare">Compare Inverters</Link></li>
                <li><Link className="dropdown-item" to="/my-inverters">My Inverters</Link></li> {/* Added this line */}
              </ul>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/my-profile">My Profile</Link>
            </li>
            <li className="nav-item">
              <button className="nav-link btn btn-link" onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;