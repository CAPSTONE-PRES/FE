import { useState } from "react";
import plus from "../assets/SVG_ClassHome/plus.svg";
import "../styles/Step2Schedule.css";
import TimeSelect from "../components/TimeSelect";

const Step2Schedule = ({ name, setName, times, setTimes }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const addTime = () => {
    setTimes([...times, { day: "월요일", start: "09:00", end: "10:15" }]);
  };

  const updateTime = (index, newTime) => {
    const newTimes = [...times];
    newTimes[index] = newTime;
    setTimes(newTimes);
  };

  return (
    <div className="content-step2">
      <div className="step2-inner">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="워크스페이스 이름 입력(수업 이름 입력)"
          className="class-name"
        />

        <div className="time-list">
          {" "}
          {times.map((time, index) => (
            <TimeSelect
              key={index}
              index={index}
              time={time}
              onChange={updateTime}
              openIndex={openIndex}
              setOpenIndex={setOpenIndex}
            />
          ))}
        </div>

        <button className="add-time" onClick={addTime}>
          {" "}
          <img src={plus} />
          시간 추가
        </button>
      </div>
    </div>
  );
};

export default Step2Schedule;
