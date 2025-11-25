import "../styles/Class.css";
import backIcon from "../assets/SVG_NewClass/back.svg";
import api from "../api";
import selectArrow from "../assets/SVG_ClassHome/select-arrow.svg";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import NewButton from "../components/NewButton";
import AvatarGroup from "../components/AvatarGroup";
import Presentations from "../components/Presentations";
import BackButton from "../components/BackButton";
import TeamMemberListModal from "../components/TeamMemberListModal";
import useOutsideClick from "../hooks/useOutsideClick";
import { getWorkspaceInfo, deleteWorkspace } from "../api/workspaceApi";

const Class = () => {
  const nav = useNavigate();
  const { id: workspaceId } = useParams();

  const [workspaceInfo, setWorkspaceInfo] = useState(null);
  const [isPresenterModalOpen, setIsPresenterModalOpen] = useState(false);

  useOutsideClick(".Class_member-info", () => setIsPresenterModalOpen(false));

  useEffect(() => {
    const fetchWorkspace = async () => {
      try {
        const data = await getWorkspaceInfo(workspaceId);
        setWorkspaceInfo(data);
        console.log("워크스페이스 정보:", data);
      } catch (err) {
        console.error("워크스페이스 정보 불러오기 실패:", err);
      }
    };
    fetchWorkspace();
  }, []);

  if (!workspaceInfo) return <div></div>;

  const {
    workspaceName,
    workspaceTimeList,
    workspaceOwnerName,
    workspaceOwnerProfileUrl,
    workspaceMemberList,
    isOwner,
  } = workspaceInfo;

  const isTeamProject = (workspaceMemberList?.length ?? 0) > 1;

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
            <h3 className="Class_name">{workspaceName}</h3>
            <div className="Class_times">
              {workspaceTimeList.map((time, idx) => (
                <li key={`${workspaceId}-${idx}`}>{time}</li>
              ))}
            </div>
            <div className="Class_team-info">
              <div className="Class_owner-info">
                <span className="Class_team-label">OWNER</span>
                <img src={workspaceOwnerProfileUrl} />
                <p>{workspaceOwnerName}</p>
              </div>
              {isTeamProject && (
                <div className="Class_member-info">
                  <span className="Class_team-label">TEAM</span>
                  <AvatarGroup members={workspaceMemberList} spacing={-10} />
                  <img
                    src={selectArrow}
                    className="Class_select"
                    onClick={() =>
                      setIsPresenterModalOpen(!isPresenterModalOpen)
                    }
                  />
                  {isPresenterModalOpen && (
                    <TeamMemberListModal
                      teamMembers={workspaceMemberList}
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
              state={{ workspaceId, workspaceMemberList, workspaceName }}
            />
          </div>
        </div>
      </div>
      <div className="Class_presentations">
        <Presentations context="class" workspaceId={workspaceId} />
      </div>
      {/* 임시 삭제 버튼(state 반영X) */}
      <button
        onClick={async () => {
          try {
            await deleteWorkspace(workspaceId);
            nav("/classHome");
          } catch (err) {
            console.log("클래스 삭제 실패: ", err);
          }
        }}
      >
        클래스 삭제
      </button>
    </div>
  );
};

export default Class;
