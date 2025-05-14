import React, { useState } from 'react';
import PostingPets from './PostingPets';
import AdoptingRequests from './AdoptingRequests';
import AdoptedHistory from './AdoptedHistory';
import ApprovedRequests from './ApprovedRequests';
import Dashboard from './Dashboard';
import ShopApprovalPanel from './ShopApprovalPanel';
import FactManager from './FactManager';
import './AdminPanel.css';
import { useNavigate } from 'react-router-dom';

const AdminScreen = () => {
  const [screen, setScreen] = useState('dashboard');
  const navigate = useNavigate();

  const menuItems = [
    { key: 'dashboard', label: '📊 Dashboard' },
    { key: 'factManager', label: '📚 Manage Facts' },
    { key: 'postingPet', label: '📬 Pet Requests' },
    { key: 'approvedRequests', label: '✅ Approved Pets' },
    { key: 'adoptingPet', label: '🐾 Adoption Requests' },
    { key: 'adoptedHistory', label: '📁 Adopted History' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/admin'); // Go back to Admin Login
  };

  const admin = JSON.parse(localStorage.getItem('user'));

  const handleGoHome = () => {
    navigate('/'); // ✅ Go to Home Page
  };

  return (
    <div className="admin-panel">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <h3>Admin Panel</h3>
        <p className="admin-user">👤 {admin?.userName || 'Admin'}</p>
        <ul>
          {menuItems.map((item) => (
            <li
              key={item.key}
              className={screen === item.key ? 'active' : ''}
              onClick={() => setScreen(item.key)}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </div>
      <div className="logout-home-buttons">
  <button className="logout-btn" onClick={handleLogout}>
    🚪 Logout
  </button>

  <button className="logout-btn" onClick={handleGoHome}>
    🏠 Home
  </button>
</div>


      {/* Main Section */}
      <div className="admin-main">
        {screen === 'dashboard' && <Dashboard />}
        {screen === 'factManager' && <FactManager />} 
        {screen === 'postingPet' && <PostingPets />}
        {screen === 'approvedRequests' && <ApprovedRequests />}
        {screen === 'adoptingPet' && <AdoptingRequests />}
        {screen === 'adoptedHistory' && <AdoptedHistory />}
        {screen === 'shopApproval' && <ShopApprovalPanel />}
      </div>
    </div>
  );
};

export default AdminScreen;