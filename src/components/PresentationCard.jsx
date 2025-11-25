import "../styles/PresentationCard.css";
import ellipse from "../assets/SVG_Main/ellipse.svg";
import { getStringedDate } from "../util/get-stringed-date";
import { useNavigate } from "react-router-dom";
import getTimeAgo from "../util/get-time-ago";

const PresentationCard = ({
  workspaceName,
  projectId,
  projectTitle,
  date,
  presenterName,
  presenterProfileUrl,
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
        nav(`/presentation/${projectId}`, {
          state: { workspaceName, projectTitle },
        });
      }}
    >
      <div className="presentation-card_thumb">
        {showBadge && <span className="badge">{workspaceName}</span>}
      </div>

      <div className="presentation-card_info">
        <h4 className="title">{projectTitle}</h4>

        <div className="meta">
          <div className="meta-left">
            <div className="meta-item">
              <span className="meta-item_label">발표일</span>{" "}
              <time dateTime={date}>{getStringedDate(new Date(date))}</time>
            </div>

            <div className="meta-item">
              <span className="meta-item_label">발표자</span>{" "}
              <img src={presenterProfileUrl} className="presenter-avatar" />
              <span className="presenter">{presenterName}</span>
            </div>
          </div>

          <time className="time-ago">{timeAgo}</time>
        </div>
      </div>
    </div>
  );
};

export default PresentationCard;
