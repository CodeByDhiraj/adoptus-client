import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useAuthContext } from '../../hooks/UseAuthContext';
import './PetCards.css';

const PetCards = ({ pet, deleteBtnText, approveBtn, updateCards }) => {
  const [popup, setPopup] = useState({
    error: false,
    approved: false,
    deleted: false,
    justification: false,
  });
  const [loading, setLoading] = useState({ deleting: false, approving: false });
  const { user } = useAuthContext();

  const formatTimeAgo = (timestamp) =>
    formatDistanceToNow(new Date(timestamp), { addSuffix: true });

  const truncateText = (text, length = 40) =>
    text.length <= length ? text : text.substring(0, length) + '...';

  const handleApprove = async () => {
    setLoading(prev => ({ ...prev, approving: true }));
    try {
      const res = await fetch(`http://localhost:5000/approving/${pet._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ status: 'Approved' }),
      });

      if (!res.ok) throw new Error();
      setPopup(prev => ({ ...prev, approved: true }));
    } catch {
      setPopup(prev => ({ ...prev, error: true }));
    } finally {
      setLoading(prev => ({ ...prev, approving: false }));
    }
  };

  const handleDeletePet = async () => {
    setLoading(prev => ({ ...prev, deleting: true }));
    try {
      const res = await fetch(`http://localhost:5000/api/services/delete/${pet._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (!res.ok) throw new Error();
      setPopup(prev => ({ ...prev, deleted: true }));
    } catch {
      setPopup(prev => ({ ...prev, error: true }));
    } finally {
      setLoading(prev => ({ ...prev, deleting: false }));
    }
  };

  // ✅ Auto close popup for Approved and Deleted
  useEffect(() => {
    if (popup.deleted || popup.approved) {
      const timer = setTimeout(() => {
        if (popup.deleted) {
          setPopup(prev => ({ ...prev, deleted: false }));
          updateCards(); // Only when delete is done → updateCards call
        }
        if (popup.approved) {
          setPopup(prev => ({ ...prev, approved: false }));
          updateCards(); // Approved bhi update ho
        }
      }, 2000); // 2 seconds

      return () => clearTimeout(timer);
    }
  }, [popup.deleted, popup.approved]);

  return (
    <div className="req-containter">
      <div className="pet-view-card">
        <div className="pet-card-pic">
          <img src={`http://localhost:5000/images/${pet.filename}`} alt={pet.name} />
        </div>
        <div className="pet-card-details">
          <h2>{pet.name}</h2>
          <p><strong>Type:</strong> {pet.type}</p>
          <p><strong>Age:</strong> {pet.age}</p>
          <p><strong>Location:</strong> {pet.area}</p>
          <p><strong>Owner Email:</strong> {pet.email}</p>
          <p><strong>Owner Phone:</strong> {pet.phone}</p>
          <p>
            <strong>Justification:</strong>{' '}
            {truncateText(pet.justification)}{' '}
            {pet.justification.length > 40 && (
              <span
                onClick={() =>
                  setPopup(prev => ({ ...prev, justification: !prev.justification }))
                }
                className="read-more-btn"
              >
                Read More
              </span>
            )}
          </p>
          <p className="text-muted text-sm">{formatTimeAgo(pet.updatedAt)}</p>
        </div>

        <div className="app-rej-btn">
          <button
            onClick={handleDeletePet}
            disabled={loading.deleting || loading.approving}
          >
            {loading.deleting ? 'Deleting...' : deleteBtnText}
          </button>

          {approveBtn && (
            <button
              onClick={handleApprove}
              disabled={loading.deleting || loading.approving}
            >
              {loading.approving ? 'Approving...' : 'Approve'}
            </button>
          )}
        </div>

        {popup.justification && (
          <div className="popup">
            <div className="popup-content">
              <h4>Justification:</h4>
              <p>{pet.justification}</p>
            </div>
            <button
              onClick={() => setPopup(prev => ({ ...prev, justification: false }))}
              className="close-btn"
            >
              Close <i className="fa fa-times"></i>
            </button>
          </div>
        )}

        {popup.error && (
          <div className="popup">
            <div className="popup-content">
              <p>❌ Oops! Something went wrong.</p>
            </div>
            <button
              onClick={() => setPopup(prev => ({ ...prev, error: false }))}
              className="close-btn"
            >
              Close <i className="fa fa-times"></i>
            </button>
          </div>
        )}

        {popup.approved && (
          <div className="popup">
            <div className="popup-content">
              <p>✅ Pet approved successfully!</p>
              <p>
                Contact owner at{' '}
                <a href={`mailto:${pet.email}`}>{pet.email}</a> or{' '}
                <a href={`tel:${pet.phone}`}>{pet.phone}</a>.
              </p>
            </div>
          </div>
        )}

        {popup.deleted && (
          <div className="popup">
            <div className="popup-content">
              <p>🗑️ Pet post deleted successfully.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PetCards;
