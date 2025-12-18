import PresentationHeader from "../components/PresentationHeader";
import { getProjectInfo } from "../api/projectApi";
import "../styles/PracticeMode.css";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useRef, useContext } from "react";
import { getQrInfo, getSlides } from "../api/fileApi";
import { analyseAudio } from "../api/analyseApi";
import PracticeFooter from "../components/PracticeFooter";
import qnaImg from "../assets/SVG_Practice/qna.svg";
import micIcon from "../assets/SVG_Practice/mic_qna.svg";
import checkIcon from "../assets/SVG_Practice/checkIcon.svg";
import LoadingScreen from "../components/LoadingScreen";
import { MicPermissionContext } from "../contexts/MicPermissionContext";
import {
  getQuestion,
  uploadAnswer,
  compareQnaAnswer,
} from "../api/practiceApi";

const PracticeMode = () => {
  const { canUseMic, selectedDeviceId } = useContext(MicPermissionContext);

  const nav = useNavigate();
  const params = useParams();
  const [projectInfo, setProjectInfo] = useState(null);
  const [audioData, setAudioData] = useState(null);
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [step, setStep] = useState(1);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [duration, setDuration] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const [question, setQuestion] = useState(null); //{questionId, questionBody}
  const [recording, setRecording] = useState(false);
  const [qnaAudioData, setQnaAudioData] = useState(null); // Q&A용 녹음 데이터
  const [sttResult, setSttResult] = useState(""); // STT 결과 텍스트
  const recorderRef = useRef(null);
  const streamRef = useRef(null);

  const [qrInfo, setQrInfo] = useState({});

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

          const qr = await getQrInfo(fileId);
          setQrInfo(qr);
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

  //발표 피드백
  const handleAutoFeedback = async (data) => {
    if (!projectInfo) return;

    setLoadingText("발표 피드백 중");
    setDuration(85);
    setIsLoading(true);
    setIsComplete(false);

    try {
      const { blob, slideTransitions } = data;
      const result = await analyseAudio(
        projectInfo.projectId,
        slideTransitions,
        blob
      );
      console.log("분석 성공! 분석 결과:", result);

      // 분석 완료 후 결과 sessionId 저장하고 step2로 이동
      const sessionId = result.sessionId;
      setAudioData({ sessionId, result });
      setIsComplete(true);

      setPendingAction({ type: "setStep" });
    } catch (err) {
      console.error("음성 분석 실패:", err);
      alert("음성 분석 실패");

      setIsLoading(false);
      setIsComplete(false);
    }
  };

  // const handleFeedbackClick = async () => {
  //   if (!projectInfo) return;

  //   setLoadingText("발표 피드백 중");
  //   setIsLoading(true);

  //   try {
  //     const { blob, slideTransitions } = audioData;

  //     const result = await analyseAudio(projectId, slideTransitions, blob);
  //     console.log("분석 성공! 분석 결과:", result);
  //     const sessionId = result.sessionId;
  //     nav(`/feedback/${sessionId}`);
  //   } catch (err) {
  //     console.error("음성 분석 실패:", err);
  //     alert("음성 분석 실패");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  //질문 조회 api 호출
  useEffect(() => {
    if (step !== 3) return;
    if (!audioData?.sessionId) return;

    const fetchQnaQuestion = async () => {
      try {
        const data = await getQuestion(audioData.sessionId);
        setQuestion(data);
        // 질문 바뀌면 이전 답변/녹음 상태 초기화도 해주는 게 안전
        setQnaAudioData(null);
        setSttResult("");
        setRecording(false);
      } catch (err) {
        if (err.response?.status === 204) {
          nav(`/feedback/${audioData.sessionId}`, {
            state: { projectId },
          });
          return;
        }
        console.error("QNA 질문 조회 실패:", err);
      }
    };

    fetchQnaQuestion();
  }, [step, audioData?.sessionId, nav]);

  //질의응답 녹음 시작
  const startQnaRecording = async () => {
    if (!canUseMic) {
      alert(
        "마이크 사용이 비활성화되어 있어요.\n설정에서 마이크 사용을 허용해주세요."
      );
      return;
    }

    try {
      const audioConstraints = selectedDeviceId
        ? { deviceId: { exact: selectedDeviceId } }
        : true;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: audioConstraints,
      });

      const recorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });

      streamRef.current = stream;
      recorderRef.current = recorder;

      const chunks = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);

      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: "audio/webm;codecs=opus" });
        setQnaAudioData(blob);

        setSttResult("음성 인식 중...");

        try {
          const answer = await uploadAnswer(
            audioData.sessionId,
            question.questionId,
            blob
          );
          setSttResult(answer.sttText);
          console.log("stt 성공:", answer);
        } catch (err) {
          console.error("STT 실패:", err);
          setSttResult("인식 실패");
        }
      };

      recorder.start();
      setRecording(true);
    } catch (err) {
      console.error("녹음 시작 실패:", err);
    }
  };

  //qna 종료 버튼
  const stopQnaRecording = () => {
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }

    setRecording(false);
  };

  //질의응답 피드백
  const handleQnaCompare = async () => {
    if (!qnaAudioData) return;

    setLoadingText("질의응답 피드백 중...");
    setDuration(10);
    setIsLoading(true);
    setIsComplete(false);

    try {
      const result = await compareQnaAnswer(
        audioData.sessionId,
        question.questionId
      );
      console.log("QnA 분석 결과:", result);

      setPendingAction({
        type: "nav",
        data: {
          sessionId: audioData.sessionId,
          projectId: projectId,
        },
      });
      setIsComplete(true);
    } catch (err) {
      console.error("QnA 피드백 실패:", err);
      alert("질의응답 피드백 요청 실패");
      setIsLoading(false);
      setIsComplete(false);
    }
  };

  if (!projectInfo) {
    return <div className="PracticeMode"></div>;
  }
  const { projectId, projectTitle, workspaceName, limitTime } = projectInfo;
  console.log("limitTime:", limitTime);

  return (
    <div className="PracticeMode">
      {isLoading ? (
        <LoadingScreen
          text={loadingText}
          duration={duration}
          isComplete={isComplete}
          onComplete={() => {
            setIsLoading(false);
            setIsComplete(false);

            if (pendingAction) {
              if (pendingAction.type === "setStep") {
                setStep(2);
              } else if (pendingAction.type === "nav") {
                const { sessionId, projectId } = pendingAction.data;
                nav(`/feedback/${sessionId}`, { state: { projectId } });
              }
              setPendingAction(null);
            }
          }}
        />
      ) : (
        <>
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
                    src={slides[currentIndex]}
                    alt={`slide-${currentIndex + 1}`}
                    className="PracticeMode__image"
                  />
                ) : (
                  <div className="PracticeMode__image-loading" />
                )}
              </div>
              <div className="PracticeMode__footer">
                <PracticeFooter
                  projectId={projectId}
                  currentSlide={currentIndex + 1}
                  limitTime={limitTime}
                  onEnd={handleAutoFeedback}
                  qrSlug={qrInfo[currentIndex + 1]}
                />
              </div>
            </>
          )}

          {step === 2 && (
            <div className="PracticeMode__step2">
              <h3>발표 후 받을 수 있는 예상 질문에 답변해보시겠어요?</h3>
              <img src={qnaImg} alt="" />
              <div className="PracticeMode__step2-footer">
                <button
                  className="PracticeMode__step2-btn"
                  onClick={() =>
                    nav(`/feedback/${audioData.sessionId}`, {
                      state: { projectId },
                    })
                  }
                >
                  <span className="PracticeMode__gradient-text">
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

          {step === 3 && question && (
            <div className="PracticeMode__step3">
              <div className="PracticeMode__step3-question">
                <span>Q</span>
                <p>{question.questionBody}</p>
              </div>

              {!qnaAudioData && (
                <div className="PracticeMode__step3-record">
                  <button
                    className="PracticeMode__step3-record-btn"
                    onClick={recording ? stopQnaRecording : startQnaRecording}
                  >
                    <img src={micIcon} />
                  </button>
                  {recording ? "종료" : "답변하기"}
                </div>
              )}

              {qnaAudioData && (
                <div className="PracticeMode__step3-result">
                  <div className="PracticeMode__step3-resultText">
                    <p>{sttResult}</p>
                  </div>
                  <button
                    className="PracticeMode__step3-submit"
                    onClick={handleQnaCompare}
                  >
                    <img src={checkIcon} />
                    <span className="PracticeMode__gradient-text">
                      답변 완료
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PracticeMode;
