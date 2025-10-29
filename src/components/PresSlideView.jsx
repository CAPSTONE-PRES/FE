import "../styles/PresSlideView.css";

const PresSlideView = () => {
  return (
    <div className="PresSlideView">
      {/* 현재 슬라이드 */}
      <div className="PresSlideView__main">
        <img className="PresSlideView__main-img" src="/samples/TestPPT_1.jpg" />
      </div>

      {/* 섬네일 슬라이드 리스트 */}
      <div className="PresSlideView__slide-thumbnails">
        <div className="PresSlideView__thumbnail active"></div>
        <div className="PresSlideView__thumbnail"></div>
        <div className="PresSlideView__thumbnail"></div>
        <div className="PresSlideView__thumbnail"></div>
        <div className="PresSlideView__thumbnail"></div>
        <div className="PresSlideView__thumbnail"></div>
      </div>

      {/* 페이지 인덱스 */}
      <div className="PresSlideView__slide-index">
        <span className="PresSlideView__slide-current">2</span>
        <span className="PresSlideView__slide-total"> / 20</span>
      </div>

      {/* 페이지 이동 */}
      <div className="PresSlideView__pagination">
        <button className="PresSlideView__btn-prev">이전페이지</button>
        <button className="PresSlideView__btn-next">다음페이지</button>
      </div>
    </div>
  );
};

export default PresSlideView;
