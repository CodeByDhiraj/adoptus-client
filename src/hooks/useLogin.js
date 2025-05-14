import { useState } from 'react';
import { useAuthContext } from './UseAuthContext';
import { useNavigate } from 'react-router-dom'; // ✅ Required for redirection

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();
  const navigate = useNavigate(); // ✅ Added this line

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
      const response = await fetch(`${API_BASE}/api/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Login failed');

      localStorage.setItem('user', JSON.stringify({
        token: data.token,
        userName: data.userName,
        email: data.email,
        role: data.role,
        profilePic: data.profilePic || null,
        createdAt: data.createdAt,
        lastLogin: data.lastLogin || null
      }));
      
      dispatch({
        type: 'LOGIN',
        payload: {
          token: data.token,
          userName: data.userName,
          email: data.email,
          role: data.role,
          profilePic: data.profilePic || null,
          createdAt: data.createdAt,
          lastLogin: data.lastLogin || null
        }
      });      
      return data;
    } catch (err) {
      console.error("Login Error Caught:", err.message);
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error, setError };
};
