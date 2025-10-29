import "../../styles/BaseCalendar.css";
import moment from "moment";
import Calendar from "react-calendar";
import { useState, useMemo, useRef, useEffect } from "react";
import { getStringedDate } from "../../util/get-stringed-date";

const WEEK_START = 1; //Monday

const BaseCalendar = ({
  value,
  onChange,
  eventDates, //optional
  nextLabel,
  prevLabel,
  variant = "home",
  tile = 32, //home: 32, modal: 18
  gap = 16, //home: 16,modal: 19
}) => {
  const wrapRef = useRef(null);
  const [activeStartDate, setActiveStartDate] = useState(new Date());

  //첫 번째 칸 오프셋
  const setFirstOffset = (px) => {
    if (wrapRef.current) {
      wrapRef.current.style.setProperty("--rc-first-offset", `${px}px`);
    }
  };

  const initialOffsetPx = useMemo(() => {
    const first = new Date(
      activeStartDate.getFullYear(),
      activeStartDate.getMonth(),
      1
    );
    const day = first.getDay();
    const col = (day - WEEK_START + 7) % 7;

    return col * (tile + gap);
  }, [activeStartDate, tile, gap]);

  useEffect(() => {
    setFirstOffset(initialOffsetPx);
  }, [initialOffsetPx]);

  return (
    <div ref={wrapRef} className={`calendar-wrap ${variant}`}>
      <Calendar
        value={value}
        onChange={onChange}
        formatDay={(locale, date) => moment(date).format("D")}
        formatMonthYear={(locale, date) =>
          variant === "home"
            ? `${moment(date).format("YYYY")} ${moment(date).format("M")}월`
            : `${moment(date).format("M")}월`
        }
        nextLabel={nextLabel}
        prevLabel={prevLabel}
        next2Label={null}
        prev2Label={null}
        showNeighboringMonth={false}
        minDetail="month"
        onActiveStartDateChange={({ activeStartDate }) =>
          setActiveStartDate(activeStartDate)
        }
        tileClassName={({ date, view }) => {
          if (view != "month") return undefined;
          return eventDates?.has(getStringedDate(date))
            ? "has-event"
            : undefined;
        }}
      />
    </div>
  );
};

export default BaseCalendar;
