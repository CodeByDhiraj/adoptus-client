// 📁 src/Components/AdminPanel/ShopApproval.js
import React, { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '../../hooks/UseAuthContext';
import './AdminPanel.css';

const ShopApproval = () => {
  const { user } = useAuthContext();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchShops = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/shops/pending', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      setShops(data);
    } catch (err) {
      console.error('Error fetching pending shops:', err);
    } finally {
      setLoading(false);
    }
  }, [user.token]);

  useEffect(() => {
    fetchShops();
  }, [fetchShops]);

  const approveShop = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/admin/shops/approve/${id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${user.token}` },
      });
      fetchShops();
    } catch (err) {
      console.error('Approval failed:', err);
    }
  };

  const deleteShop = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/admin/shops/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` },
      });
      fetchShops();
    } catch (err) {
      console.error('Deletion failed:', err);
    }
  };

  return (
    <div className="admin-main">
      <h2 className="text-2xl font-bold text-center mb-6">🏬 Pending Shop Approvals</h2>

      {loading ? (
        <p className="text-center">Loading shops...</p>
      ) : shops.length > 0 ? (
        shops.map((shop) => (
          <div key={shop._id} className="admin-card">
            <h3 className="text-xl font-semibold">{shop.name}</h3>
            <p><strong>Type:</strong> {shop.type}</p>
            <p><strong>Area:</strong> {shop.area}</p>
            <p><strong>Address:</strong> {shop.address}</p>
            <p><strong>Phone:</strong> {shop.phone}</p>
            <div className="app-rej-btn">
              <button className="approve-btn" onClick={() => approveShop(shop._id)}>Approve</button>
              <button className="reject-btn" onClick={() => deleteShop(shop._id)}>Reject</button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center">No pending shop requests.</p>
      )}
    </div>
  );
};

export default ShopApproval;
