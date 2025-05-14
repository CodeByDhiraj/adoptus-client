import React, { useState, useEffect, useCallback } from 'react';
import AdoptedCards from './AdoptedCards';
import { useAuthContext } from '../../hooks/UseAuthContext';

const AdoptedHistory = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();

  const fetchAdoptedPets = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/adoptedPets', {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });

      if (!res.ok) {
        throw new Error('An error occurred while fetching adopted pets');
      }

      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error('Error fetching adopted pets:', err);
    } finally {
      setLoading(false);
    }
  }, [user.token]);

  useEffect(() => {
    fetchAdoptedPets();
  }, [fetchAdoptedPets]);

  return (
    <div className="admin-main">
      <h2 className="text-2xl font-bold text-center mb-4">📚 Adopted History</h2>
      {loading ? (
        <p className="text-center text-gray-300">Loading adopted pets...</p>
      ) : requests.length > 0 ? (
        requests.map((pet) => (
          <AdoptedCards
            key={pet._id}
            pet={pet}
            updateCards={fetchAdoptedPets}
            deleteBtnText="Delete History"
          />
        ))
      ) : (
        <p className="text-center text-gray-400">No Adopted Pets available</p>
      )}
    </div>
  );
};

export default AdoptedHistory;
