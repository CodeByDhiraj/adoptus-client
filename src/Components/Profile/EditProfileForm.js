import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../hooks/UseAuthContext';
import axios from '../../axiosInstance';
import Swal from 'sweetalert2';

const EditProfileForm = ({ user, onUpdate }) => {
  const { setUser } = useAuthContext();
  const [form, setForm] = useState({
    name: user.name || '',
    phone: user.phone || '',
    address: user.address || '',
    city: user.city || '',
    state: user.state || '',
    landmark: user.landmark || '',
    pincode: user.pincode || '',
    profilePic: null,
  });

  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user.profilePic && !form.profilePic) {
      setPreview(user.profilePic);
    }
  }, [user.profilePic, form.profilePic]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      if (!/^\d{0,10}$/.test(value)) {
        setError('❌ Phone No must contain only numbers and max 10 digits.');
        return;
      } else {
        setError('');
      }
    }

    if (name === 'pincode') {
      if (!/^\d{0,6}$/.test(value)) {
        setError('❌ Pincode must contain only numbers and max 6 digits.');
        return;
      } else {
        setError('');
      }
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((prev) => ({ ...prev, profilePic: file }));
      setPreview(URL.createObjectURL(file));
    } else {
      console.warn('No file selected or file is invalid.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const confirm = await Swal.fire({
      title: 'Update Profile?',
      text: 'Are you sure you want to update your profile?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update it!'
    });

    if (!confirm.isConfirmed) return;

    setError('');
    setMessage('');
    setLoading(true);

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const token = localStorage.getItem('token');
      const res = await axios.put('/api/user/profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.status === 200) {
        setMessage('✅ Profile updated successfully!');
        const existingUser = JSON.parse(localStorage.getItem('user'));
        const updatedUser = {
          ...res.data.user,
          lastLogin: existingUser?.lastLogin || '',
        };
        const mergedUser = {
          ...updatedUser,
          userName: updatedUser.name || updatedUser.userName || 'User',
        };
        localStorage.setItem('user', JSON.stringify(mergedUser));
        setUser(mergedUser);
        onUpdate();
      }
    } catch (err) {
      console.error('Profile update failed:', err);
      setError(err?.response?.data?.message || '❌ Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="edit-profile-form">
      <button
        type="button"
        className="close-button"
        onClick={() => {
          Swal.fire({
            title: 'Cancel Edit?',
            text: 'Are you sure you want to close edit form?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, close it'
          }).then((result) => {
            if (result.isConfirmed) {
              onUpdate();
            }
          });
        }}
      >
        ×
      </button>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required className="profile-input" />
      <input type="text" name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} className="profile-input" />
      <input type="text" name="address" placeholder="House No.& Floor" value={form.address} onChange={handleChange} className="profile-input" />
      <input type="text" name="city" placeholder="City" value={form.city} onChange={handleChange} className="profile-input" />
      <input type="text" name="state" placeholder="State" value={form.state} onChange={handleChange} className="profile-input" />
      <input type="text" name="landmark" placeholder="Landmark" value={form.landmark} onChange={handleChange} className="profile-input" />
      <input type="text" name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange} className="profile-input" />
      <input type="file" name="profilePic" accept="image/*" onChange={handleFileChange} className="profile-file" />

      {preview && <div className="preview-wrapper"><img src={preview} alt="Preview" className="profile-preview" /></div>}

      <button type="submit" disabled={loading} className="profile-save-button">
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
};

export default EditProfileForm;
