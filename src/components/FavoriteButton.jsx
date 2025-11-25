import "../styles/FavoriteButton.css";
import heart_Active from "../assets/SVG_Main/heart_Active.svg";
import heart_None from "../assets/SVG_Main/heart_None.svg";
import { DataContext } from "../App";
import { useState, useContext, useEffect } from "react";
import { toggleWorkspaceFavorite } from "../api/workspaceApi";

const FavoriteButton = ({ workspaceId }) => {
  const { favoriteIds, setFavoriteIds } = useContext(DataContext);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsFavorite(favoriteIds.includes(workspaceId));
  }, [favoriteIds, workspaceId]);

  const onClick = async (e) => {
    e.stopPropagation();
    if (loading) return;

    try {
      setLoading(true);
      const next = !isFavorite;

      await toggleWorkspaceFavorite(workspaceId, next);

      setFavoriteIds((prev) => {
        if (next) return [...prev, workspaceId];
        else return prev.filter((id) => id !== workspaceId);
      });
    } catch (err) {
      console.error("즐겨찾기 토글 실패: ", err);
      alert("잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="FavoriteButton">
      <button onClick={onClick}>
        <img src={isFavorite ? heart_Active : heart_None} />
      </button>
    </div>
  );
};

export default FavoriteButton;
