import { useNavigate } from "react-router-dom";
import "../styles/UpcomingItem.css";
import { getStringedDate } from "../util/get-stringed-date";

const UpcomingItem = ({ id, classBadge, title, date }) => {
  const nav = useNavigate();

  return (
    <div className="UpcomingItem" onClick={() => nav(`presentation/${id}`)}>
      <time className="upcoming-date" dateTime={date}>
        {getStringedDate(new Date(date))}
      </time>
      <span className="upcoming-subject">{classBadge}</span>
      <p className="upcoming-title">{title}</p>
    </div>
  );
};

export default UpcomingItem;
