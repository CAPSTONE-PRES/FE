import { useState, useRef, useEffect } from "react";
import "../styles/CommentInput.css";

const CommentInput = ({ placeholder, onSubmit }) => {
  const [value, setValue] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    const textarea = textareaRef.current;
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
      textareaRef.current.focus();
    }
  };

  return (
    <div className="CommentInput">
      <textarea
        ref={textareaRef}
        onClick={(e) => e.stopPropagation()}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        rows={1}
        autoFocus={true}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default CommentInput;
