import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminNavbar.css';

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/admin');
  };

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-logo">
        <img src="/logo192.png" alt="AdoptUs" />
        <span>Admin Panel</span>
      </div>
      <ul className="admin-navbar-links">
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/admin/facts">Manage Facts</Link></li>
        <li><Link to="/admin/shops">Shops</Link></li>
        <li><Link to="/admin/pets">Pets</Link></li>
        <li><Link to="/admin/adopt-requests">Adoptions</Link></li>
        <li><button className="admin-logout-btn" onClick={handleLogout}>Logout</button></li>
      </ul>
    </nav>
  );
};

export default AdminNavbar;
