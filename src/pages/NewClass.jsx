import "../styles/NewClass.css";
import Header from "../components/Header";
import { useEffect, useState, useContext } from "react";
import api from "../api";
import backIcon from "../assets/SVG_NewClass/back.svg";
import { useNavigate } from "react-router-dom";
import { DataContext, DataDispatchContext } from "../App";
import Step1SelectType from "../components/Step1SelectType";
import Step2Schedule from "../components/Step2Schedule";
import Step3Invite from "../components/Step3Invite";
import BackButton from "../components/BackButton";

const NewClass = () => {
  const [step, setStep] = useState(1);
  const [projectType, setProjectType] = useState("");
  const [name, setName] = useState("");
  const [times, setTimes] = useState([]); //[{ day: "월요일", start: "09:00", end: "10:15" },...]
  const [teamMembers, setTeamMembers] = useState([]);

  const nav = useNavigate();

  const lastStep = projectType === "개인" ? 2 : 3;

  useEffect(() => {
    setTimes([]);
    setName("");
  }, [projectType]);

  const formatTimeSlots = () => {
    return times.map((t) => `${t.day.slice(0, 1)} ${t.start}-${t.end}`);
  };

  // function renderStep1() {
  //   return (
  //     <div className="content-step1">
  //       <div className="step1-inner">
  //         <p>개인 연습인가요, 팀 프로젝트인가요?</p>
  //         <div className="project-type">
  //           {/* 개인 */}
  //           <label
  //             className={`option ${projectType === "개인" ? "selected" : ""}`}
  //           >
  //             <input
  //               type="radio"
  //               name="projectType"
  //               value="개인"
  //               checked={projectType === "개인"}
  //               onChange={(e) => {
  //                 setProjectType(e.target.value);
  //               }}
  //             />
  //             <div className="option-left">
  //               <img src={userIcon} className="option-left_icon" />
  //               <span className="option-left_label">개인</span>
  //             </div>
  //             {projectType === "개인" && (
  //               <img src={checkIcon} className="option-check" />
  //             )}
  //           </label>

  //           {/* 팀 */}
  //           <label
  //             className={`option ${projectType === "팀" ? "selected" : ""}`}
  //           >
  //             <input
  //               type="radio"
  //               name="projectType"
  //               value="팀"
  //               checked={projectType === "팀"}
  //               onChange={(e) => {
  //                 setProjectType(e.target.value);
  //               }}
  //             />
  //             <div className="option-left">
  //               <img src={teamIcon} className="option-left_icon" />
  //               <span className="option-left_label">팀</span>
  //             </div>
  //             {projectType === "팀" && (
  //               <img src={checkIcon} className="option-check" />
  //             )}
  //           </label>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  // function renderStep2() {
  //   const addTime = () => {
  //     setTimes([...times, { day: "월요일", start: "09:00", end: "09:00" }]);
  //   };

  //   const updateTime = (index, newTime) => {
  //     const newTimes = [...times];
  //     newTimes[index] = newTime;
  //     setTimes(newTimes);
  //   };

  //   return (
  //     <div className="content-step2">
  //       <div className="step2-inner">
  //         <input
  //           type="text"
  //           value={name}
  //           onChange={(e) => setName(e.target.value)}
  //           placeholder="워크스페이스 이름 입력(수업 이름 입력)"
  //           className="class-name"
  //         />

  //         <div className="time-list">
  //           {" "}
  //           {times.map((time, index) => (
  //             <TimeSelect
  //               key={index}
  //               index={index}
  //               time={time}
  //               onChange={updateTime}
  //               openIndex={openIndex}
  //               setOpenIndex={setOpenIndex}
  //             />
  //           ))}
  //         </div>

  //         <button className="add-time" onClick={addTime}>
  //           {" "}
  //           <img src={plus} />
  //           시간 추가
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  // function renderStep3() {
  //   const addMember = () => {
  //     const found = mockUsers.find((user) => user.email === email.trim());

  //     if (!found) {
  //       setEmail("");
  //       setEmailPlaceholder("이메일을 다시 입력해주세요");
  //       return;
  //     }

  //     if (teamMembers.some((m) => m.email === found.email)) {
  //       setEmail("");
  //       setEmailPlaceholder("이미 추가된 팀원입니다");
  //       return;
  //     }

  //     setTeamMembers([...teamMembers, found]);
  //     setEmail("");
  //     setEmailPlaceholder("이메일 입력");
  //   };

  //   return (
  //     <div className="content-step3">
  //       <div className="step3-inner">
  //         <p>팀원을 초대해보세요</p>

  //         <div className="add-member">
  //           <div className="member-input">
  //             <input
  //               type="text"
  //               placeholder={emailPlaceholder}
  //               value={email}
  //               onChange={(e) => {
  //                 setEmail(e.target.value);
  //               }}
  //               onFocus={() => {
  //                 setEmailPlaceholder("이메일 입력");
  //               }}
  //             />
  //             <button onClick={addMember}>팀원 추가하기</button>
  //           </div>

  //           <div className="member-list">
  //             {teamMembers.length > 0 &&
  //               teamMembers.map((m) => (
  //                 <TeamMember
  //                   key={m.id}
  //                   name={m.name}
  //                   email={m.email}
  //                   avatar={m.avatar}
  //                 />
  //               ))}
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  function renderStep() {
    switch (step) {
      case 1:
        return (
          <Step1SelectType
            projectType={projectType}
            setProjectType={setProjectType}
          />
        );
      case 2:
        return (
          <Step2Schedule
            name={name}
            setName={setName}
            times={times}
            setTimes={setTimes}
          />
        );
      case 3:
        return (
          <Step3Invite
            teamMembers={teamMembers}
            setTeamMembers={setTeamMembers}
          />
        );
    }
  }

  //버튼 활성화 조건
  function isStepValid() {
    switch (step) {
      case 1:
        return projectType !== "";
      case 2:
        return name !== "" && times.length !== 0;
      case 3:
        return teamMembers.length !== 0;
    }
  }

  async function onSubmit() {
    if (step < lastStep) {
      setStep(step + 1);
      return;
    }

    try {
      const body = {
        workspaceName: name,
        workspaceMemberList: teamMembers.map((m) => m.email),
        workspaceTimeList: formatTimeSlots(),
      };
      console.log("요청 바디:", body);

      const res = await api.post("/workspace/create", body);
      console.log("응답:", res.data);

      const newClassId = res.data.workspaceId;

      nav(`/class/${newClassId}`);

      /*    name, times, lastVisited, isTeamProject, teamMembers */
    } catch (err) {
      console.error("워크스페이스 생성 실패:", err);
    }
  }

  return (
    <div className="NewClass">
      <Header />
      <div className="NewClass_header">
        <BackButton
          onClick={() => {
            step === 1 ? nav(-1) : setStep(step - 1);
          }}
        />
      </div>

      <div className="NewClass_step">
        <div className="step-content">{renderStep()}</div>

        <div className="step-footer">
          <button
            className={`step-footer_btn ${isStepValid() ? "active" : ""}`}
            disabled={!isStepValid()}
            onClick={() => onSubmit()}
          >
            {step < lastStep ? "다음으로" : "생성하기"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewClass;
