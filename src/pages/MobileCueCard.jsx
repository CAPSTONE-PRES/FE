import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CueCard from "../components/CueCard";
import { getProjectInfo } from "../api/projectApi";
import "../styles/MobileCueCard.css";
import iconDots from "../assets/SVG_MobileCueCard/tabler_dots-circle-horizontal.svg";
import LoadingLogo from "../assets/SVG_MobileCueCard/LoadingLogo.svg";

const backendResponse = {
  fileId: 16,
  slides: [
    {
      slideNumber: 1,
      basic: [
        {
          section: 1,
          keyword: "자기소개",
          text: "안녕하세요. 타당성분석 발표를 맡게된 경제학과 박민영입니다. <🔍 청중 바라보기> 그럼 발표 시작하겠습니다.",
        },
      ],
    },
    {
      slideNumber: 2,
      basic: [
        {
          section: 1,
          keyword: "타당성 분석",
          text: "타당성 분석을 시작하겠습니다. <🌬 호흡>",
        },
      ],
    },
  ],
};

const MobileCueCard = () => {
  const params = useParams();
  const [projectInfo, setProjectInfo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeepMode, setIsDeepMode] = useState(false);
  const [showNonverbal, setShowNonverbal] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const totalPages = backendResponse.slides.length;

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const project = await getProjectInfo(params.id);
        setProjectInfo(project);
      } catch (err) {
        console.error("프로젝트 정보 불러오기 실패:", err);
      } finally {
        // Simulate loading time
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      }
    };

    fetchProject();
  }, [params.id]);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const currentSlide = backendResponse.slides[currentPage - 1];
  const currentCueCard = currentSlide?.basic[0] || { keyword: "", text: "" };
  const nextSlide = currentPage < totalPages ? backendResponse.slides[currentPage] : null;
  const nextCueCard = nextSlide?.basic[0];

  const progress = (currentPage / totalPages) * 100;

  if (isLoading) {
    return (
      <div className="MobileCueCard__loading">
        <div className="MobileCueCard__header">
          <h1 className="MobileCueCard__title">
            {projectInfo?.projectTitle || "타당성분석_기말발표"}
          </h1>
          <button className="MobileCueCard__menu" disabled>
            <img src={iconDots} alt="menu" />
          </button>
        </div>
        
        <div className="MobileCueCard__loading-content">
          <div className="MobileCueCard__loading-icon">
            <img src={LoadingLogo} alt="Loading" />
          </div>
          
          <div className="MobileCueCard__loading-progress-container">
            <div className="MobileCueCard__loading-progress-bar">
              <div className="MobileCueCard__loading-progress-fill" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="MobileCueCard">
      {/* Header with title */}
      <div className="MobileCueCard__header">
        <h1 className="MobileCueCard__title">
          {projectInfo?.projectTitle || "타당성분석_기말발표"}
        </h1>
        <button
          className="MobileCueCard__menu"
          onClick={() => setIsMenuOpen(true)}
        >
          <img src={iconDots} alt="menu" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="MobileCueCard__progress-container">
        <div className="MobileCueCard__progress-bar">
          <div
            className="MobileCueCard__progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="MobileCueCard__page-number">{currentPage} / {totalPages}</div>
      </div>

      {/* Cue Card */}
      <div className="MobileCueCard__content">
        <CueCard
          keyword={currentCueCard.keyword}
          value={currentCueCard.text}
          showNonverbal={true}
          onChange={() => {}}
        />
      </div>

      {/* Next page preview */}
      {nextCueCard && (
        <div className="MobileCueCard__next-preview">
          다음페이지 내용: {nextCueCard.keyword}
        </div>
      )}

      {/* Navigation buttons */}
      <div className="MobileCueCard__navigation">
        <button
          className="MobileCueCard__nav-btn"
          onClick={prevPage}
          disabled={currentPage === 1}
        >
          ←
        </button>
        <button
          className="MobileCueCard__nav-btn"
          onClick={nextPage}
          disabled={currentPage === totalPages}
        >
          →
        </button>
      </div>

      {/* Bottom Sheet Modal */}
      {isMenuOpen && (
        <>
          <div
            className="MobileCueCard__modal-overlay"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="MobileCueCard__modal">
            <div className="MobileCueCard__modal-handle" />
            
            <div className="MobileCueCard__modal-option">
              <span>대본 심화버전</span>
              <label className="MobileCueCard__toggle">
                <input
                  type="checkbox"
                  checked={isDeepMode}
                  onChange={(e) => setIsDeepMode(e.target.checked)}
                />
                <span className="MobileCueCard__toggle-slider" />
              </label>
            </div>

            <div className="MobileCueCard__modal-option">
              <span>비언어적 표현 가이드</span>
              <label className="MobileCueCard__toggle">
                <input
                  type="checkbox"
                  checked={showNonverbal}
                  onChange={(e) => setShowNonverbal(e.target.checked)}
                />
                <span className="MobileCueCard__toggle-slider" />
              </label>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MobileCueCard;

