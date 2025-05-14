import React, { useEffect, useState } from 'react';
import axios from '../../axiosInstance';
import './FactManager.css';

const FactManager = () => {
  const [newFact, setNewFact] = useState('');
  const [activeFacts, setActiveFacts] = useState([]);
  const [history, setHistory] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editFactText, setEditFactText] = useState('');
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({ show: false, message: '' });
  const [confirmPopup, setConfirmPopup] = useState({ show: false, text: '', onConfirm: null });

  const fetchActiveFacts = async () => {
    try {
      const res = await axios.get('/api/facts/recent');
      setActiveFacts(res.data);
    } catch {
      setActiveFacts([]);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get('/api/facts/history');
      setHistory(res.data);
    } catch {
      setHistory([]);
    }
  };

  useEffect(() => {
    fetchActiveFacts();
    fetchHistory();
  }, []);

  const showPopup = (message) => {
    setPopup({ show: true, message });
  };

  const closePopup = () => {
    setPopup({ show: false, message: '' });
  };

  const showConfirm = (text, onConfirm) => {
    setConfirmPopup({ show: true, text, onConfirm });
  };

  const hideConfirm = () => {
    setConfirmPopup({ show: false, text: '', onConfirm: null });
  };

  const addFact = () => {
    if (!newFact) return;
    setLoading(true);
    axios.post('/api/facts/add-fact', { fact: newFact })
      .then(() => {
        showPopup('Fact added successfully!');
        setNewFact('');
        fetchActiveFacts();
        fetchHistory();
      })
      .finally(() => setLoading(false));
  };

  const updateFact = (id) => {
    if (!editFactText) return;
    setLoading(true);
    axios.patch(`/api/facts/edit-active/${id}`, { fact: editFactText })
      .then(() => {
        showPopup('Fact updated successfully!');
        setEditIndex(null);
        fetchActiveFacts();
      })
      .finally(() => setLoading(false));
  };

  const deleteActiveFact = (id) => {
    showConfirm('Are you sure to delete this active fact?', async () => {
      setLoading(true);
      try {
        await axios.delete(`/api/facts/delete-active/${id}`);
        showPopup('Active fact deleted successfully!');
        fetchActiveFacts();
      } catch {
        showPopup('Error deleting active fact.');
      }
      setLoading(false);
    });
  };

  const deleteHistoryFact = (id) => {
    showConfirm('Are you sure to delete this history fact?', async () => {
      setLoading(true);
      try {
        await axios.delete(`/api/facts/delete-history/${id}`);
        showPopup('History fact deleted successfully!');
        fetchHistory();
      } catch {
        showPopup('Error deleting history fact.');
      }
      setLoading(false);
    });
  };

  return (
    <div className="fact-manager">
      <h2>Manage Facts</h2>

      <div className="add-fact">
        <textarea
          value={newFact}
          onChange={(e) => setNewFact(e.target.value)}
          placeholder="Write new fact..."
        />
        <button onClick={addFact} disabled={loading}>Add Fact</button>
      </div>

      <div className="active-fact">
        <h3>Active Facts (User Visible)</h3>
        {activeFacts.length === 0 ? (
          <p>📭 No Active Facts!</p>
        ) : (
          activeFacts.map((fact, idx) => (
            <div key={fact._id} className="active-fact-item">
              {editIndex === idx ? (
                <>
                  <textarea
                    value={editFactText}
                    onChange={(e) => setEditFactText(e.target.value)}
                  />
                  <button onClick={() => updateFact(fact._id)} disabled={loading}>Update</button>
                  <button onClick={() => setEditIndex(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <p>{fact.fact}</p>
                  <button onClick={() => { setEditIndex(idx); setEditFactText(fact.fact); }}>Edit</button>
                  <button onClick={() => deleteActiveFact(fact._id)}>Delete</button>
                </>
              )}
            </div>
          ))
        )}
      </div>

      <div className="fact-history">
        <h3>Fact History</h3>
        {history.length === 0 ? (
          <p>No facts yet.</p>
        ) : (
          history.map((f) => (
            <div key={f._id} className="history-item">
              <p>{f.fact}</p>
              <button className="delete-btn" onClick={() => deleteHistoryFact(f._id)}>Delete</button>
            </div>
          ))
        )}
      </div>

      {popup.show && (
        <div className="fact-popup">
          <p>{popup.message}</p>
          <button className="close-btn" onClick={closePopup}>Close</button>
        </div>
      )}

      {confirmPopup.show && (
        <div className="fact-confirm-popup">
          <p>{confirmPopup.text}</p>
          <button onClick={() => { confirmPopup.onConfirm(); hideConfirm(); }}>Yes</button>
          <button onClick={hideConfirm}>Cancel</button>
        </div>
      )}

      {loading && <div className="fact-loading">Processing...</div>}
    </div>
  );
};

export default FactManager;
