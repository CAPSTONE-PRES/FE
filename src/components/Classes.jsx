import { useState, useContext, useEffect } from "react";
import "../styles/Classes.css";
import SortToggle from "./SortToggle";
import ClassCard from "./ClassCard";
import { DataContext } from "../App";
import { getIsEmpty } from "../util/get-is-empty";
import { getWorkspaceList } from "../api/workspaceApi";
import { getProjectList } from "../api/projectApi";

const Classes = () => {
  //   const { classes, presentations } = useContext(DataContext);
  const [workspaces, setWorkspaces] = useState([]);
  const [sortBy, setSortBy] = useState("date");
  const [filterBy, setFilterBy] = useState("all");

  const SORT_OPRIONS = [
    { key: "date", label: "최근방문" },
    { key: "title", label: "제목순" },
  ];

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const typeMap = { date: 1, title: 2 };
        const type = typeMap[sortBy] ?? 1;
        const data = await getWorkspaceList(type);
        setWorkspaces(data);
      } catch (err) {
        console.error("워크스페이스 불러오기 실패:", err);
      }
    };

    fetchWorkspaces();
  }, [sortBy]);

  function onChangeFilterBy(e) {
    setFilterBy(e.target.value);
  }

  //다가오는 발표
  // function getUpcomingDate(classId) {
  //   if (getIsEmpty(presentations)) return null;
  //   else
  //     return Object.values(presentations)
  //       .filter((p) => p.classId === classId && new Date(p.date) >= new Date())
  //       .toSorted((a, b) => +new Date(a.date) - +new Date(b.date))[0]?.date;
  // }

  // //클래스 정렬
  // function getSortedClasses() {
  //   if (sortBy === "date") {
  //     // return Object.values(classes).toSorted(
  //     //   (a, b) => +new Date(b.lastVisited) - +new Date(a.lastVisited)
  //     // );
  //     return Object.values(classes);
  //   } else {
  //     return Object.values(classes).toSorted((a, b) =>
  //       a.name.localeCompare(b.name)
  //     );
  //   }
  // }

  // const sortedClasses = getSortedClasses();

  //정렬된 클래스 필터링
  function getFilteredWorkspaces() {
    if (filterBy === "shared") {
      return workspaces.filter((w) => w.workspaceMemberList?.length > 1);
    } else if (filterBy === "private") {
      return workspaces.filter((w) => w.workspaceMemberList?.length <= 1);
    } else {
      return workspaces;
    }
  }

  const filteredWorkspaces = getFilteredWorkspaces();

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
        {getIsEmpty(filteredWorkspaces) ? (
          <div className="class-empty-message">
            {" "}
            만들어진 워크스페이스가 없어요!
            <br />
            워크스페이스를 만들고 수업별로 발표자료를 관리해보세요.
          </div>
        ) : (
          <div className="class-list-wrapper">
            {filteredWorkspaces.map((w) => (
              <ClassCard key={w.workspaceId} upComingDate={null} {...w} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Classes;
