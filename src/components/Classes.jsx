import { useState, useContext } from "react";
import "../styles/Classes.css";
import SortToggle from "./SortToggle";
import ClassCard from "./ClassCard";
import { DataContext } from "../App";
import { getIsEmpty } from "../util/get-is-empty";

const Classes = () => {
  const { classes, presentations } = useContext(DataContext);
  const [sortBy, setSortBy] = useState("date");
  const [filterBy, setFilterBy] = useState("all");

  const SORT_OPRIONS = [
    { key: "date", label: "최근방문" },
    { key: "title", label: "제목순" },
  ];

  function onChangeFilterBy(e) {
    setFilterBy(e.target.value);
  }

  //다가오는 발표
  function getUpcomingDate(classId) {
    if (getIsEmpty(presentations)) return [];
    else
      return Object.values(presentations)
        .filter((p) => p.classId === classId && new Date(p.date) >= new Date())
        .toSorted((a, b) => +new Date(a.date) - +new Date(b.date))[0]?.date;
  }

  //클래스 정렬
  function getSortedClasses() {
    if (sortBy === "date") {
      return Object.values(classes).toSorted(
        (a, b) => +new Date(b.lastVisited) - +new Date(a.lastVisited)
      );
    } else {
      return Object.values(classes).toSorted((a, b) =>
        a.name.localeCompare(b.name)
      );
    }
  }

  const sortedClasses = getSortedClasses();

  //정렬된 클래스 필터링
  function getFilteredClasses() {
    if (filterBy === "shared") {
      return sortedClasses.filter((c) => c.isTeamProject);
    } else if (filterBy === "private") {
      return sortedClasses.filter((c) => !c.isTeamProject);
    } else {
      return sortedClasses;
    }
  }

  const filteredClasses = getFilteredClasses();

  return (
    <div className="Classes">
      <section className="classes_title">
        <h3>Class</h3>
      </section>

      <section className="classes_list">
        <div className="classes_toolbar">
          <SortToggle
            value={sortBy}
            onChange={(next) => setSortBy(next)}
            options={SORT_OPRIONS}
          />
          <select onChange={onChangeFilterBy}>
            <option value="all">All</option>
            <option value="shared">공유된 워크스페이스</option>
            <option value="private">개인 워크스페이스</option>
          </select>
        </div>
        {getIsEmpty(filteredClasses) ? (
          <div className="class-empty-message">
            {" "}
            만들어진 워크스페이스가 없어요!
            <br />
            워크스페이스를 만들고 수업별로 발표자료를 관리해보세요.
          </div>
        ) : (
          <div className="class-list-wrapper">
            {filteredClasses.map((c) => (
              <ClassCard
                key={c.id}
                upComingDate={getUpcomingDate(c.id) ?? null}
                {...c}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Classes;
