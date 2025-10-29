import "../styles/FavClassCard.css";
import FavoriteButton from "./FavoriteButton";
import { useNavigate } from "react-router-dom";

const FavClassCard = ({ id, name, times }) => {
  const nav = useNavigate();

  return (
    <div
      className="FavClassCard"
      onClick={() => {
        nav(`/class/${id}`);
      }}
    >
      <h4 className="fav-card_title">{name}</h4>
      <ul className="fav-card_times">
        {times.map((time, idx) => (
          <li key={`${id}-${idx}`}>{time}</li>
        ))}
      </ul>
      <div className="fav-card_fav">
        <FavoriteButton id={id} />
      </div>
    </div>
  );
};

export default FavClassCard;
