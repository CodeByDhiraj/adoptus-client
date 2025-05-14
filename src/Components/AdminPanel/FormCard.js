// ✅ Updated FormCard.js with Approve/Reject Sections and Mail Dependency

import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useAuthContext } from '../../hooks/UseAuthContext';

const FormCard = ({ form, pet, deleteBtnText, approveBtn, updateCards }) => {
  const [mailStatus, setMailStatus] = useState({
    approveMailSent: false,
    rejectMailSent: false
  });

  const [showPopup, setShowPopup] = useState({ error: false, approved: false, deleted: false, details: false, mailSent: false });
  const [loading, setLoading] = useState({
    deleting: false,
    approving: false,
    sendingApprove: false,
    sendingReject: false,
  });

  const { user } = useAuthContext();

  const formatTimeAgo = (timestamp) =>
    formatDistanceToNow(new Date(timestamp), { addSuffix: true });

  const handleApprove = async () => {
    setLoading(prev => ({ ...prev, approving: true }));
    try {
      const res = await fetch(`http://localhost:5000/api/form/approve/${form.petId}`, {
        method: 'PUT',
        body: JSON.stringify({
          formId: form._id,
          email: form.email,
          phone: form.phoneNo,
          status: 'Adopted'
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        }
      });

      if (!res.ok) return setShowPopup(p => ({ ...p, error: true }));

      await fetch(`http://localhost:5000/api/form/delete/many/${form.petId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` }
      });

      setShowPopup(p => ({ ...p, approved: true }));
    } catch (err) {
      setShowPopup(p => ({ ...p, error: true }));
    } finally {
      setLoading(prev => ({ ...prev, approving: false }));
    }
  };

  const handleReject = async () => {
    setLoading(prev => ({ ...prev, deleting: true }));
    try {
      const res = await fetch(`http://localhost:5000/api/form/reject/${form._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` }
      });

      if (!res.ok) throw new Error('Delete failed');

      setShowPopup(p => ({ ...p, deleted: true }));
    } catch (err) {
      setShowPopup(p => ({ ...p, error: true }));
    } finally {
      setLoading(prev => ({ ...prev, deleting: false }));
    }
  };

  const sendMail = async (type) => {
    const loadingKey = type === "approved" ? "sendingApprove" : "sendingReject";

    setLoading(prev => ({ ...prev, [loadingKey]: true }));

    try {
      const res = await fetch(`http://localhost:5000/api/form/send-mail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          id: form._id,
          type: type
        })
      });

      if (!res.ok) throw new Error('Mail failed');

      setShowPopup(p => ({ ...p, mailSent: true }));

      // ✅ Enable only one type of flow
      if (type === 'approved') {
        setMailStatus({ approveMailSent: true, rejectMailSent: false });
      } else {
        setMailStatus({ approveMailSent: false, rejectMailSent: true });
      }

    } catch (err) {
      setShowPopup(p => ({ ...p, error: true }));
    } finally {
      setLoading(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

  return (
    <div className="req-containter">
      <div className="pet-view-card">
        <div className="form-card-details">
          <p><strong>Email:</strong> {form.email}</p>
          <p><strong>Phone Number:</strong> {form.phoneNo}</p>
          <p><strong>Living Situation:</strong> {form.livingSituation}</p>
          <p><strong>Experience:</strong> {form.previousExperience}</p>
          <p><strong>Other Pets:</strong> {form.familyComposition}</p>
          <p className="text-gray-400 text-sm">{formatTimeAgo(form.updatedAt)}</p>
        </div>

        <div className="view-btn-center">
          <button onClick={() => setShowPopup(p => ({ ...p, details: true }))}>View Full</button>
        </div>

        <div className="app-rej-btn">
          <h4>✅ Approved Options</h4>
          <button onClick={() => sendMail("approved")} disabled={loading.sendingApprove}>
            {loading.sendingApprove ? 'Sending...' : 'Send Approve Mail'}
          </button>
          {approveBtn && mailStatus.approveMailSent && (
            <button onClick={handleApprove} disabled={loading.approving}>
              {loading.approving ? 'Approving...' : 'Approve'}
            </button>
          )}
        </div>

        <div className="app-rej-btn">
          <h4>❌ Rejection Options</h4>
          <button onClick={() => sendMail("rejected")} disabled={loading.sendingReject}>
            {loading.sendingReject ? 'Sending...' : 'Send Reject Mail'}
          </button>
          {mailStatus.rejectMailSent && (
            <button onClick={handleReject} disabled={loading.deleting}>
              {loading.deleting ? 'Rejecting...' : deleteBtnText}
            </button>
          )}
        </div>

        {/* All Popups Below */}
        {showPopup.error && (
          <div className="popup">
            <div className="popup-content"><p>❌ Something went wrong. Try again!</p></div>
            <button onClick={() => setShowPopup(p => ({ ...p, error: false }))} className="close-btn">
              Close <i className="fa fa-times"></i>
            </button>
          </div>
        )}

        {showPopup.approved && (
          <div className="popup">
            <div className="popup-content">
              <p>✅ Pet adopted successfully!</p>
              <p>Contact adopter at <a href={`mailto:${form.email}`}>{form.email}</a> or <a href={`tel:${form.phoneNo}`}>{form.phoneNo}</a>.</p>
            </div>
            <button onClick={() => { updateCards(); setShowPopup(p => ({ ...p, approved: false })); }} className="close-btn">
              Close <i className="fa fa-times"></i>
            </button>
          </div>
        )}

        {showPopup.deleted && (
          <div className="popup">
            <div className="popup-content"><p>🗑️ Request rejected and deleted!</p></div>
            <button onClick={() => { updateCards(); setShowPopup(p => ({ ...p, deleted: false })); }} className="close-btn">
              Close <i className="fa fa-times"></i>
            </button>
          </div>
        )}

        {showPopup.mailSent && (
          <div className="popup">
            <div className="popup-content"><p>📧 Mail sent successfully!</p></div>
            <button onClick={() => setShowPopup(p => ({ ...p, mailSent: false }))} className="close-btn">
              Close <i className="fa fa-times"></i>
            </button>
          </div>
        )}

        {showPopup.details && (
          <div className="popup">
            <div className="popup-content">
              <h2 className="mb-2">{pet.name}</h2>
              <p><strong>Email:</strong> {form.email}</p>
              <p><strong>Phone:</strong> {form.phoneNo}</p>
              <p><strong>Living Situation:</strong> {form.livingSituation}</p>
              <p><strong>Experience:</strong> {form.previousExperience}</p>
              <p><strong>Other Pets:</strong> {form.familyComposition}</p>
              <p>{formatTimeAgo(form.updatedAt)}</p>
            </div>
            <button onClick={() => setShowPopup(p => ({ ...p, details: false }))} className="close-btn">
              Close <i className="fa fa-times"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormCard;
