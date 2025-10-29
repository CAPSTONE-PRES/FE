import BaseCalendar from "./BaseCalendar";
import prevLabel from "../../assets/SVG_NewPresentation/prevLabel.svg";
import nextLabel from "../../assets/SVG_NewPresentation/nextLabel.svg";

const ModalCalendar = ({ value, onChange }) => {
  return (
    <div>
      <BaseCalendar
        value={value}
        onChange={onChange}
        nextLabel={<img src={nextLabel}></img>}
        prevLabel={<img src={prevLabel}></img>}
        variant="modal"
        tile={18}
        gap={19}
      />
    </div>
  );
};

export default ModalCalendar;
