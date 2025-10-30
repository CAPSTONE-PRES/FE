import PresentationHeader from "../components/PresentationHeader";
import { getProjectInfo } from "../api/projectApi";
import "../styles/PracticeMode.css";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLoading } from "../contexts/LoadingContext";
import { getSlides } from "../api/fileApi";
import PracticeFooter from "../components/PracticeFooter";
import qnaImg from "../assets/SVG_Practice/qna.svg";

const PracticeMode = () => {
  const nav = useNavigate();
  const params = useParams();
  const [projectInfo, setProjectInfo] = useState(null);
  const [slides, setSlides] = useState([]);
  const [currnetIndex, setCurrentIndex] = useState(0);
  const [step, setStep] = useState(1);
  const { showLoading, hideLoading } = useLoading();

  //프로젝트 정보 불러오기
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const project = await getProjectInfo(params.id);
        console.log("project: ", project);
        setProjectInfo(project);

        if (project.fileIds && project.fileIds.length > 0) {
          const fileId = project.fileIds[0];
          const imageList = await getSlides(fileId);
          setSlides(imageList);
        }
      } catch (err) {
        console.error("프로젝트 정보 불러오기 실패:", err);
      }
    };

    fetchProject();
  }, [params.id]);

  //키 입력으로 슬라이드 전환
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        setCurrentIndex((prev) => Math.min(prev + 1, slides.length - 1));
      } else if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [slides]);

  if (!projectInfo) {
    return <div className="PracticeMode"></div>;
  }

  const { projectId, projectTitle, workspaceName, limitTime } = projectInfo;
  console.log("limitTime:", limitTime);

  const handleFeedbackClick = async () => {
    showLoading("발표 피드백 중");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    hideLoading();
    nav("/feedback");
  };

  return (
    <div className="PracticeMode">
      <div className="PracticeMode__header">
        <PresentationHeader
          id={projectId}
          workspaceName={workspaceName}
          title={projectTitle}
          mode="practice"
        />
      </div>
      {step === 1 && (
        <>
          <div className="PracticeMode__slide">
            {slides.length > 0 ? (
              <img
                src={slides[currnetIndex]}
                alt={`slide-${currnetIndex + 1}`}
                className="PracticeMode__image"
              />
            ) : (
              <div className="PracticeMode__image-loading" />
            )}
          </div>
          <div className="PracticeMode__footer">
            <PracticeFooter
              projectId={projectId}
              currentSlide={currnetIndex + 1}
              limitTime={limitTime}
              onEnd={() => setStep(2)}
            />
          </div>
        </>
      )}

      {step === 2 && (
        <div className="PracticeMode__step2">
          <h3>발표 후 받을 수 있는 예상 질문에 답변해보시겠어요?</h3>
          <img src={qnaImg} alt="" />
          <div className="PracticeMode__step2-footer">
            <button className="PracticeMode__step2-btn">
              <span
                className="PracticeMode__gradient-text"
                onClick={handleFeedbackClick}
              >
                피드백 받기
              </span>
            </button>
            <button
              className="PracticeMode__step2-btn primary"
              onClick={() => setStep(3)}
            >
              답변 연습하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PracticeMode;
