import "../styles/PresSlideView.css";
import { useEffect } from "react";

const PresSlideView = ({ slides, currentIndex, setCurrentIndex }) => {
  //키 입력으로 슬라이드 전환
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") {
        setCurrentIndex((prev) => Math.min(prev + 1, slides.length - 1));
      } else if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [slides, setCurrentIndex]);

  if (!slides || slides.length === 0) {
    return (
      <div className="PresSlideView">
        <div className="PresSlideView__main empty">슬라이드가 없습니다.</div>
      </div>
    );
  }

  const currentSlide = slides[currentIndex];

  return (
    <div className="PresSlideView">
      {/* 현재 슬라이드 */}
      <div className="PresSlideView__main">
        <img className="PresSlideView__main-img" src={currentSlide} />
      </div>

      {/* 섬네일 슬라이드 리스트 */}
      <div className="PresSlideView__slide-thumbnails">
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className={`PresSlideView__thumbnail ${
              idx === currentIndex ? "active" : ""
            }`}
            onClick={() => setCurrentIndex(idx)}
          >
            <img
              src={slide}
              alt={`썸네일 ${idx + 1}`}
              className="PresSlideView__thumbnail-img"
            />
          </div>
        ))}
      </div>

      {/* 페이지 인덱스 */}
      <div className="PresSlideView__slide-index">
        <span className="PresSlideView__slide-current">{currentIndex + 1}</span>
        <span className="PresSlideView__slide-total"> / {slides.length}</span>
      </div>

      {/* 페이지 이동 */}
      <div className="PresSlideView__pagination">
        <button
          className="PresSlideView__btn-prev"
          onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
          disabled={currentIndex === 0}
        >
          이전페이지
        </button>
        <button
          className="PresSlideView__btn-next"
          onClick={() =>
            setCurrentIndex((prev) => Math.min(prev + 1, slides.length - 1))
          }
          disabled={currentIndex === slides.length - 1}
        >
          다음페이지
        </button>
      </div>
    </div>
  );
};

export default PresSlideView;
