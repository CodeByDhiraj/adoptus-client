import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Components/NavBar/Navbar";
import Home from "./Components/Home/Home";
import Footer from "./Components/Footer/Footer";
import Services from "./Components/Services/Services";
import Contact from "./Components/Contact/Contact";
import Pets from "./Components/Pets/Pets";
import AdminLogin from "./Components/AdminPanel/AdminLogin";
import AdminScreen from "./Components/AdminPanel/AdminScreen";
import Profile from "./Components/Profile/Profile";
import Auth from "./Components/Auth/Auth";
import { useAuthContext } from './hooks/UseAuthContext';
import "./App.css";
import FourOhFourPage from "./Components/404/FourOhFourPage";
import ScrollToTop from "./Components/ScrollToTop";
import Dashboard from "./Components/AdminPanel/Dashboard";
import ShopApprovalPanel from './pages/admin/ShopApprovalPanel';
import ProtectedAdminRoute from "./routes/ProtectedAdminRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdoptForm from "./Components/AdoptForm/AdoptForm";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Toaster } from 'react-hot-toast';

// ✅ Layout Wrapper
const Layout = ({ children }) => (
  <>
    <Navbar title="AdoptUs" />
    {children}
    <Footer title="AdoptUs" />
  </>
);

const App = () => {
  const { user } = useAuthContext();
  const isAdmin = user?.role === "admin";

  // ✅ Logout Event Listener -> This is what you have to ADD
  useEffect(() => {
    const handleLogoutEvent = () => {
      window.location.reload();
    };

    window.addEventListener("logout", handleLogoutEvent);

    return () => {
      window.removeEventListener("logout", handleLogoutEvent);
    };
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <Toaster position="top-right" />

      <Routes>

        {/* Admin Routes (Protected + Only Admin) */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route
          path="/admin/panel/*"
          element={isAdmin ? <AdminScreen /> : <Navigate to="/admin" />}
        />
        <Route
          path="/admin/shops"
          element={<ProtectedAdminRoute><ShopApprovalPanel /></ProtectedAdminRoute>}
        />
        <Route
          path="/dashboard"
          element={isAdmin ? <Layout><Dashboard /></Layout> : <Navigate to="/" />}
        />

        {/* Auth Routes */}
        <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/" />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/signup" element={<Auth />} />

        {/* Public User Pages (NO login required) */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/services" element={<Layout><Services /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />
        <Route path="/pets" element={<Layout><Pets /></Layout>} />

        {/* Protected User Pages (Login Required) */}
        <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
        <Route path="/adoptform" element={<ProtectedRoute><Layout><AdoptForm /></Layout></ProtectedRoute>} />

        {/* 404 */}
        <Route path="*" element={<FourOhFourPage />} />
      </Routes>
    </Router>
  );
};

export default App;
