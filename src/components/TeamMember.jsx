import "../styles/TeamMember.css";

const TeamMember = ({ name, email, avatar, onRemove, onClick }) => {
  return (
    <div
      className={`TeamMember ${onClick ? "clickable" : ""}`}
      onClick={onClick}
    >
      <span
        className="tm-avatar"
        style={{ backgroundImage: `url(${avatar})` }}
      />
      <div className="tm-info">
        <p className="tm-name">{name}</p>
        <p className="tm-email">{email}</p>
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
