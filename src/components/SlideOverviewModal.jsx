import "../styles/SlideOverviewModal.css";
import BaseModal from "./BaseModal";

const SlideOverviewModal = ({
  isOpen,
  onClose,
  slides,
  currentIndex,
  setCurrentIndex,
}) => {
  const handleSelectSlide = (index) => {
    setCurrentIndex(index);
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} header={"전체페이지"}>
      <div className="SlideOverviewModal__grid">
        {slides.map((slide, index) => (
          <div
            key={index}
            onClick={() => handleSelectSlide(index)}
            className="SlideOverviewModal__slide"
          >
            <img
              src={slide}
              alt={`슬라이드 ${index + 1}`}
              className={`SlideOverviewModal__card ${
                index === currentIndex ? "active" : ""
              }`}
            />
            <span className="SlideOverviewModal__index">{index + 1}</span>
          </div>
        ))}
      </div>
    </BaseModal>
  );
};

export default SlideOverviewModal;
