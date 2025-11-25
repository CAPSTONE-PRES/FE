import "../styles/FavoriteClasses.css";
import right_Arrow from "../assets/SVG_Main/right_Arrow.svg";
import FavClassCard from "./FavClassCard";
import { getIsEmpty } from "../util/get-is-empty";
import { DataContext } from "../App";
import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { getFavWorkspaces } from "../api/workspaceApi";

const FavoriteClasses = ({ type }) => {
  const { favoriteIds } = useContext(DataContext);
  const [favoriteClasses, setFavoriteClasses] = useState([]);

  // const favoriteClasses = favoriteClassIds
  //   .map((id) => classes[id])
  //   .filter(Boolean);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const data = await getFavWorkspaces();
        setFavoriteClasses(data);
      } catch (err) {
        console.error("즐겨찾는 클래스 불러오기 실패: ", err);
      }
    };

    fetchFavorites();
  }, [favoriteIds]);

  const emptyMessage = (
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
        {getIsEmpty(favoriteClasses) ? (
          <div className="fav-empty-message">{emptyMessage}</div>
        ) : (
          <div className="fav-list-wrapper">
            {favoriteClasses.map((w) => (
              <FavClassCard key={w.workspaceId} {...w} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default FavoriteClasses;
