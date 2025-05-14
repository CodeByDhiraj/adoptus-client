import React, { useState, useEffect, useCallback } from 'react';
import FormCard from './FormCard';
import { useAuthContext } from '../../hooks/UseAuthContext';

const AdoptingRequests = () => {
  const { user } = useAuthContext();
  const [forms, setForms] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPetId, setSelectedPetId] = useState('');
  const [selectedPet, setSelectedPet] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  // ✅ Fetch Forms
  const fetchForms = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:5000/api/form/getForms', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error loading forms');
      setForms(data);
    } catch (err) {
      console.error(err);
    }
  }, [user.token]);

  // ✅ Fetch Approved Pets
  const fetchPets = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:5000/api/services/approvedPets', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error loading pets');
      setPets(data);
    } catch (err) {
      console.error(err);
    }
  }, [user.token]);

  useEffect(() => {
    fetchForms();
    fetchPets();
    setLoading(false);
  }, [fetchForms, fetchPets]);

  const petsWithRequests = pets.filter((pet) =>
    forms.some((form) => form.petId === pet._id)
  );

  const handleChange = (e) => setSelectedPetId(e.target.value);

  const filteredPets = selectedPetId
    ? petsWithRequests.filter((pet) => pet._id === selectedPetId)
    : petsWithRequests;

  const openPopup = (pet) => {
    setSelectedPet(pet);
    setShowPopup(true);
  };

  const closePopup = () => {
    setSelectedPet(null);
    setShowPopup(false);
  };

  return (
    <div className="admin-main">
      <h2 className="text-2xl font-bold text-center mb-4">📝 Adoption Requests</h2>

      <div className="text-right mb-4">
        <select
          className="req-filter-selection p-2 rounded border"
          value={selectedPetId}
          onChange={handleChange}
        >
          <option value="">All Requests</option>
          {petsWithRequests.map((pet) => (
            <option key={pet._id} value={pet._id}>
              {pet.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-gray-400 text-center">Loading...</p>
      ) : filteredPets.length > 0 ? (
        filteredPets.map((pet) => {
          const relatedForms = forms.filter((f) => f.petId === pet._id);
          return (
            <div key={pet._id} className="form-container">
              <h3
                className="text-lg font-semibold text-blue-400 mb-2 cursor-pointer"
                onClick={() => openPopup(pet)}
              >
                📌 {pet.name}
              </h3>
              <div className="form-child-container">
                {relatedForms.map((form) => (
                  <FormCard
                    key={form._id}
                    form={form}
                    pet={pet}
                    updateCards={fetchForms}
                    deleteBtnText="Reject"
                    approveBtn={true}
                  />
                ))}
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-center text-gray-300">No adoption requests available.</p>
      )}

      {/* Popup for Pet Info */}
      {showPopup && selectedPet && (
        <div className="popup">
          <div className="popup-content">
            <div className="pet-view-card">
              <div className="pet-card-pic">
                <img
                  src={`http://localhost:5000/images/${selectedPet.filename}`}
                  alt={selectedPet.name}
                />
              </div>
              <div className="pet-card-details">
                <h2>{selectedPet.name}</h2>
                <p><strong>Type:</strong> {selectedPet.type}</p>
                <p><strong>Age:</strong> {selectedPet.age}</p>
                <p><strong>Area:</strong> {selectedPet.area}</p>
                <p><strong>Email:</strong> {selectedPet.email}</p>
                <p><strong>Phone:</strong> {selectedPet.phone}</p>
                <p><strong>Justification:</strong> {selectedPet.justification}</p>
              </div>
            </div>
            <button onClick={closePopup} className="close-btn">
              Close <i className="fa fa-times" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdoptingRequests;
