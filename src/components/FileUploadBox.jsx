import { useState, useRef } from "react";
import "../styles/FileUploadBox.css";
import deleteIcon from "../assets/SVG_NewPresentation/delete.svg";
import { getStringedDate } from "../util/get-stringed-date";

const FileUploadBox = ({
  title,
  subText,
  fileTypes,
  optionalNote,
  isOptional = false,
  file,
  setFile,
}) => {
  const inputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (validateFile(droppedFile)) {
      setFile(droppedFile);
    }
  };

  const validateFile = (file) => {
    const allowed = fileTypes.split("/"); //ex) ["pdf", "pptx"]
    const extension = file.name.split(".").pop().toLowerCase();

    if (!allowed.includes(extension)) {
      alert(`허용되지 않는 파일 형식입니다.(${fileTypes})`);
      return false;
    }
    if (file.size > 100 * 1024 * 1024) {
      alert("파일 크기는 100MB를 초과할 수 없습니다.");
      return false;
    }
    return true;
  };

  const handleDelete = () => {
    setFile(null);
  };

  return (
    <div
      className={`FileUploadBox ${isOptional ? "optional" : ""}`}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => inputRef.current.click()}
    >
      {!file ? (
        <>
          <h3>{title}</h3>
          <p className="file-types">
            파일 형식 <strong>{fileTypes}</strong>
          </p>
          <p className="file-sub">
            {subText || "파일을 드래그 앤 드랍하세요!"}
          </p>
          {optionalNote && <p className="file-note">{optionalNote}</p>}
        </>
      ) : (
        <div className="file-uploaded">
          <div className="file-info">
            <span className="file-name">{file.name}</span>
            <span className="file-size">
              {(file.size / (1024 * 1024)).toFixed(2)}MB
            </span>
            <span className="file-date">
              {getStringedDate(new Date(file.lastModified))}
            </span>
          </div>
          <button
            className="file-delete"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
          >
            <img src={deleteIcon} />
          </button>
        </div>
      )}
      <input
        type="file"
        accept={fileTypes
          .split("/")
          .map((ext) => "." + ext)
          .join(",")}
        ref={inputRef}
        onChange={(e) => {
          const selectedFile = e.target.files[0];
          if (validateFile(selectedFile)) {
            setFile(selectedFile);
          }
        }}
        hidden
      />
    </div>
  );
};

export default FileUploadBox;
