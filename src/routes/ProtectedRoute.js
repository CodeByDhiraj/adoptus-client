import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../hooks/UseAuthContext';
import { toast } from 'react-hot-toast';

let toastShown = false; // ✅ Flag for preventing double toast

const ProtectedRoute = ({ children }) => {
  const { user } = useAuthContext();
  const location = useLocation();

  if (!user) {
    if (!toastShown) {
      toast.error("Please login to access your profile.");
      toastShown = true;

      // ✅ Reset the flag after short time (2 sec)
      setTimeout(() => {
        toastShown = false;
      }, 2000);
    }

    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
