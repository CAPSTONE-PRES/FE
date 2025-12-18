import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CueCard from "../components/CueCard";
import { getMobileCuecard } from "../api/fileApi";
import "../styles/MobileCueCard.css";
import iconDots from "../assets/SVG_MobileCueCard/tabler_dots-circle-horizontal.svg";
import LoadingLogo from "../assets/SVG_MobileCueCard/LoadingLogo.svg";

const backendResponse = {
  projectTitle: "Hg_중간발표",
  slideNumber: 2,
  totalSlides: 21,
  basic: [
    {
      section: 1,
      keyword: "대학생 발표 문제",
      text: "대학생들은 발표 과업에서 여러 가지 문제를 경험하고 있습니다. <🌬 호흡> 특히, 발표 연습과 실제 발표의 분위기가 너무 달라서 많은 학생들이 발표 연습을 빨리 끝내고 싶어하는 경향이 있습니다. <🔍 청중 바라보기> 이는 결국 현장에서 완성도 있는 발표를 하지 못하게 만드는 원인으로 작용합니다.",
    },
    {
      section: 2,
      keyword: "연습의 불균형",
      text: "많은 학생들이 발표 연습을 할 때, 처음 부분만 열심히 하고 뒷부분은 소홀히 하는 경향이 있습니다. <👉 화면 가리키기> 이로 인해 발표의 후반부에서 더 많은 실수를 하게 되는 경우가 발생합니다. <✋ 제스처> 특히 고학년 학생들은 발표 불안이 증가하는 경향이 있습니다.",
    },
    {
      section: 3,
      keyword: "저학년 발표 불안",
      text: "저학년 학생들도 비슷한 문제를 겪고 있습니다. <🌬 호흡> 발표 연습 시 실전 발표와의 차이를 줄이기 위해 노트북을 멀리 두고 연습하는 방법을 사용하기도 합니다. <👉 화면 가리키기> 그러나 이러한 노력에도 불구하고 발표 불안은 여전히 높습니다.",
    },
    {
      section: 4,
      keyword: "비언어적 표현의 어려움",
      text: "발표 연습 상황에서는 긴장으로 인해 비언어적 표현을 고려하기 어렵습니다. <🌬 호흡> 많은 학생들이 다음 내용을 생각하는 데 집중하게 되어, 시선 처리와 같은 비언어적 요소를 간과하게 됩니다. <🔍 청중 바라보기> 이는 발표의 질을 저하시킬 수 있습니다.",
    },
    {
      section: 5,
      keyword: "질의응답의 두려움",
      text: "예상치 못한 실수와 질의응답에 대한 두려움도 학생들에게 큰 부담이 됩니다. <👉 화면 가리키기> 이러한 불안 요소는 발표 준비 과정에서 실전 발표에 대한 자신감을 떨어뜨리는 요인이 됩니다. <✋ 제스처> 따라서, 실제 발표 상황과 유사한 연습 환경의 필요성이 강조됩니다.",
    },
  ],
  advanced: [
    {
      section: 1,
      keyword: "대학생 발표 문제",
      text: "대학생들이 발표 연습과 실제 발표 간의 차이로 인해 발표 불안을 겪고 있으며, 이는 발표의 질에 영향을 미친다.",
    },
  ],
  prevSlug: "1a2b3c",
  nextSlug: "9f8e7d",
  nextKeyword: "문제정의",
};

const MobileCueCard = () => {
  const { slug } = useParams();
  const nav = useNavigate();

  const [data, setData] = useState(null); //TODO: null로 수정
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeepMode, setIsDeepMode] = useState(false);
  const [showNonverbal, setShowNonverbal] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  //api 호출
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getMobileCuecard(slug);
        setData(res);
      } catch (err) {
        console.error("모바일 큐카드 불러오기 실패: ", err);
      } finally {
        setTimeout(() => setIsLoading(false), 200);
      }
    };

    fetchData();
  }, [slug]);

  if (isLoading || !data) {
    return (
      <div className="MobileCueCard__loading">
        <div className="MobileCueCard__header">
          <h1 className="MobileCueCard__title">
            {data?.projectTitle || "발표 제목"}
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

  const {
    projectTitle,
    slideNumber,
    totalSlides,
    basic,
    advanced,
    prevSlug,
    nextSlug,
  } = data;

  const renderData = isDeepMode ? advanced : basic;
  const sortedData = [...renderData].sort((a, b) => a.section - b.section);
  const cardForNextPage = data.nextKeyword;
  const progress = (slideNumber / totalSlides) * 100;

  //페이지 이동
  const goPrev = () => {
    if (prevSlug) nav(`/mobile-cuecard/${prevSlug}`);
  };

  const goNext = () => {
    if (nextSlug) nav(`/mobile-cuecard/${nextSlug}`);
  };

  return (
    <div className="MobileCueCard">
      <div className="MobileCueCard__top">
        {/* Header with title */}
        <div className="MobileCueCard__header">
          <h1 className="MobileCueCard__title">{projectTitle}</h1>
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
          <div className="MobileCueCard__page-number">
            {slideNumber} / {totalSlides}
          </div>
        </div>
      </div>

      {/* Cue Card */}
      <div className="MobileCueCard__content">
        {sortedData.map((item, idx) => (
          <CueCard
            key={`basic-${idx}`}
            keyword={item.keyword}
            value={item.text}
            showNonverbal={showNonverbal} // 토글 연동
            editable={false}
          />
        ))}
      </div>

      {/* Next page preview */}
      {cardForNextPage && (
        <div className="MobileCueCard__next-preview">
          다음페이지 내용: {cardForNextPage}
        </div>
      )}

      {/* Navigation buttons */}
      <div className="MobileCueCard__navigation">
        <button
          className="MobileCueCard__nav-btn"
          onClick={goPrev}
          disabled={!prevSlug}
        >
          ←
        </button>
        <button
          className="MobileCueCard__nav-btn"
          onClick={goNext}
          disabled={!nextSlug}
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
