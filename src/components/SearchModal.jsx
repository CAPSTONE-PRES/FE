import "../styles/SearchModal.css";
import chevron from "../assets/SVG_Main/chevron.svg";
import { useNavigate } from "react-router-dom";

const SearchModal = ({ workspaces, projects }) => {
  const nav = useNavigate();

  return (
    <div className="SearchModal">
      <div className="SearchModal__content">
        {/* 클래스 섹션 */}
        <section className="search-section">
          <div className="workspace-item-wrapper">
            {workspaces.length > 0 && (
              <>
                <h4>클래스</h4>
                {workspaces.map((ws) => (
                  <div
                    key={ws.workspaceId}
                    className="workspace-item"
                    onClick={() => nav(`/class/${ws.workspaceId}`)}
                  >
                    <div className="workspace-item-left">
                      <div className="workspace-title">{ws.workspaceName}</div>
                      <div className="workspace-times">
                        {ws.workspaceTimeList?.map((t, idx) => (
                          <div key={idx}>{t}</div>
                        ))}
                      </div>
                    </div>
                    <div className="workspace-item-right">
                      <img src={chevron} />
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </section>

        {/* 발표자료 섹션 */}
        <section className="search-section">
          {projects.length > 0 && (
            <>
              <h4>발표자료</h4>
              {projects.map((p) => (
                <div
                  key={p.projectId}
                  className="project-item"
                  onClick={() => nav(`/presentation/${p.projectId}`)}
                >
                  <div
                    className="project-thumb"
                    style={{ backgroundImage: `url("${p.projectThumbnail}")` }}
                  />
                  <div className="project-info">
                    <div className="project-title">{p.projectTitle}</div>
                    <div className="project-sub">
                      <p className="project-workspace">{p.workspaceName}</p>
                      <p className="project-date">{p.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default SearchModal;
