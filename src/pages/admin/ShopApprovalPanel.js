// ✅ ShopApprovalPanel.js (Final Version with Toasts & Role Check)
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './AdminShopPanel.css';

const ShopApprovalPanel = () => {
  const [shops, setShops] = useState([]);
  const [editShopId, setEditShopId] = useState(null);
  const [editData, setEditData] = useState({ name: '', area: '', category: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
      toast.error("Access denied. Admins only.");
      navigate('/');
    } else {
      fetchShops(user.token);
    }
  }, [navigate]);

  const fetchShops = async (token) => {
    try {
      const res = await axios.get('/api/shops?approved=false', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShops(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch shops');
    }
  };

  const handleApprove = async (id) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await axios.patch(`/api/shops/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setShops(prev => prev.filter(s => s._id !== id));
      toast.success('✅ Shop approved');
    } catch (err) {
      toast.error('❌ Approval failed');
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to reject this shop?")) return;
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await axios.delete(`/api/shops/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setShops(prev => prev.filter(s => s._id !== id));
      toast.success('❌ Shop rejected');
    } catch (err) {
      toast.error('⚠️ Rejection failed');
    }
  };

  const handleEdit = (shop) => {
    setEditShopId(shop._id);
    setEditData({ name: shop.name, area: shop.area, category: shop.category });
  };

  const handleEditSave = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await axios.put(`/api/shops/${editShopId}`, editData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setShops(prev => prev.map(s => s._id === editShopId ? { ...s, ...editData } : s));
      setEditShopId(null);
      toast.success('✏️ Changes saved');
    } catch (err) {
      toast.error('❌ Failed to save changes');
    }
  };

  return (
    <div className="approval-panel">
      <h2>🛠 Pending Shop Approvals</h2>
      {shops.length === 0 ? <p>No shops pending approval</p> : (
        shops.map(shop => (
          <div key={shop._id} className="shop-card">
            {editShopId === shop._id ? (
              <>
                <input
                  value={editData.name}
                  onChange={e => setEditData({ ...editData, name: e.target.value })}
                />
                <input
                  value={editData.area}
                  onChange={e => setEditData({ ...editData, area: e.target.value })}
                />
                <input
                  value={editData.category}
                  onChange={e => setEditData({ ...editData, category: e.target.value })}
                />
                <button onClick={handleEditSave}>💾 Save</button>
              </>
            ) : (
              <>
                <h4>{shop.name}</h4>
                <p>{shop.area} | {shop.category}</p>
                <div className="actions">
                  <button onClick={() => handleApprove(shop._id)}>✅ Approve</button>
                  <button onClick={() => handleReject(shop._id)}>❌ Reject</button>
                  <button onClick={() => handleEdit(shop)}>✏️ Edit</button>
                </div>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ShopApprovalPanel;
