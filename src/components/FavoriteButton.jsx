import "../styles/FavoriteButton.css";
import heart_Active from "../assets/SVG_Main/heart_Active.svg";
import heart_None from "../assets/SVG_Main/heart_None.svg";
import { DataContext } from "../App";
import { useState, useContext } from "react";

const FavoriteButton = ({ id }) => {
  const { favoriteClassIds, setFavoriteClassIds } = useContext(DataContext);
  const isFavorite = favoriteClassIds.includes(id);

  const onClick = () => {
    setFavoriteClassIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((c) => c !== id);
      } else {
        if (prev.length >= 4) return prev;
        return [...prev, id];
      }
    });
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
