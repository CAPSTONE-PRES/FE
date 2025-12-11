import "../styles/SearchBar.css";
import search from "../assets/SVG_Main/search.svg";

const SearchBar = ({ keyword, setKeyword, onSearch, onFocus }) => {
  return (
    <div className="SearchBar">
      <input
        value={keyword}
        placeholder="검색하기"
        onChange={(e) => setKeyword(e.target.value)}
        onFocus={onFocus}
      />
      <button onClick={onSearch}>
        <img src={search} />
      </button>
    </div>
  );
};

export default SearchBar;
