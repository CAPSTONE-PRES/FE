import "../styles/DatePickerModal.css";
import { getStringedDate } from "../util/get-stringed-date";
import ModalCalendar from "./calendars/ModalCalendar";
import clock from "../assets/SVG_NewPresentation/clock.svg";
import { useState } from "react";
import { normalizeTime } from "../util/normalize-time";

const DatePickerModal = ({ date, setDate, time, setTime, onClose }) => {
  const [tempDate, setTempDate] = useState(date);
  const [hour, setHour] = useState(time.split(":")[0]);
  const [minute, setMinute] = useState(time.split(":")[1]);

  const onSave = () => {
    const normalizeHour = normalizeTime(hour, 0, 23, 0);
    const normalizeMinute = normalizeTime(minute, 0, 59, 0);

    setDate(tempDate);
    setTime(`${normalizeHour}:${normalizeMinute}`);
    onClose();
  };

  return (
    <div className="DatePickerModal">
      <div className="dp-info">
        <span className="dp-label">{getStringedDate(tempDate)}</span>
        <span className="dp-label">{`${hour}:${minute}`}</span>
      </div>
      <div className="dp-calendar">
        <ModalCalendar value={tempDate} onChange={setTempDate} />
      </div>
      <div className="dp-time-setting">
        <span className="dp-label">시간 설정</span>
        <div className="dp-right">
          <div className="dp-note">
            <img src={clock} />
            <span>24시간</span>
          </div>
          <div className="dp-time-input">
            <input
              type="number"
              value={hour}
              onChange={(e) => setHour(e.target.value)}
              onBlur={() => setHour(normalizeTime(hour, 0, 23, 0))}
              onFocus={(e) => {
                e.target.select();
              }}
            />
            :
            <input
              type="number"
              value={minute}
              onChange={(e) => setMinute(e.target.value)}
              onBlur={() => setMinute(normalizeTime(minute, 0, 59, 0))}
              onFocus={(e) => {
                e.target.select();
              }}
            />
          </div>
        </div>
      </div>
      <div className="dp-footer">
        <button className="dp-cancle" onClick={onClose}>
          취소
        </button>
        <button className="dp-save" onClick={onSave}>
          완료
        </button>
      </div>
    </div>
  );
};

export default DatePickerModal;
