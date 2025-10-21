import { useState, useRef } from "react";
import "../styles/TimeSection.css";
import { normalizeTime } from "../util/normalize-time";

function toAmPm(time24) {
  let [hour, minute] = time24.split(":").map(Number);
  let ampm = hour >= 12 ? "오후" : "오전";
  if (hour === 0) hour = 12;
  else if (hour > 12) hour -= 12;
  return {
    ampm,
    hour: String(hour).padStart(2, "0"),
    minute: String(minute).padStart(2, "0"),
  };
}

function to24Hour(ampm, hour, minute) {
  let h = Number(hour);
  if (ampm === "오전" && h === 12) h = 0;
  if (ampm === "오후" && h !== 12) h += 12;
  return `${String(h).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

// const normalizeHour = (val) => {
//   let num = Number(val);
//   if (isNaN(num)) return "09"; //기본값
//   if (num < 1) num = 1;
//   if (num > 12) num = 12;
//   return num.toString().padStart(2, "0");
// };

// const normalizeMinute = (val) => {
//   let num = Number(val);
//   if (isNaN(num)) return "00";
//   if (num < 0) num = 0;
//   if (num > 59) num = 59;
//   return num.toString().padStart(2, "0");
// };

const normalizeHour = (val) => normalizeTime(val, 0, 12, 9);
const normalizeMinute = (val) => normalizeTime(val, 0, 59, 0);

const TimeSection = ({ value, onChange }) => {
  const { ampm, hour, minute } = toAmPm(value); //value: "HH:mm"

  const [rawHour, setRawHour] = useState(hour);
  const [rawMinute, setRawMinute] = useState(minute);

  const commit = (h, m, a = ampm) => {
    if (h === "" || m === "") return;
    const normalizedHour = normalizeHour(h);
    const normalizedMinute = normalizeMinute(m);

    setRawHour(normalizedHour);
    setRawMinute(normalizedMinute);

    onChange(to24Hour(a, normalizedHour, normalizedMinute));
  };

  return (
    <div className="TimeSection">
      <div className="ampm-toggle">
        <button
          className={ampm === "오전" ? "active" : ""}
          onClick={() => {
            commit(rawHour, rawMinute, "오전");
          }}
        >
          오전
        </button>
        <button
          className={ampm === "오후" ? "active" : ""}
          onClick={() => {
            commit(rawHour, rawMinute, "오후");
          }}
        >
          오후
        </button>
      </div>

      <div className="time-input">
        <input
          type="number"
          value={rawHour}
          onChange={(e) => setRawHour(e.target.value)}
          onFocus={(e) => {
            e.target.select();
          }}
          onBlur={() => commit(rawHour, rawMinute)}
        />
        :
        <input
          type="number"
          value={rawMinute}
          onChange={(e) => setRawMinute(e.target.value)}
          onFocus={(e) => {
            e.target.select();
          }}
          onBlur={() => commit(rawHour, rawMinute)}
        />
      </div>
    </div>
  );
};

export default TimeSection;
