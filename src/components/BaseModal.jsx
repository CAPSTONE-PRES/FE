import { useEffect } from "react";
import "../styles/BaseModal.css";
import useOutsideClick from "../hooks/useOutsideClick";

const BaseModal = ({ isOpen, onClose, header, children, width = "800px" }) => {
  useOutsideClick(".ModalContent", () => (isOpen = false));
  if (!isOpen) return null;

  return (
    <div className="ModalOverlay" onClick={onClose}>
      <div
        className="ModalContent"
        style={{ width }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="BaseModal__header">
          <p>{header}</p>
          <button onClick={onClose}>닫기</button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default BaseModal;
