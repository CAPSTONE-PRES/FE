import "../styles/FavoriteClasses.css";
import right_Arrow from "../assets/SVG_Main/right_Arrow.svg";
import FavClassCard from "./FavClassCard";
import { getIsEmpty } from "../util/get-is-empty";
import { DataContext } from "../App";
import { useContext } from "react";
import { Link } from "react-router-dom";

const FavoriteClasses = ({ type }) => {
  const { classes, favoriteClassIds } = useContext(DataContext);

  const favoriteClasses = favoriteClassIds
    .map((id) => classes[id])
    .filter(Boolean);

  const emptyMessage = getIsEmpty(classes) ? (
    <>
      만들어진 워크스페이스가 없어요! <br />
      워크스페이스를 만들고 발표자료를 관리해보세요.
    </>
  ) : (
    <>
      이번 학기 발표 수업을 즐겨찾는 수업으로 <br /> 등록하면 빠르게 찾을 수
      있어요.
    </>
  );

  return (
    <div className="FavoriteClasses">
      <section className="fav-class_title">
        <h3>즐겨찾는 Class</h3>
        {type === "HOME" ? (
          <Link className="class-link" to={"/classHome"}>
            모든 Class
            <img src={right_Arrow} />
          </Link>
        ) : null}
      </section>
      <section className="fav-class_list">
        {getIsEmpty(favoriteClassIds) ? (
          <div className="fav-empty-message">{emptyMessage}</div>
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
