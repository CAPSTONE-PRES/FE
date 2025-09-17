import "../styles/SearchBar.css";
import search from "../assets/SVG_Main/search.svg";

const SearchBar = ({ type }) => {
  return (
    <div className="SearchBar">
      <input placeholder={type === "CLASS" ? "수업 찾기" : "발표자료 찾기"} />
      <button>
        <img src={search} />
      </button>
    </div>
  );
};

export default SearchBar;
