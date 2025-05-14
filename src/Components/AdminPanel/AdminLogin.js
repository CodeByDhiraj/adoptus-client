import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'; // ✅ Import toast
import { useAuthContext } from '../../hooks/UseAuthContext';
import './AdminLogin.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { dispatch } = useAuthContext();


  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));

    toast.dismiss();
    toast.success('👋 Welcome Admin! Please login to access the panel.', {
      duration: 2000,
      style: {
        background: '#1f1f1f',
        color: '#fff',
        fontWeight: '500'
      },
      iconTheme: {
        primary: '#00BFFF',
        secondary: '#fff',
      },
    });
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch('http://localhost:5000/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
  
      // ✅ Preserve lastLogin from backend response (already previous)
      const fullPayload = {
        token: data.token,
        email: data.email,
        userName: data.userName,
        role: data.role,
        profilePic: data.profilePic || null,
        createdAt: data.createdAt || null,
        lastLogin: data.lastLogin || null   // ✅ Trust backend now
      };
  
      localStorage.setItem('user', JSON.stringify(fullPayload));
      dispatch({ type: 'LOGIN', payload: fullPayload });
  
      if (data.role === 'admin') {
        navigate('/admin/panel/dashboard');
      } else {
        setError('Access denied. Not an admin.');
      }
    } catch (err) {
      setError(err.message);
    }
  };
  

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-container">
        <div className="admin-login-left">
          <img src="/logo.png" alt="AdoptUs Logo" className="admin-logo" />
          <h2>AdoptUs Admin Panel</h2>
          <p>Manage pets, users, and shops securely</p>
        </div>

        <div className="admin-login-form">
          <h2>Admin Login</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Login</button>
            {error && <p className="error-message">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
