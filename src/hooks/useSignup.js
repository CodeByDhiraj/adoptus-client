// ✅ FILE: Client/src/hooks/useSignup.js

import { useState } from 'react';
import { useAuthContext } from './UseAuthContext';

export const useSignup = () => {
  const [signupError, setSignupError] = useState(null);
  const [signupIsLoading, setSignupIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

  const signup = async (name, email, password, otp) => {
    setSignupIsLoading(true);
    setSignupError(null);

    try {
      const res = await fetch(`${API_BASE}/api/user/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, otp }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Signup failed');

      localStorage.setItem('user', JSON.stringify(data));
      localStorage.setItem('token', data.token);
      localStorage.setItem('userName', data.userName);
      localStorage.setItem('email', data.email);
      localStorage.setItem('role', data.role);

      dispatch({ type: 'LOGIN', payload: data });
      return data;
    } catch (err) {
      setSignupError(err.message);
    } finally {
      setSignupIsLoading(false);
    }
  };

  return { signup, signupIsLoading, signupError, setSignupError };
};
