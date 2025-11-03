import React from "react";
import "../styles/TextButton.css";

const TextButton = ({
  children,
  onClick,
  disabled = false,
  type = "button",
}) => {
  return (
    <button
      type={type}
      className="TextButton"
      onClick={onClick}
      disabled={disabled}
    >
      <span className="TextButton__label">{children}</span>
    </button>
  );
};

export default TextButton;
