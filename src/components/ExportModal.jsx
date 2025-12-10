import { useEffect, useState } from "react";
import BaseModal from "./BaseModal";
import "../styles/ExportModal.css";
import downloadIcon from "../assets/SVG_Presentation/downloadIcon.svg";
import copyIcon from "../assets/SVG_Presentation/copyIcon.svg";
import { downloadPresentationPdf, getQrInfo } from "../api/fileApi";

const ExportModal = ({ isOpen, onClose, projectTitle, fileId }) => {
  const [fileName, setFileName] = useState(projectTitle || "");
  const [qrSlug, setQrSlug] = useState(null);
  const [copied, setCopied] = useState(false);

  // QR 슬러그 불러오기
  useEffect(() => {
    if (!fileId || !isOpen) return;

    const fetchQR = async () => {
      try {
        const res = await getQrInfo(fileId);
        const slug = Object.values(res)[0];
        setQrSlug(slug);
      } catch (err) {
        console.error("QR 정보 조회 실패:", err);
      }
    };

    fetchQR();
  }, [fileId, isOpen]);

  // 큐카드 URL
  const qrUrl =
    qrSlug && `${import.meta.env.VITE_BASE_URL}/mobile-cuecard/${qrSlug}`;

  // PDF 다운로드
  const handleDownloadPDF = async () => {
    try {
      await downloadPresentationPdf(fileId, fileName);
      // await downloadPresentationPdf(fileId);
    } catch (err) {
      console.error("PDF 다운로드 실패:", err);
    }
  };

  // 복사
  const handleCopy = async () => {
    if (!qrUrl) return;

    try {
      await navigator.clipboard.writeText(qrUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("클립보드 복사 실패:", err);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      header="내보내기"
      variant="export"
      width="560px"
      height="315px"
    >
      <div className="ExportModal">
        {/* 파일명 */}
        <div className="ExportModal__section">
          <label className="ExportModal__label">파일명</label>
          <input
            className="ExportModal__input"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          />
        </div>

        {/* PDF 다운로드 */}
        <div className="ExportModal__section">
          <button className="ExportModal__download" onClick={handleDownloadPDF}>
            <span>PDF로 내보내기</span>
            <img src={downloadIcon} />
          </button>
        </div>

        {/* 큐카드 링크 */}
        <div className="ExportModal__section">
          <label className="ExportModal__label">큐카드 링크</label>

          <div className="ExportModal__copyBox">
            <span className="ExportModal__url">
              {qrUrl || "불러오는 중..."}
            </span>

            <button className="ExportModal__copyBtn" onClick={handleCopy}>
              <img src={copyIcon} />
            </button>
          </div>

          {/* {copied && <p className="ExportModal__copied">복사됨</p>} */}
        </div>
      </div>
    </BaseModal>
  );
};

export default ExportModal;
