import React from "react";
import "../styles/PrimaryButton.css";

const PrimaryButton = ({ children, type = "button", disabled = false, onClick, className = "" }) => {
  const classes = ["btn", "btn-primary", className].filter(Boolean).join(" ");
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={classes}>
      {children}
    </button>
  );
};

export default PrimaryButton;


