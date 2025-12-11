import React, { useState } from "react";
import { useNavigate, useLocation, replace } from "react-router-dom";
import "../styles/InsufficientPage.css";
import Header from "../components/Header";
import LoadingScreen from "../components/LoadingScreen";
import { generateCue, generateQnA } from "../api/fileApi";

const InsufficientPage = () => {
  const nav = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [apiDone, setApiDone] = useState(false);

  const handleContinue = async () => {
    try {
      setLoadingText("대본 카드 생성 중...");
      setIsLoading(true);

      // 1. 큐카드 생성 (optFile 없음)
      await generateCue(fileId);

      // 2. QnA 생성
      await generateQnA(fileId);

      setApiDone(true);
    } catch (e) {
      console.error("계속하기 처리 중 오류:", e);
      alert("대본 생성 중 문제가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const {
    projectId,
    file,
    fileId,
    insufficientSlidePreviews, //[{ "slideNumber": 9, "url": "/api/files/123/page/9/image" },]
    workspaceId,
    workspaceName,
    workspaceMemberList,
  } = location.state;

  return (
    <div className="InsufficientPage">
      <Header />
      {isLoading ? (
        <LoadingScreen
          text={loadingText}
          duration={100}
          isComplete={apiDone}
          onComplete={() => {
            if (projectId) nav(`/presentation/${projectId}`, { replace: true });
          }}
        />
      ) : (
        <div className="InsufficientPage__body">
          <div className="InsufficientPage__container">
            <h2 className="InsufficientPage__title">
              앗, 발표 자료 안에 대본 생성을 위해 필요한 텍스트가 부족한
              페이지가 있어요!
            </h2>

            <div className="InsufficientPage__slides">
              {insufficientSlidePreviews?.slice(0, 2).map((slide, idx) => (
                <div key={idx} className="InsufficientPage__slide">
                  <div
                    className="InsufficientPage__slide-box"
                    style={{
                      backgroundImage: `url("${slide.url}")`,
                    }}
                  />
                  <p>{slide.slideNumber}P</p>
                </div>
              ))}
            </div>

            <p className="InsufficientPage__desc">
              이대로 대본 생성 시 적합하지 않은 내용이 들어가거나 내용이 부족할
              수 있어요.
            </p>

            <div className="InsufficientPage__buttons">
              <button
                className="InsufficientPage__btn-secondary"
                onClick={() =>
                  nav("/newPresentation", {
                    state: {
                      mode: "edit",
                      projectId,
                      file,
                      fileId,
                      workspaceId,
                      workspaceName,
                      workspaceMemberList,
                    },
                    replace: true,
                  })
                }
              >
                <span className="InsufficientPage__gradient-text">
                  자료 수정
                </span>
              </button>

              <button
                className="InsufficientPage__btn-primary"
                onClick={handleContinue}
              >
                계속하기 →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsufficientPage;
