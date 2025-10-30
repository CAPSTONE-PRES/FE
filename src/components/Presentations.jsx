import { useState, useContext } from "react";
import "../styles/Presentations.css";
import SortToggle from "./SortToggle";
import PresentationCard from "./PresentationCard";
import { getIsEmpty } from "../util/get-is-empty";
import { DataContext } from "../App";

const Presentations = ({ context = "home", classId }) => {
  const [sortBy, setSortBy] = useState("title");
  const { classes, presentations } = useContext(DataContext);

  const filteredData =
    context === "home"
      ? presentations
      : Object.values(presentations).filter((p) => p.classId === classId);

  const SORT_OPTIONS =
    context === "home"
      ? [
          { key: "date", label: "날짜순" },
          { key: "title", label: "제목순" },
        ]
      : [
          { key: "date", label: "최근방문" },
          { key: "presentationDate", label: "발표일순" },
          { key: "title", label: "제목순" },
        ];

  function getSortedData(presentations) {
    const list = Object.values(presentations);

    if (sortBy === "date") {
      return list
        .filter((p) => p.lastVisited)
        .toSorted(
          (a, b) => +new Date(b.lastVisited) - +new Date(a.lastVisited)
        );
    } else if (sortBy === "presentationDate") {
      return list
        .filter((p) => p.date)
        .toSorted((a, b) => +new Date(b.date) - +new Date(a.date));
    } else {
      return list.toSorted((a, b) => a.title.localeCompare(b.title));
    }
  }

  const sortedData = getSortedData(filteredData);

  return (
    <div className="Presentations">
      {context === "home" && (
        <section className="Presentations_title">
          <h3>최근 연습한 발표</h3>
        </section>
      )}
      <section className="Presentations_list">
        <SortToggle
          value={sortBy}
          onChange={(next) => setSortBy(next)}
          options={SORT_OPTIONS}
        />
        {getIsEmpty(sortedData) ? (
          <div className="Presentations_empty-message">
            업로드 된 발표자료가 없어요!
            <br />
            발표자료를 업로드하고 발표 연습을 진행해보세요.
          </div>
        ) : (
          <div className="Presentations_wrapper">
            {sortedData.map((p) => (
              <PresentationCard
                key={p.id}
                name={classes[p.classId].name}
                hasShadow={context === "class"}
                showBadge={context === "home"}
                {...p}
              />
            ))}
          </div>
        )}
      </section>
      <div></div>
    </div>
  );
};

export default Presentations;
