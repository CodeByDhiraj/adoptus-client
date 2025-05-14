import React, { useEffect, useState } from 'react';
import './StatsSection.css';

const StatsSection = () => {
  const [stats, setStats] = useState({
    petsListed: 0,
    petsAdopted: 0,
    users: 0
  });

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/stats`)
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Error fetching stats:', err));
  }, []);
  

  return (
    <section className="stats-section">
      <h2 className="stats-title">🐾 Real-time Stats</h2>
      <div className="stats-container">
        <div className="stat-box">
          <span className="stat-icon">🐶</span>
          <p className="stat-label">Pets Listed</p>
          <h3 className="stat-count">{stats.petsListed}</h3>
        </div>
        <div className="stat-box">
          <span className="stat-icon">🏠</span>
          <p className="stat-label">Pets Adopted</p>
          <h3 className="stat-count">{stats.petsAdopted}</h3>
        </div>
        <div className="stat-box">
          <span className="stat-icon">👥</span>
          <p className="stat-label">Users Joined</p>
          <h3 className="stat-count">{stats.users}</h3>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
