import React, { useState, useEffect, useCallback } from 'react';
import PetCards from './PetCards';
import { useAuthContext } from '../../hooks/UseAuthContext';

const ApprovedRequests = () => {
  const [approvedPets, setApprovedPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();

  // ✅ Fetch Approved Pets
  const fetchApprovedPets = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:5000/api/services/status/Approved', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to fetch approved pets');
      const data = await res.json();
      setApprovedPets(data);
    } catch (error) {
      console.error('Error loading approved pets:', error);
    } finally {
      setLoading(false);
    }
  }, [user.token]);

  useEffect(() => {
    fetchApprovedPets();
  }, [fetchApprovedPets]);

  return (
    <div className="admin-main">
      <h2 className="text-xl font-bold text-center mb-4">✅ Approved Pet Listings</h2>

      {loading ? (
        <p className="text-gray-400 text-center">Loading...</p>
      ) : approvedPets.length > 0 ? (
        approvedPets.map((pet) => (
          <PetCards
            key={pet._id}
            pet={pet}
            updateCards={fetchApprovedPets}
            deleteBtnText="Delete Post"
            approveBtn={false}
          />
        ))
      ) : (
        <p className="text-gray-400 text-center">No Approved Pets found</p>
      )}
    </div>
  );
};

export default ApprovedRequests;
