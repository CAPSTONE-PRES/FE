import "../styles/ClassHomeHero.css";
import SearchBar from "./SearchBar";
import FavoriteClasses from "./FavoriteClasses";
import NewButton from "./NewButton";

const ClassHomeHero = () => {
  return (
    <div className="ClassHomeHero">
      <div className="hero-actions">
        <SearchBar />
        <NewButton text={"클래스 생성하기"} link={"/newClass"} />
      </div>
      <div className="hero-fav-classes">
        <FavoriteClasses type={"CLASSHOME"} />
      </div>
    </div>
  );
};

export default ClassHomeHero;
