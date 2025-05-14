import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useAuthContext } from '../../hooks/UseAuthContext';

const AdoptedCards = ({ pet, deleteBtnText, updateCards }) => {
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showApproved, setShowApproved] = useState(false);
  const [showDeletedSuccess, setShowDeletedSuccess] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuthContext();

  const formatTimeAgo = (updatedAt) => {
    const date = new Date(updatedAt);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const handleReject = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`http://localhost:5000/api/admin/delete/${pet._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });

      if (!response.ok) {
        setShowErrorPopup(true);
        throw new Error('Failed to delete pet');
      } else {
        setShowDeletedSuccess(true);
      }
    } catch (err) {
      setShowErrorPopup(true);
      console.error('Error deleting pet:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="admin-card">
      <div className="flex flex-col md:flex-row gap-4 items-start">
        <div className="w-full md:w-40 h-40 overflow-hidden rounded-lg shadow-md">
          <img
            src={`http://localhost:5000/images/${pet.filename}`}
            alt={pet.name}
            className="adopted-image"
          />
        </div>
        <div className="flex-1 space-y-1">
          <h3 className="text-xl font-semibold text-white">{pet.name}</h3>
          <p><b>Type:</b> {pet.type}</p>
          <p><b>Old Owner Name:</b> {pet.ownerName || 'Not available'}</p>
          <p><b>Old Owner Email:</b> {pet.ownerEmail || 'Not available'}</p>
          <p><b>Old Owner Phone:</b> {pet.ownerPhone || 'Not available'}</p>
          <p><b>New Owner Email:</b> {pet.newOwnerEmail}</p>
          <p><b>New Owner Phone:</b> {pet.newOwnerPhone}</p>


          <p><b>Adopted:</b> {formatTimeAgo(pet.updatedAt)}</p>
        </div>
        <div className="flex flex-col justify-start gap-2">
          <button onClick={handleReject} disabled={isDeleting} className="reject-btn">
            {isDeleting ? "Deleting..." : deleteBtnText}
          </button>
        </div>
      </div>

      {showErrorPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>❌ Oops! Connection Error</p>
          </div>
          <button onClick={() => setShowErrorPopup(false)} className="close-btn">Close</button>
        </div>
      )}

      {showApproved && (
        <div className="popup">
          <div className="popup-content">
            <p>✅ Approval Successful!</p>
            <p>
              Please contact <a href={`mailto:${pet.email}`}>{pet.email}</a> or <a href={`tel:${pet.phone}`}>{pet.phone}</a> to arrange pet transfer.
            </p>
          </div>
          <button onClick={() => { setShowApproved(false); updateCards(); }} className="close-btn">
            Close
          </button>
        </div>
      )}

      {showDeletedSuccess && (
        <div className="popup">
          <div className="popup-content">
            <p>🗑️ Deleted Successfully from Database.</p>
          </div>
          <button onClick={() => { setShowDeletedSuccess(false); updateCards(); }} className="close-btn">
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default AdoptedCards;
