import "../styles/FavClassCard.css";
import FavoriteButton from "./FavoriteButton";
import { useNavigate } from "react-router-dom";

const FavClassCard = ({ workspaceId, workspaceName, workspaceTimeList }) => {
  const nav = useNavigate();

  return (
    <div
      className="FavClassCard"
      onClick={() => {
        nav(`/class/${workspaceId}`);
      }}
    >
      <h4 className="fav-card_title">{workspaceName}</h4>
      <ul className="fav-card_times">
        {workspaceTimeList.map((time, idx) => (
          <li key={`${workspaceId}-${idx}`}>{time}</li>
        ))}
      </ul>
      <div className="fav-card_fav">
        <FavoriteButton workspaceId={workspaceId} />
      </div>
    </div>
  );
};

export default FavClassCard;
