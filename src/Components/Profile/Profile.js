// ✅ FILE: Client/src/Components/Profile/Profile.js

import React, { useState, useEffect } from 'react';
import axios from '../../axiosInstance';
import EditProfileForm from './EditProfileForm';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const res = await axios.get('/api/user/user/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 200 && res.data) {
          setUser(res.data);
          setError(null);
        } else {
          setError('User not found');
        }
      } catch (err) {
        console.error('Profile fetch error:', err);
        setError('⚠️ Failed to fetch profile.');
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleDelete = async () => {
    const confirm = await Swal.fire({
      title: 'Delete Account?',
      text: 'Are you sure you want to delete your account? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (!confirm.isConfirmed) return;

    try {
      const token = localStorage.getItem('token');
      const res = await axios.delete('/api/user/user/delete', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {
        localStorage.clear();
        navigate('/');
      }
    } catch (err) {
      console.error('Error deleting account:', err);
      setError('Failed to delete account.');
    }
  };

  const handleUpdate = () => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('/api/user/user/me', {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => {
        if (res.status === 200) setUser(res.data);
      });
    }
    setEditMode(false);
  };

  const confirmEdit = async () => {
    const result = await Swal.fire({
      title: 'Edit Profile?',
      text: 'Are you sure you want to edit your profile?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, edit it!'
    });

    if (result.isConfirmed) {
      setEditMode(true);
    }
  };

  if (error) return <div className="error-message">{error}</div>;
  if (!user) return <div className="loading">Loading profile...</div>;

  return (
    <div className="profile-container">
      {!editMode ? (
        <>
          <h2>Your Profile</h2>
          <img
            src={
              user.profilePic
                ? `${process.env.REACT_APP_BACKEND_URL}${user.profilePic}`
                : 'https://via.placeholder.com/150'
            }
            alt="Profile"
            className="profile-pic"
          />
          <div className="profile-details">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone || 'Not added'}</p>
            <p><strong>Address:</strong> {user.address || 'Not added'}</p>
            <p><strong>Landmark:</strong> {user.landmark || 'Not added'}</p>
            <p><strong>City:</strong> {user.city || 'Not added'}</p>
            <p><strong>State:</strong> {user.state || 'Not added'}</p>
            <p><strong>Pincode:</strong> {user.pincode || 'Not added'}</p>
          </div>
          <div className="profile-actions">
            <button className="back-btn" onClick={() => navigate('/')}>
             Back
            </button>
            <button onClick={confirmEdit}>Edit</button>
            <button onClick={handleDelete}>Delete Account</button>
          </div>
        </>
      ) : (
        <EditProfileForm user={user} onUpdate={handleUpdate} />
      )}
    </div>
  );
};

export default Profile;
