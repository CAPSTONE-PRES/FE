import { useState } from "react";
import "../styles/TimePopup.css";
import TimeSection from "./TimeSection";

const TimePopup = ({ time, onClose, onSave }) => {
  const [start, setStart] = useState(time.start); //"HH:mm"
  const [end, setEnd] = useState(time.end); //"HH:mm"

  return (
    <div className="TimePopup">
      <div className="time-section">
        <TimeSection value={start} onChange={setStart} />
        <span>~</span>
        <TimeSection value={end} onChange={setEnd} />
      </div>

      <div className="popup-actions">
        <button onClick={onClose}>취소</button>
        <button
          className="popup-save"
          onClick={() => {
            onSave({ ...time, start, end });
          }}
        >
          완료
        </button>
      </div>
    </div>
  );
};

export default TimePopup;
