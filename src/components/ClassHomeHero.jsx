import "../styles/ClassHomeHero.css";
import plus from "../assets/plus.svg";
import SearchBar from "./SearchBar";
import FavoriteClasses from "./FavoriteClasses";

const ClassHomeHero = () => {
  return (
    <div className="ClassHomeHero">
      <div className="hero-actions">
        <SearchBar type={"CLASS"} />
        <button className="new-button">
          <img src={plus} />
          클래스 생성하기
        </button>
      </div>
      <div className="hero-fav-classes">
        <FavoriteClasses type={"CLASSHOME"} />
      </div>
    </div>
  );
};

export default ClassHomeHero;
