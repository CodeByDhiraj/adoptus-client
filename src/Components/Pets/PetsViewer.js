import React, { useState } from 'react';
import AdoptForm from '../AdoptForm/AdoptForm';
import { formatDistanceToNow } from 'date-fns';
import Popup from '../Common/Popup';
import { useAuthContext } from '../../hooks/UseAuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';


const PetsViewer = ({ pet }) => {
  const [showPopup, setShowPopup] = useState(false);
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const togglePopup = () => setShowPopup(!showPopup);

  const handleShowInterest = () => {
    if (!user) {
      // Not logged in → redirect to login with popup
      toast.error("Please login first to show interest.");
      setTimeout ( () => {
        navigate("/auth");
      }, 1500);
      return;
    } else {
      togglePopup();
    }
  };

  const formatTimeAgo = (updatedAt) => {
    if (!updatedAt) return "";
    try {
      const date = new Date(updatedAt);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return "Recently updated";
    }
  };

  return (
    <>
      <div className='pet-view-card'>
        <div className='pet-card-pic'>

          <img
            src={pet.filename ? `http://localhost:5000/images/${pet.filename}` : '/default-pet.jpg'}
            alt={pet.name || 'Pet'}
          />
        </div>
        <div className='pet-card-details'>
          <h2>{pet.name || 'Unnamed Pet'}</h2>
          <p><b>Type:</b> {pet.type || 'Unknown'}</p>
          <p><b>Age:</b> {pet.age || 'N/A'}</p>
          <p><b>Location:</b> {pet.area || 'N/A'}</p>
          <p>{formatTimeAgo(pet.updatedAt)}</p>
        </div>
        <div className='show-interest-btn'>
          <button onClick={handleShowInterest}>Show Interest <i className="fa fa-paw"></i></button>
        </div>
      </div>

      {showPopup && (
        <Popup onClose={togglePopup}>
          <AdoptForm closeForm={togglePopup} pet={pet} />
          <button onClick={togglePopup} className="close-btn">Close</button>
        </Popup>
      )}
    </>
  );
};

export default PetsViewer;
