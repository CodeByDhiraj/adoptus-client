import React from "react";
import ReactDOM from "react-dom";
import "./Popup.css";

const Popup = ({ children, onClose }) => {
  return ReactDOM.createPortal(
    <div className="global-popup" onClick={onClose}>
      <div className="global-popup-content" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Popup;
