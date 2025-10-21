import "../styles/PresentationCard.css";
import ellipse from "../assets/SVG_Main/ellipse.svg";
import { getStringedDate } from "../util/get-stringed-date";
import { useNavigate } from "react-router-dom";

function getTimeAgo(lastVisited) {
  let t = new Date(lastVisited);
  let seconds = Math.floor((new Date() - t.getTime()) / 1000);
  if (seconds > 86400) return getStringedDate(t);
  if (seconds > 3600) return Math.floor(seconds / 3600) + "시간 전";
  if (seconds > 60) return Math.floor(seconds / 60) + "분 전";
  return "방금";
}

const PresentationCard = ({
  name,
  id,
  title,
  date,
  presenter,
  lastVisited,
  hasShadow = false,
  showBadge = true,
}) => {
  const nav = useNavigate();

  const timeAgo = getTimeAgo(lastVisited);

  return (
    <div
      className={`PresentationCard ${hasShadow ? "with-shadow" : ""}`}
      onClick={() => {
        nav(`/presentation/${id}`, {
          state: { name, title },
        });
      }}
    >
      <div className="presentation-card_thumb">
        {showBadge && <span className="badge">{name}</span>}
      </div>

      <div className="presentation-card_info">
        <h4 className="title">{title}</h4>

        <div className="meta">
          <div className="meta-left">
            <div className="meta-item">
              <span className="meta-item_label">발표일</span>{" "}
              <time dateTime={date}>{getStringedDate(new Date(date))}</time>
            </div>

            <div className="meta-item">
              <span className="meta-item_label">발표자</span>{" "}
              <img src={ellipse} />
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
