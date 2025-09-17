import "../styles/UpcomingItem.css";
import { getStringedDate } from "../util/get-stringed-date";

const UpcomingItem = ({ classBadge, title, date }) => {
  return (
    <div className="UpcomingItem">
      <time className="upcoming-date" dateTime={date}>
        {getStringedDate(new Date(date))}
      </time>
      <span className="upcoming-subject">{classBadge}</span>
      <p className="upcoming-title">{title}</p>
    </div>
  );
};

export default UpcomingItem;
