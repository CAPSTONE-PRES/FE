import { useState, useRef, useEffect } from "react";
import "../styles/CommentInput.css";
import submitIcon from "../assets/SVG_Presentation/submitIcon.svg";
import submitIcon_disabled from "../assets/SVG_Presentation/submitIcon_disabled.svg";

const CommentInput = ({ placeholder, onSubmit }) => {
  const [value, setValue] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    const textarea = inputRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [value]);

  const handleKeyDown = (e) => {
    if (e.nativeEvent.isComposing) return;

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const trimmed = value.trim();
      if (!trimmed) return;
      onSubmit?.(trimmed);
      setValue("");
    }
  };
  return (
    <div className="CommentInput">
      <textarea
        className="CommentInput__content"
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        rows={1}
        autoFocus={true}
        onKeyDown={handleKeyDown}
      />
      <button
        className={`CommentInput__submit ${value.trim() ? "active" : ""}`}
        disabled={!value.trim()}
        onClick={() => {
          const trimmed = value.trim();
          if (!trimmed) return;
          onSubmit?.(trimmed);
        }}
      >
        <img src={value.trim() ? submitIcon : submitIcon_disabled} />
      </button>
    </div>
  );
};

export default CommentInput;
