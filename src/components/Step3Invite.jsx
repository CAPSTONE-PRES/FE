import { useContext, useState } from "react";
import "../styles/Step3Invite.css";
import TeamMember from "../components/TeamMember";
import api from "../api";
import { flushSync } from "react-dom";
import { DataContext } from "../App";

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
  {
    id: "u6",
    name: "김승빈",
    avatar: "/avatars/user2.svg",
    email: "666@gmail.com",
  },
];

const Step3Invite = ({ teamMembers, setTeamMembers }) => {
  const [email, setEmail] = useState("");
  const [emailPlaceholder, setEmailPlaceholder] = useState("이메일 입력");
  const [loading, setLoading] = useState(false);
  const { currentUser } = useContext(DataContext);

  const addMember = async () => {
    const trimmed = email.trim();
    if (!trimmed) return;

    //중복검사
    if (teamMembers.some((m) => m.email === trimmed)) {
      setEmail("");
      setEmailPlaceholder("이미 추가된 팀원입니다");
      return;
    }

    try {
      setLoading(true);

      //회원 조회 api 호출
      const body = {
        memberEmail: trimmed,
      };
      const res = await api.post("/workspace/user/validation", body);
      const found = res.data;

      if (!found || !found.email || found.email === currentUser.email) {
        setEmail("");
        setEmailPlaceholder("이메일을 다시 입력해주세요");
        return;
      }

      //팀원 추가
      setTeamMembers([
        ...teamMembers,
        {
          name: found.name,
          email: found.email,
          avatar: found.profileUrl || "/avatars/user2.svg",
        },
      ]);

      setEmail("");
      setEmailPlaceholder("이메일 입력");
    } catch (err) {
      console.error("팀원 추가 실패: ", err);
      setEmail("");
      setEmailPlaceholder("이메일을 다시 입력해주세요");
    } finally {
      setLoading(false);
    }
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
                  key={m.email}
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
