import { useState, useContext } from "react";
import "../styles/RecentPresentation.css";
import SortToggle from "./SortToggle";
import PresentationCard from "./PresentationCard";
import { getIsEmpty } from "../util/get-is-empty";
import { DataContext } from "../App";

const RecentPresentation = () => {
  const [sortBy, setSortBy] = useState("date");
  const { classes, presentations } = useContext(DataContext);

  function getSortedData(presentations) {
    if (sortBy === "date") {
      return Object.values(presentations)
        .filter((p) => p.lastPracticedAt)
        .toSorted(
          (a, b) => +new Date(b.lastPracticedAt) - +new Date(a.lastPracticedAt)
        )
        .slice(0, 8);
    } else {
      return Object.values(presentations)
        .filter((p) => p.lastPracticedAt)
        .toSorted((a, b) => a.title.localeCompare(b.title))
        .slice(0, 8);
    }
  }

  const recentPracticed = getSortedData(presentations);

  return (
    <div className="RecentPresentation">
      <section className="recent-presentation_title">
        <h3>최근 연습한 발표</h3>
      </section>
      <section className="recent-presentation_list">
        <SortToggle value={sortBy} onChange={(next) => setSortBy(next)} />
        {getIsEmpty(recentPracticed) ? (
          <div className="recent-empty-message">
            업로드 된 발표자료가 없어요!
            <br />
            발표자료를 업로드하고 발표 연습을 진행해보세요.
          </div>
        ) : (
          <div className="recent-list-wrapper">
            {recentPracticed.map((p) => (
              <PresentationCard
                key={p.id}
                classBadge={classes[p.classId].name}
                {...p}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default RecentPresentation;
