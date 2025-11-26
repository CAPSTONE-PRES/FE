import { useEffect, useRef } from "react";
import "../styles/BaseModal.css";
import useOutsideClick from "../hooks/useOutsideClick";

const BaseModal = ({
  isOpen,
  onClose,
  header,
  children,
  width = "960px",
  height = "637px",
}) => {
  // const modalRef = useRef(null)

  useOutsideClick(".ModalContent", onClose); //TODO: modalRef로 수정

  if (!isOpen) return null;

  return (
    <div className="ModalOverlay" onClick={onClose}>
      <div
        className="ModalContent"
        style={{ width, height }}
        // ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="BaseModal__header">
          <p>{header}</p>
          <button onClick={onClose}>닫기</button>
        </div>
        <div className="BaseModal__body">{children}</div>
      </div>
    </div>
  );
};

export default BaseModal;
