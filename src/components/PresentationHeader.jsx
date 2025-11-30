import "../styles/PresentationHeader.css";
import logo from "../assets/SVG_Presentation/presColor.svg";
import playIcon from "../assets/SVG_Presentation/play.svg";
import separator from "../assets/SVG_Presentation/chevron-right.svg";
import xIcon from "../assets/SVG_Practice/x.svg";
import { useContext } from "react";
import { DataContext } from "../App";
import { useNavigate } from "react-router-dom";
import { deleteProject } from "../api/projectApi";

const PresentationHeader = ({
  id,
  workspaceId,
  workspaceName,
  title,
  mode,
}) => {
  const { presentations } = useContext(DataContext);
  const nav = useNavigate();

  return (
    <div className="PresentationHeader">
      <div className="header-left">
        <img src={logo} onClick={() => nav("/")} />
        <div className="header-left_title">
          <span className="header-title">{workspaceName}</span>
          <img src={separator} />
          <span className="header-title">{title}</span>
        </div>
      </div>
      <div className="header-right">
        {mode === "splitView" ? (
          <>
            {" "}
            <button
              onClick={async () => {
                try {
                  await deleteProject(id);
                  nav(`/class/${workspaceId}`);
                } catch (err) {
                  console.error("프로젝트 삭제 실패:", err);
                }
              }}
            >
              삭제
            </button>
            <button
              className="header_btn-outline"
              onClick={() => nav(`/class/${workspaceId}`)}
            >
              Class로 돌아가기
            </button>
            <button
              className="header_btn-primary"
              onClick={() => nav(`/practice/${id}`)}
            >
              <img src={playIcon} />
              연습하기
            </button>
          </>
        ) : (
          <button
            className="header_btn-back"
            onClick={() => nav(`/presentation/${id}`)}
          >
            <img src={xIcon} />
          </button>
        )}
      </div>
    </div>
  );
};

export default PresentationHeader;
