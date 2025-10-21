import "../styles/Class.css";
import backIcon from "../assets/SVG_NewClass/back.svg";
import selectArrow from "../assets/SVG_ClassHome/select-arrow.svg";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useState } from "react";
import { DataContext } from "../App";
import Header from "../components/Header";
import NewButton from "../components/NewButton";
import AvatarGroup from "../components/AvatarGroup";
import Presentations from "../components/Presentations";
import BackButton from "../components/BackButton";
import TeamMemberListModal from "../components/TeamMemberListModal";
import useOutsideClick from "../hooks/useOutsideClick";

const Class = () => {
  const nav = useNavigate();
  const params = useParams();
  const [isPresenterModalOpen, setIsPresenterModalOpen] = useState(false);
  const { classes, currentUser } = useContext(DataContext);
  const { id, name, times, isTeamProject, owner, teamMembers } =
    classes[params.id];

  const isOwner = owner.id === currentUser.id;

  const members = isOwner
    ? [owner, ...teamMembers]
    : [currentUser, owner, ...teamMembers];

  useOutsideClick(".Class_member-info", () => setIsPresenterModalOpen(false));

  return (
    <div className="Class">
      <div className="Class_hero-bg">
        <Header />
        <div className="Class_hero-inner">
          <BackButton
            onClick={() => {
              nav("/classHome");
            }}
          />
          <div className="Class_info">
            <h3 className="Class_name">{name}</h3>
            <div className="Class_times">
              {times.map((time, idx) => (
                <li key={`${id}-${idx}`}>{time}</li>
              ))}
            </div>
            <div className="Class_team-info">
              <div className="Class_owner-info">
                <span className="Class_team-label">OWNER</span>
                <img src={owner.avatar} />
                <p>{owner.name}</p>
              </div>
              {isTeamProject && (
                <div className="Class_member-info">
                  <span className="Class_team-label">TEAM</span>
                  <AvatarGroup members={members} spacing={-10} />
                  <img
                    src={selectArrow}
                    className="Class_select"
                    onClick={() =>
                      setIsPresenterModalOpen(!isPresenterModalOpen)
                    }
                  />
                  {isPresenterModalOpen && (
                    <TeamMemberListModal
                      teamMembers={members}
                      variant="class"
                    />
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="Class_actions">
            <NewButton
              text={"발표자료 추가하기"}
              link={"/newPresentation"}
              state={{ ...classes[id] }}
            />
          </div>
        </div>
      </div>
      <div className="Class_presentations">
        <Presentations context="class" classId={id} />
      </div>
    </div>
  );
};

export default Class;
