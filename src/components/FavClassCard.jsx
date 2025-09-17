import "../styles/FavClassCard.css";
import FavoriteButton from "./FavoriteButton";

const FavClassCard = ({ id, name, times }) => {
  return (
    <div className="FavClassCard">
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
