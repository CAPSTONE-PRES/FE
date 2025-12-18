import "../styles/PresentationCard.css";
import ellipse from "../assets/SVG_Main/ellipse.svg";
import { getStringedDate } from "../util/get-stringed-date";
import { useNavigate } from "react-router-dom";
import getTimeAgo from "../util/get-time-ago";
import { useContextMenu } from "../hooks/useContextMenu";
import { deleteProject } from "../api/projectApi";
import { useMemo } from "react";
import ContextMenu from "./ContextMenu";

const PresentationCard = ({
  workspaceName,
  projectId,
  projectTitle,
  projectThumbnail,
  date,
  presenterName,
  presenterProfileUrl,
  lastVisited,
  hasShadow = false,
  showBadge = true,
  onDeleted,
}) => {
  const nav = useNavigate();

  const timeAgo = getTimeAgo(lastVisited);

  const { isVisible, position, handleContextMenu, setIsVisible } =
    useContextMenu();

  const handleDelete = async () => {
    setIsVisible(false);

    const ok = window.confirm("이 프로젝트를 삭제할까요?");
    if (!ok) return;

    try {
      await deleteProject(projectId);
      onDeleted?.(projectId);
    } catch (e) {
      console.error(e);
      alert("프로젝트 삭제에 실패했습니다.");
    }
  };

  const menuItems = useMemo(
    () => [{ label: "발표 삭제", onClick: handleDelete }],
    []
  );

  return (
    <div
      className={`PresentationCard ${hasShadow ? "with-shadow" : ""}`}
      onClick={() => {
        if (isVisible) return;

        nav(`/presentation/${projectId}`, {
          state: { workspaceName, projectTitle },
        });
      }}
      onContextMenu={handleContextMenu}
    >
      <div
        className="presentation-card_thumb"
        style={{
          backgroundImage: `url("${projectThumbnail}")`,
        }}
      >
        {showBadge && <span className="badge">{workspaceName}</span>}
      </div>

      <div className="presentation-card_info">
        <h4 className="title">{projectTitle}</h4>

        <div className="meta">
          <div className="meta-left">
            <div className="meta-item">
              <span className="meta-item_label">발표일</span>{" "}
              <time dateTime={date}>{getStringedDate(new Date(date))}</time>
            </div>

            <div className="meta-item">
              <span className="meta-item_label">발표자</span>{" "}
              <img src={presenterProfileUrl} className="presenter-avatar" />
              <span className="presenter">{presenterName}</span>
            </div>
          </div>

          <time className="time-ago">{timeAgo}</time>
        </div>
      </div>

      {/* 우클릭 메뉴 */}
      <ContextMenu
        isVisible={isVisible}
        position={position}
        items={menuItems}
        onClose={() => setIsVisible(false)}
      />
    </div>
  );
};

export default PresentationCard;
