import "../styles/Step1SelectType.css";
import userIcon from "../assets/SVG_NewClass/Icon_personal.svg";
import teamIcon from "../assets/SVG_NewClass/Icon_team.svg";
import checkIcon from "../assets/SVG_NewClass/check.svg";

const Step1SelectType = ({ projectType, setProjectType }) => {
  return (
    <div className="content-step1">
      <div className="step1-inner">
        <p>개인 연습인가요, 팀 프로젝트인가요?</p>
        <div className="project-type">
          {/* 개인 */}
          <label
            className={`option ${projectType === "개인" ? "selected" : ""}`}
          >
            <input
              type="radio"
              name="projectType"
              value="개인"
              checked={projectType === "개인"}
              onChange={(e) => {
                setProjectType(e.target.value);
              }}
            />
            <div className="option-left">
              <img src={userIcon} className="option-left_icon" />
              <span className="option-left_label">개인</span>
            </div>
            {projectType === "개인" && (
              <img src={checkIcon} className="option-check" />
            )}
          </label>

          {/* 팀 */}
          <label className={`option ${projectType === "팀" ? "selected" : ""}`}>
            <input
              type="radio"
              name="projectType"
              value="팀"
              checked={projectType === "팀"}
              onChange={(e) => {
                setProjectType(e.target.value);
              }}
            />
            <div className="option-left">
              <img src={teamIcon} className="option-left_icon" />
              <span className="option-left_label">팀</span>
            </div>
            {projectType === "팀" && (
              <img src={checkIcon} className="option-check" />
            )}
          </label>
        </div>
      </div>
    </div>
  );
};

export default Step1SelectType;
