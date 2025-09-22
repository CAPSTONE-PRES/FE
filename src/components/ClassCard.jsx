import "../styles/ClassCard.css";
import FavoriteButton from "./FavoriteButton";
import test from "../assets/SVG_Main/user/user1.svg";
import { getStringedDate } from "../util/get-stringed-date";

const ClassCard = ({ id, name, times, teamMembers, upComingDate }) => {
  function renderTeamMembers(teamMembers) {
    if (!teamMembers || teamMembers.length === 0) {
      return <span className="avatar-none">개인</span>;
    }

    const visibleMembers =
      teamMembers.length <= 4 ? teamMembers : teamMembers.slice(0, 3);

    return (
      <>
        {visibleMembers.map((member) => (
          <span
            key={member.id}
            className="avatar"
            style={{ backgroundImage: `url(${member.avatar})` }}
          />
        ))}

        {teamMembers.length > 4 && (
          <span
            className="avatar-more"
            style={{ backgroundImage: `url(${teamMembers[3].avatar})` }}
          >
            +{teamMembers.length - 3}
          </span>
        )}
      </>
    );
  }

  return (
    <div className="ClassCard">
      <div className="class-card_thumb">
        <div className="thumbnail"></div>
        <div className="thumbnail"></div>
        <div className="thumbnail"></div>
        <div className="thumbnail"></div>
      </div>

      <div className="class-card_header">
        <div>
          <h4 className="class-title">{name}</h4>
          <ul className="class-times">
            {times.map((time, idx) => (
              <li key={`${id}-${idx}`}>{time}</li>
            ))}
          </ul>
        </div>
        <FavoriteButton id={id} />
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
          <div className="avatars">{renderTeamMembers(teamMembers)}</div>
        </div>
      </div>

      <div className="class-card_footer">
        <button className="class-card_add">발표자료 추가</button>
      </div>
    </div>
  );
};

export default ClassCard;
