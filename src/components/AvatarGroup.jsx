import "../styles/AvatarGroup.css";

const AvatarGroup = ({
  members = [],
  spacing,
  border = true,
  max = 4,
  showRemaining = true,
}) => {
  if (!members || members.length === 0) {
    return <span className="avatar-none">개인</span>;
  }

  const getVisibleMembers = () => {
    if (showRemaining) {
      return members.length <= max ? members : members.slice(0, max - 1);
    } else {
      return members.slice(0, max);
    }
  };

  return (
    <div className={`AvatarGroup ${border ? "" : "no-border"}`}>
      {getVisibleMembers().map((member, index) => (
        <span
          key={member.memberId}
          className="avatar"
          style={{
            backgroundImage: `url(${member.memberProfileUrl})`,
            marginLeft: index == 0 ? 0 : `${spacing}px`,
          }}
        />
      ))}

      {members.length > max && showRemaining && (
        <span
          className="avatar-more"
          style={{
            backgroundImage: `url(${members[max - 1].memberProfileUrl})`,
            marginLeft: `${spacing}px`,
          }}
        >
          +{members.length - (max - 1)}
        </span>
      )}
    </div>
  );
};

export default AvatarGroup;
