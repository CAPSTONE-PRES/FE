import "../styles/ClassCard.css";
import FavoriteButton from "./FavoriteButton";
import AvatarGroup from "./AvatarGroup";
import { getStringedDate } from "../util/get-stringed-date";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { DataContext } from "../App";

const ClassCard = ({
  workspaceId,
  workspaceName,
  workspaceTimeList,
  workspaceMemberList,
  workspaceOwnerName,
  workspaceOwnerProfileUrl,
  isOwner,
  upComingDate,
}) => {
  const { currentUser } = useContext(DataContext);
  const nav = useNavigate();

  const isTeamProject = (workspaceMemberList?.length ?? 0) > 1;

  return (
    <div
      className="ClassCard"
      onClick={() => {
        nav(`/class/${workspaceId}`);
      }}
    >
      <div className="class-card_thumb">
        <div className="thumbnail"></div>
        <div className="thumbnail"></div>
        <div className="thumbnail"></div>
        <div className="thumbnail"></div>
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
              },
            });
          }}
        >
          발표자료 추가
        </button>
      </div>
    </div>
  );
};

export default ClassCard;
