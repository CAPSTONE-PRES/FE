import React from "react";
import "../styles/TextInput.css";

const TextInput = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  name,
  placeholder,
  className = "",
  error,
  errorText,
  helperText,
  helperAlign = "right",
  autoComplete = "off",
}) => {
  const inputClass = ["text-input", className];
  if (error) inputClass.push("text-input--error");

  return (
    <div className="text-input-group">
      {label && (
        <label className="field-label" htmlFor={id}>
          {label}
        </label>
      )}
      <input
        id={id}
        name={name}
        type={type}
        className={inputClass.filter(Boolean).join(" ")}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
      {error && (typeof error === "string" || errorText) ? (
        <div className="input-error">
          {typeof error === "string" ? error : errorText}
        </div>
      ) : helperText ? (
        <div
          className={["input-helper", helperAlign === "right" ? "right" : ""]
            .filter(Boolean)
            .join(" ")}
        >
          {helperText}
        </div>
      ) : null}
    </div>
  );
};

export default TextInput;
