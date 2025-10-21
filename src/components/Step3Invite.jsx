import { useState } from "react";
import "../styles/Step3Invite.css";
import TeamMember from "../components/TeamMember";

const mockUsers = [
  {
    id: "u2",
    name: "김민지",
    avatar: "/avatars/user2.svg",
    email: "222@gmail.com",
  },
  {
    id: "u3",
    name: "이호성",
    avatar: "/avatars/user3.svg",
    email: "333@gmail.com",
  },
  {
    id: "u4",
    name: "김소영",
    avatar: "/avatars/user4.svg",
    email: "444@gmail.com",
  },
  {
    id: "u5",
    name: "김현서",
    avatar: "/avatars/user1.svg",
    email: "555@gmail.com",
  },
];

const Step3Invite = ({ teamMembers, setTeamMembers }) => {
  const [email, setEmail] = useState("");
  const [emailPlaceholder, setEmailPlaceholder] = useState("이메일 입력");

  const addMember = () => {
    const found = mockUsers.find((user) => user.email === email.trim());

    if (!found) {
      setEmail("");
      setEmailPlaceholder("이메일을 다시 입력해주세요");
      return;
    }

    if (teamMembers.some((m) => m.email === found.email)) {
      setEmail("");
      setEmailPlaceholder("이미 추가된 팀원입니다");
      return;
    }

    setTeamMembers([...teamMembers, found]);
    setEmail("");
    setEmailPlaceholder("이메일 입력");
  };

  const removeMember = (email) => {
    const updated = teamMembers.filter((m) => m.email !== email);
    setTeamMembers(updated);
    return;
  };

  return (
    <div className="content-step3">
      <div className="step3-inner">
        <p>팀원을 초대해보세요</p>

        <div className="add-member">
          <div className="member-input">
            <input
              type="text"
              placeholder={emailPlaceholder}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              onFocus={() => {
                setEmailPlaceholder("이메일 입력");
              }}
            />
            <button onClick={addMember}>팀원 추가하기</button>
          </div>

          <div className="member-list">
            {teamMembers.length > 0 &&
              teamMembers.map((m) => (
                <TeamMember
                  key={m.id}
                  {...m}
                  onRemove={() => removeMember(m.email)}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3Invite;
