import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({ users: 0, listed: 0, adopted: 0 });
  const [petTypes, setPetTypes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const [statsRes, petRes] = await Promise.all([
          fetch('http://localhost:5000/api/admin/stats', { headers }),
          fetch('http://localhost:5000/api/admin/pet-types', { headers }),
        ]);

        const statsData = await statsRes.json();
        if (!statsRes.ok) throw new Error(statsData.error || 'Failed to load stats');
        setStats(statsData);

        const petTypeData = await petRes.json();
        if (!petRes.ok) throw new Error(petTypeData.error || 'Failed to load pet types');

        const formatted = petTypeData.map(item => ({
          name: item._id,
          value: item.count,
        }));
        setPetTypes(formatted);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchStats();
  }, []);

  const COLORS = ['#00C49F', '#FFBB28', '#FF8042', '#A8E6CF', '#DCE775', '#8884d8'];

  return (
    <div className="admin-main">
      <h2 className="text-center text-2xl font-semibold mb-6">📊 Dashboard Overview</h2>
      {error ? (
        <p className="text-red-500 text-center font-medium">{error}</p>
      ) : (
        <>
          <div className="dashboard-stats">
            <div className="stat-card">
              <h4>👥 Users</h4>
              <p>{stats.users}</p>
            </div>
            <div className="stat-card">
              <h4>🐾 Pets Listed</h4>
              <p>{stats.listed}</p>
            </div>
            <div className="stat-card">
              <h4>✅ Pets Adopted</h4>
              <p>{stats.adopted}</p>
            </div>
          </div>

          <div className="dashboard-pie-section">
            <h3 className="text-lg font-semibold mb-3">🐶 Pet Types Distribution</h3>
            {petTypes.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={petTypes}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    dataKey="value"
                  >
                    {petTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-400">No pet data available.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
