import BaseCalendar from "./BaseCalendar";
import nextLabel from "../../assets/SVG_Main/nextLabel.svg";
import prevLabel from "../../assets/SVG_Main/prevLabel.svg";

const HomeCalendar = ({ value, onChange, eventDates }) => {
  return (
    <div>
      <BaseCalendar
        value={value}
        onChange={onChange}
        eventDates={eventDates}
        nextLabel={<img src={nextLabel} />}
        prevLabel={<img src={prevLabel} />}
      />
    </div>
  );
};

export default HomeCalendar;
