import "../styles/FavoriteClasses.css";
import right_Arrow from "../assets/SVG_Main/right_Arrow.svg";
import FavClassCard from "./FavClassCard";
import { getIsEmpty } from "../util/get-is-empty";
import { DataContext } from "../App";
import { useContext } from "react";

const FavoriteClasses = ({ type }) => {
  const { classes, favoriteClassIds } = useContext(DataContext);

  const favoriteClasses = favoriteClassIds
    .map((id) => classes[id])
    .filter(Boolean);
  return (
    <div className="FavoriteClasses">
      <section className="fav-class_title">
        <h3>즐겨찾는 Class</h3>
        {type === "HOME" ? (
          <a href="/classHome">
            모든 Class
            <img src={right_Arrow} />
          </a>
        ) : null}
      </section>
      <section className="fav-class_list">
        {getIsEmpty(favoriteClassIds) ? (
          <div className="fav-empty-message">
            만들어진 워크스페이스가 없어요!
            <br />
            워크스페이스를 만들고 발표자료를 관리해보세요.
          </div>
        ) : (
          <div className="fav-list-wrapper">
            {favoriteClasses.map((c) => (
              <FavClassCard key={c.id} {...c} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default FavoriteClasses;
