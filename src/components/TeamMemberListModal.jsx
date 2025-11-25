import "../styles/TeamMemberListModal.css";
import TeamMember from "./TeamMember";

const TeamMemberListModal = ({ teamMembers, onSelect, variant }) => {
  return (
    <div className={`TeamMemberListModal ${variant}`}>
      {teamMembers.map((m) => (
        <TeamMember key={m.memberId} {...m} onClick={() => onSelect(m)} />
      ))}
    </div>
  );
};

export default TeamMemberListModal;
