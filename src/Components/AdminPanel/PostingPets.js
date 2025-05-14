import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../hooks/UseAuthContext';
import './PostingPets.css';

const PostingPets = () => {
  const [pendingPets, setPendingPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState({ show: false, message: '' });
  const { user } = useAuthContext();

  const fetchPendingPets = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/services/pending", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await res.json();
      setPendingPets(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingPets();
  }, [user]);

  const showPopup = (message) => {
    setPopup({ show: true, message });
    setTimeout(() => setPopup({ show: false, message: '' }), 2500);
  };

  const handleApprove = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/services/approving/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ status: "Approved" }),
      });

      if (!res.ok) throw new Error("Approval Failed");

      showPopup("✅ Pet Approved Successfully!");
      fetchPendingPets();
    } catch (error) {
      console.error(error);
      showPopup("❌ Approval Failed");
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/services/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!res.ok) throw new Error("Rejection Failed");

      showPopup("🗑️ Pet Rejected & Deleted!");
      fetchPendingPets();
    } catch (error) {
      console.error(error);
      showPopup("❌ Rejection Failed");
    }
};


  return (
    <div className="admin-main">
      <h2 className="text-center text-2xl font-semibold mb-6">📩 Pet Requests</h2>

      {loading ? (
        <p>Loading...</p>
      ) : pendingPets.length > 0 ? (
        pendingPets.map((pet) => (
          <div key={pet._id} className="admin-card">
            <p><strong>Name:</strong> {pet.name}</p>
            <p><strong>Type:</strong> {pet.type}</p>
            <p><strong>Location:</strong> {pet.area}</p>
            <p><strong>Owner:</strong> {pet.ownerName}</p>
            <p><strong>Email:</strong> {pet.email}</p>
            <p><strong>Phone:</strong> {pet.phone}</p>
            <div>
              <button className="approve-btn" onClick={() => handleApprove(pet._id)}>Approve</button>
              <button className="reject-btn" onClick={() => handleReject(pet._id)}>Reject</button>
            </div>
          </div>
        ))
      ) : (
        <p>No pet posting requests available.</p>
      )}

      {/* ✅ Popup */}
      {popup.show && (
        <div className="popup">
          <div className="popup-content">
            <p>{popup.message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostingPets;
