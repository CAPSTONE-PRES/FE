import "../styles/SearchBar.css";
import search from "../assets/SVG_Main/search.svg";

const SearchBar = () => {
  return (
    <div className="SearchBar">
      <input placeholder="검색하기" />
      <button>
        <img src={search} />
      </button>
    </div>
  );
};

export default SearchBar;
