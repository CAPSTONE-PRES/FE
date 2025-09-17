import "../styles/PresentationCard.css";
import ellipse from "../assets/SVG_Main/ellipse.svg";
import { getStringedDate } from "../util/get-stringed-date";

function getTimeAgo(lastPracticedAt) {
  let t = new Date(lastPracticedAt);
  let seconds = Math.floor((new Date() - t.getTime()) / 1000);
  if (seconds > 86400) return getStringedDate(t);
  if (seconds > 3600) return Math.floor(seconds / 3600) + "시간 전";
  if (seconds > 60) return Math.floor(seconds / 60) + "분 전";
  return "방금";
}

const PresentationCard = ({
  classBadge,
  title,
  date,
  presenter,
  lastPracticedAt,
}) => {
  const timeAgo = getTimeAgo(lastPracticedAt);
  return (
    <div className="PresentationCard">
      <div className="presentation-card_thumb">
        <span className="badge">{classBadge}</span>
      </div>

      <div className="presentation-card_info">
        <h4 className="title">{title}</h4>

        <div className="meta">
          <div className="meta-left">
            <div className="meta-item">
              <span className="label">발표일</span>{" "}
              <time dateTime={date}>{getStringedDate(new Date(date))}</time>
            </div>

            <div className="meta-item">
              <span className="label">발표자</span> <img src={ellipse} />
              <span className="presenter">{presenter}</span>
            </div>
          </div>

          <time className="time-ago">{timeAgo}</time>
        </div>
      </div>
    </div>
  );
};

export default PresentationCard;
