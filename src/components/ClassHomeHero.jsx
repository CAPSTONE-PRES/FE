import "../styles/ClassHomeHero.css";
import SearchBar from "./SearchBar";
import SearchModal from "./SearchModal";
import FavoriteClasses from "./FavoriteClasses";
import NewButton from "./NewButton";
import { useEffect, useState } from "react";
import { searchWorkspaces } from "../api/workspaceApi";
import { searchProjects } from "../api/projectApi";

const ClassHomeHero = () => {
  const [keyword, setKeyword] = useState("");
  const [workspaceResults, setWorkspaceResults] = useState([]);
  const [projectResults, setProjectResults] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const delay = setTimeout(async () => {
      if (!keyword.trim()) {
        setWorkspaceResults([]);
        setProjectResults([]);
        setSearchOpen(false);
        return;
      }

      try {
        const ws = await searchWorkspaces(keyword);
        const pj = await searchProjects(keyword);

        setWorkspaceResults(ws);
        setProjectResults(pj);

        if (ws.length > 0 || pj.length > 0) {
          setSearchOpen(true);
        } else {
          setSearchOpen(false);
        }
      } catch (err) {
        console.error("검색 실패:", err);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [keyword]);

  return (
    <div className="ClassHomeHero">
      <div className="hero-actions">
        <div className="search-wrapper">
          <SearchBar
            keyword={keyword}
            setKeyword={setKeyword}
            onFocus={() => {
              if (workspaceResults.length > 0 || projectResults.length > 0) {
                setSearchOpen(true);
              }
            }}
          />

          {searchOpen &&
            (workspaceResults.length > 0 || projectResults.length > 0) && (
              <SearchModal
                workspaces={workspaceResults}
                projects={projectResults}
              />
            )}
        </div>
        <NewButton text={"클래스 생성하기"} link={"/newClass"} />
      </div>
      <div className="hero-fav-classes">
        <FavoriteClasses type={"CLASSHOME"} />
      </div>
    </div>
  );
};

export default ClassHomeHero;
