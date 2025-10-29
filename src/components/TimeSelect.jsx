import "../styles/TimeSelect.css";
import selectArrow from "../assets/SVG_NewClass/time-select-arrow.svg";
import TimePopup from "./TimePopup";
import { useState } from "react";

const TimeSelect = ({ index, time, onChange, openIndex, setOpenIndex }) => {
  const isOpen = openIndex === index;

  return (
    <div className="TimeSelect">
      <div className="time-select">
        {/* 요일 선택 */}
        <select
          className="time-select_day"
          defaultValue={time.day}
          onChange={(e) => onChange(index, { ...time, day: e.target.value })}
        >
          <option>월요일</option>
          <option>화요일</option>
          <option>수요일</option>
          <option>목요일</option>
          <option>금요일</option>
          <option>토요일</option>
          <option>일요일</option>
        </select>

        {/* 시간 선택 */}
        <button
          className="time-select_time"
          onClick={() => {
            setOpenIndex(isOpen ? null : index);
          }}
        >
          {time.start} - {time.end}
          <img src={selectArrow} />
        </button>
      </div>

      {/* 팝업 */}
      <div className="pop-up">
        {isOpen && (
          <TimePopup
            time={time}
            onClose={() => setOpenIndex(null)}
            onSave={(newTime) => {
              onChange(index, newTime);
              setOpenIndex(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default TimeSelect;
