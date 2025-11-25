import "../styles/QRModal.css";
import QRCode from "react-qr-code";

const QRModal = ({ qrSlug }) => {
  const qrUrl = `${import.meta.env.VITE_BASE_URL}/mobile-cuecard/${qrSlug}`;

  return (
    <div className="QRModal" onClick={(e) => e.stopPropagation()}>
      <p className="QRModal__title">QR코드</p>

      {qrSlug && (
        <div className="QRModal__box">
          <QRCode value={qrUrl} size={165} style={{ borderRadius: "8px" }} />
        </div>
      )}
    </div>
  );
};

export default QRModal;
