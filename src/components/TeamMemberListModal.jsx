import "../styles/TeamMemberListModal.css";
import TeamMember from "./TeamMember";

const TeamMemberListModal = ({ teamMembers, onSelect, variant }) => {
  return (
    <div className={`TeamMemberListModal ${variant}`}>
      {teamMembers.map((m) => (
        <TeamMember
          key={m.memberId}
          name={m.memberName}
          email={m.memberEmail}
          avatar={m.memberProfileUrl}
          onClick={() => onSelect(m)}
        />
      ))}
    </div>
  );
};

export default TeamMemberListModal;
