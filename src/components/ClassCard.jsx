import "../styles/ClassCard.css";
import FavoriteButton from "./FavoriteButton";
import AvatarGroup from "./AvatarGroup";
import { getStringedDate } from "../util/get-stringed-date";
import { useNavigate } from "react-router-dom";
import { useContext, useMemo } from "react";
import { DataContext } from "../App";
import { deleteWorkspace } from "../api/workspaceApi";
import { useContextMenu } from "../hooks/useContextMenu";
import ContextMenu from "./ContextMenu";

const ClassCard = ({
  workspaceId,
  workspaceName,
  workspaceTimeList,
  workspaceMemberList,
  workspaceOwnerName,
  workspaceOwnerProfileUrl,
  isOwner,
  thumbnailList,
  upComingDate,
  onDeleted,
}) => {
  const { currentUser } = useContext(DataContext);
  const nav = useNavigate();
  const { isVisible, position, handleContextMenu, setIsVisible } =
    useContextMenu();

  const isTeamProject = (workspaceMemberList?.length ?? 0) > 1;

  const handleDelete = async () => {
    setIsVisible(false);

    const ok = window.confirm(
      `"${workspaceName}" 클래스를 삭제할까요?\n(복구할 수 없습니다)`
    );
    if (!ok) return;

    try {
      await deleteWorkspace(workspaceId);
      onDeleted?.(workspaceId);
    } catch (err) {
      console.error("클래스 삭제 실패:", err);
      alert("클래스 삭제에 실패했습니다.");
    }
  };

  const menuItems = useMemo(() => {
    if (!isOwner) return [];
    return [{ label: "클래스 삭제", onClick: handleDelete }];
  }, [isOwner]);

  return (
    <div
      className="ClassCard"
      onClick={() => {
        if (isVisible) return;
        nav(`/class/${workspaceId}`);
      }}
      onContextMenu={handleContextMenu}
    >
      <div className="class-card_thumb">
        {Array.from({ length: 4 }).map((_, idx) => {
          const thumb = thumbnailList?.[idx];

          return (
            <div
              key={idx}
              className="thumbnail"
              style={
                thumb
                  ? {
                      backgroundImage: `url("${thumb}")`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }
                  : {}
              }
            ></div>
          );
        })}
      </div>

      <div className="class-card_header">
        <div>
          <h4 className="class-title">{workspaceName}</h4>
          <ul className="class-times">
            {workspaceTimeList.map((time, idx) => (
              <li key={`${workspaceId}-${idx}`}>{time}</li>
            ))}
          </ul>
        </div>
        <FavoriteButton workspaceId={workspaceId} />
      </div>

      <div className="class-card_info">
        <div className="next-presentation">
          <span className="class-card_label">다가오는 발표일</span>
          {upComingDate ? (
            <time dateTime={upComingDate} className="next-presentation-date">
              {getStringedDate(new Date(upComingDate))}
            </time>
          ) : (
            <span className="next-presentation-none">발표 없음</span>
          )}
        </div>
        <div className="team-info">
          <span className="class-card_label">팀원정보</span>
          <div className="avatars">
            <AvatarGroup
              members={isTeamProject ? workspaceMemberList : []}
              spacing={-18}
            />
          </div>
        </div>
      </div>

      <div className="class-card_footer">
        <button
          className="class-card_add"
          onClick={(e) => {
            e.stopPropagation();
            nav("/newPresentation", {
              state: {
                workspaceId,
                workspaceName,
                workspaceTimeList,
                workspaceMemberList,
                workspaceOwnerName,
                mode: "create",
              },
            });
          }}
        >
          발표자료 추가
        </button>
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

export default ClassCard;
