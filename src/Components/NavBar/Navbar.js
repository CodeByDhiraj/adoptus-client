// ✅ Full Drawer-Integrated Navbar with Dark Mode, Edit Scroll, Modern Delete

// 👉 Uses: react-icons, modern modal, ref for scroll, and proper delete call
// 🔁 Requires: /public/default-profile.png image to exist

// ✅ FILE: Client/src/Components/Navbar/Navbar.js

import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Swal from 'sweetalert2';
import logo from "./images/logo.png";
import {
  FaUserEdit,
  FaTrashAlt,
  FaSignOutAlt,
  FaCommentDots,
  FaUserShield,
  FaInstagram,
  FaTwitter,
  FaFacebook,
  FaUserAlt, FaCalendarAlt, FaClock, FaMobileAlt
} from "react-icons/fa";
import { useAuthContext } from "../../hooks/UseAuthContext";
import ThemeToggle from "../ThemeToggle";
import { logout } from "../../utils/logout";
import './Navbar.css';
import axios from "../../axiosInstance";



const Navbar = (props) => {
  const { user, dispatch } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDrawer, setShowDrawer] = useState(false);
  const profileRef = useRef(null);


  const closeDrawer = () => setShowDrawer(false);

  const handleLogout = () => {
    logout();
    window.dispatchEvent(new Event("logout"));
    navigate("/");
  };

  const handleEditProfile = () => {
    closeDrawer();
    if (location.pathname === "/profile") {
      setTimeout(() => {
        const target = document.querySelector(".edit-profile-form");
        target?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else {
      navigate("/profile");
      setTimeout(() => {
        const target = document.querySelector(".edit-profile-form");
        target?.scrollIntoView({ behavior: "smooth" });
      }, 600);
    }
  };

  const handleDelete = async () => {
    closeDrawer();

    const result = await Swal.fire({
      title: "Delete Account?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete("/api/user/user/delete", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {
        await Swal.fire({
          title: "Deleted!",
          text: "Your account has been deleted.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        localStorage.clear();
        navigate("/");
        window.location.reload();
      }
    } catch (err) {
      console.error("Account deletion failed", err);
      Swal.fire({
        title: "Error!",
        text: "Something went wrong while deleting.",
        icon: "error",
      });
    }
  };



  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") closeDrawer();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    const body = document.body;

    if (showDrawer) {
      body.style.overflow = 'hidden';
    } else {
      body.style.overflow = '';
    }

    return () => {
      body.style.overflow = '';
    };
  }, [showDrawer]);


  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const reloadUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          dispatch({ type: "LOGIN", payload: parsedUser });
        } catch (err) {
          console.warn("🔁 Failed to parse user from localStorage:", err);
        }
      }
    };

    reloadUser();
  }, []);


  return (
    <div className="navbar-container">
      {/* 🚀 Logo */}
      <div>
        <Link className="logo-container" to="/">
          <img className="navbar-logo" src={logo} alt="AdoptUs Logo" />
          <p>{props.title}</p>
        </Link>
      </div>

      {/* 🔗 Links */}
      <div>
        <ul className="navbar-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/services">Services</Link></li>
          <li><Link to="/pets">Pets</Link></li>
          <li><Link to="/contact">Contact Us</Link></li>
          <li><ThemeToggle /></li>
        </ul>
      </div>

      {/* 👤 User Section */}
      <div className="logout-username">
        {user ? (
          <img
            src={
              user?.profilePic
                ? `${process.env.REACT_APP_BACKEND_URL}${user.profilePic}`
                : "/default-profile.png"
            }
            alt="Profile"
            className="navbar-avatar"
            onClick={() => setShowDrawer(true)}
          />
        ) : (
          <div className="guest-buttons">
            <button onClick={() => navigate('/login')} className="guest-btn">Login</button>
            <button onClick={() => navigate('/signup')} className="guest-btn">Signup</button>
          </div>
        )}
      </div>

      {/* 📱 Drawer */}
      {showDrawer && (
        <>
          <div className="drawer-overlay" onClick={closeDrawer}></div>
          <div className={`profile-drawer ${!showDrawer ? 'drawer-hidden' : ''}`}>
            <button className="Navbar-close-btn" onClick={closeDrawer}>×</button>
            <div className="drawer-header">
              <h3 className="drawer-title">🐾 AdoptUs Hub</h3>
              <img
                className="drawer-profile-pic"
                src={
                  user?.profilePic
                    ? `${process.env.REACT_APP_BACKEND_URL}${user.profilePic}`
                    : "/default-profile.png"
                }
                alt="User"
              />
            </div>
            <p className="drawer-welcome">
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaUserAlt size={19} />
                Welcome {user?.userName || user?.name || "User"}!
              </span>
            </p>


            <p className="drawer-joined">
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaCalendarAlt size={15} />
                Member since {new Date(user?.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
              </span>
            </p>


            {user?.lastLogin && (
              <p className="drawer-last-login">
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaClock size={29} />
                  Last Login: {new Date(user.lastLogin).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })},
                  at {new Date(user.lastLogin).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                </span>
              </p>
            )}


            <p onClick={handleEditProfile}><FaUserEdit /> Edit Profile</p>
            {isAdmin && <p onClick={() => { navigate("/admin/panel/dashboard"); closeDrawer(); }}><FaUserShield /> Admin Panel</p>}
            <p onClick={() => { navigate("/contact"); closeDrawer(); }}><FaCommentDots /> Give Suggestions</p>
            <p onClick={handleLogout}><FaSignOutAlt /> Logout</p>
            <p onClick={handleDelete}><FaTrashAlt /> Delete Account</p>

            <div className="drawer-footer">
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                marginTop: '10px'
              }}>
                <p style={{
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  color: 'var(--drawer-text)',
                  margin: 0
                }}>
                  <FaMobileAlt /> Follow us on
                </p>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <a href="https://instagram.com/priyanshusingh_4141/" target="_blank" rel="noreferrer"><FaInstagram /></a>
                  <a href="https://github.com/codebyDhiraj" target="_blank" rel="noreferrer"><FaTwitter /></a>
                  <a href="https://Facebook.com/Priyanshusingh" target="_blank" rel="noreferrer"><FaFacebook /></a>
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '15px',
              gap: '8px'
            }}>
              <img src="/logo.png" alt="logo" style={{ width: '30px', height: '30px', borderRadius: '10px' }} />
              <span style={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'var(--drawer-text)' }}>
                AdoptUs – Every Paw Deserves a Home 🐾
              </span>
            </div>

          </div>
        </>

      )}
    </div>
  );
};

export default Navbar;
