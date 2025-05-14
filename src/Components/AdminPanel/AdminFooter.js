import React from "react";
import "./AdminFooter.css";

const AdminFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="admin-footer">
      <p>
        &copy; {currentYear} <span className="highlight">AdoptUs Admin Panel</span>. All rights reserved.
      </p>
    </footer>
  );
};

export default AdminFooter;
