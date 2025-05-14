import React from "react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-logo">
      <img src="/logo.png" alt="Adoptus Logo" />
        <h2>Adoptus</h2>
      </div>

      <p>
        Contact Us -{" "}
        <a href="mailto:AdoptusOfficial@gmail.com">Adoptusofficial@gmail.com</a>
      </p>

      <div className="footer-links">
        <a href="https://github.com/CodeByDhiraj" target="_blank" rel="noreferrer">
          <FaFacebook /> FaceBook
        </a>
        <a href="https://instagram.com/priyanshusingh_4141" target="_blank" rel="noreferrer">
          <FaInstagram /> Instagram
        </a>
        <a href="https://wa.me/91XXXXXXXXXX" target="_blank" rel="noreferrer">
          <FaTwitter /> Twitter
        </a>
      </div>

      <p>
  © {new Date().getFullYear()} <strong>AdoptUs</strong>. All rights reserved.  
  Built with <span style={{ color: "red" }}>❤️</span> in India
</p>

    </footer>
  );
};

export default Footer;
