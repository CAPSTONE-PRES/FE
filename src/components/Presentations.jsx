import { useState, useContext, useEffect } from "react";
import "../styles/Presentations.css";
import SortToggle from "./SortToggle";
import PresentationCard from "./PresentationCard";
import { getIsEmpty } from "../util/get-is-empty";
import { getProjectList } from "../api/projectApi";
import { getWorkspaceProjectList } from "../api/workspaceApi";

const Presentations = ({ context = "home", workspaceId }) => {
  const [sortBy, setSortBy] = useState("date");
  const [presentations, setPresentations] = useState([]);

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

  useEffect(() => {
    const fetchPresentations = async () => {
      try {
        const typeMap = { date: 1, title: 2, presentationDate: 3 };
        const type = typeMap[sortBy] ?? 1;

        let data = [];

        if (context === "home") {
          data = await getProjectList(type);
        } else if (context === "class") {
          data = await getWorkspaceProjectList(workspaceId, type);
        }
        console.log("프로젝트 리스트:", data);

        setPresentations(data);
      } catch (err) {
        console.error("프로젝트 리스트 불러오기 실패: ", err);
      }
    };

    fetchPresentations();
  }, [context, sortBy, workspaceId]);

  // function getSortedData(presentations) {
  //   const list = Object.values(presentations);

  //   if (sortBy === "date") {
  //     return list
  //       .filter((p) => p.lastVisited)
  //       .toSorted(
  //         (a, b) => +new Date(b.lastVisited) - +new Date(a.lastVisited)
  //       );
  //   } else if (sortBy === "presentationDate") {
  //     return list
  //       .filter((p) => p.date)
  //       .toSorted((a, b) => +new Date(b.date) - +new Date(a.date));
  //   } else {
  //     return list.toSorted((a, b) => a.title.localeCompare(b.title));
  //   }
  // }

  // const sortedData = getSortedData(filteredData);

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
        {getIsEmpty(presentations) ? (
          <div className="Presentations_empty-message">
            업로드 된 발표자료가 없어요!
            <br />
            발표자료를 업로드하고 발표 연습을 진행해보세요.
          </div>
        ) : (
          <div className="Presentations_wrapper">
            {presentations.map((p) => (
              <PresentationCard
                key={p.projectId}
                workspaceName={p.workspaceName}
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
