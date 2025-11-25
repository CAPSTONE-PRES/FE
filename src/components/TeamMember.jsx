import "../styles/TeamMember.css";

const TeamMember = ({
  memberName,
  memberEmail,
  memberProfileUrl,
  onRemove,
  onClick,
}) => {
  return (
    <div
      className={`TeamMember ${onClick ? "clickable" : ""}`}
      onClick={onClick}
    >
      <span
        className="tm-avatar"
        style={{ backgroundImage: `url(${memberProfileUrl})` }}
      />
      <div className="tm-info">
        <p className="tm-name">{memberName}</p>
        <p className="tm-email">{memberEmail}</p>
      </div>
      {onRemove && (
        <button className="tm-remove-btn" onClick={onRemove}>
          제거
        </button>
      )}
    </div>
  );
};

export default TeamMember;
