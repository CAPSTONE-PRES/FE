import "../styles/Feedback.css";
import { useEffect, useState, useRef } from "react";
import { getFeedback } from "../api/feedbackApi";
import iconNode from "../assets/SVG_Feedback/icon-node.svg";
import iconChevron from "../assets/SVG_Feedback/icon-chevron.svg";
import iconSpeed from "../assets/SVG_Feedback/icon-type-speed.svg";
import iconRepeat from "../assets/SVG_Feedback/icon-type-repeat.svg";
import iconHesitate from "../assets/SVG_Feedback/icon-type-hesitate.svg";
import iconAim from "../assets/SVG_Feedback/icon-type-aim.svg";

const FeedbackCompact = ({ sessionId }) => {
  const [feedbackData, setFeedbackData] = useState(null);
  const [expandedCards, setExpandedCards] = useState({});
  const containerRef = useRef(null);
  const lineRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!sessionId) return;
    getFeedback(sessionId).then(setFeedbackData);
  }, [sessionId]);

  if (!feedbackData) return <div>피드백 불러오는 중...</div>;

  const {
    grade,
    totalScore,
    spmScore,
    fillerScore,
    silenceScore,
    repeatScore,
    accuracyScore,
    totalDurationSeconds,
    slideFeedbacks,
  } = feedbackData;

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}분 ${s}초`;
  };

  const toggleCard = (page) => {
    setExpandedCards((prev) => ({
      ...prev,
      [page]: !prev[page],
    }));
  };

  return (
    <div className="Feedback Feedback--compact">
      <div className="feedback-content">
        {/* ===== 상단 요약 ===== */}
        <div className="feedback-top">
          <div className="feedback-left">
            <div className="grade-container">
              <div className="grade-circle">
                <div className="grade-inner-circle">
                  <span className="grade-letter">{grade}</span>
                </div>
              </div>
              <div className="total-score-oval">
                <span className="total-score-label">총점:</span>
                <span className="total-score-number">{totalScore}</span>
              </div>
            </div>
          </div>

          <div className="feedback-right">
            <div className="feedback-message">
              {feedbackData.overallFeedback}
            </div>
            <div className="presentation-time">
              <span className="time-label">총 발표 시간 : </span>
              <span className="time-value">
                {formatTime(totalDurationSeconds)}
              </span>
            </div>
          </div>
        </div>

        {/* ===== 세부 점수 ===== */}
        <div className="feedback-main">
          <div className="svg-section-container detail">
            <div className="section-content">
              <h2 className="section-title">세부 점수</h2>
              <div className="score-grid">
                <div className="score-item">
                  <span className="score-label">말하기 속도</span>
                  <span className="score-value">{spmScore}점</span>
                </div>
                <div className="score-item">
                  <span className="score-label">말의 반복</span>
                  <span className="score-value">{repeatScore}점</span>
                </div>
                <div className="score-item">
                  <span className="score-label">말의 망설임</span>
                  <span className="score-value">
                    {Math.round((fillerScore + silenceScore) / 2)}점
                  </span>
                </div>
                <div className="score-item">
                  <span className="score-label">발표 정확도</span>
                  <span className="score-value">{accuracyScore}점</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== 페이지별 피드백 ===== */}
        <div className="feedback-bottom-section">
          <div className="feedback-content-box">
            <div className="feedback-bottom-header">
              <h2 className="feedback-bottom-title">페이지별 피드백</h2>
            </div>

            <div className="feedback-content-area" ref={scrollRef}>
              <div className="page-feedback">
                <div className="timeline-container" ref={containerRef}>
                  <div className="timeline-line" ref={lineRef}></div>

                  {slideFeedbacks.map((slide) => {
                    const page = slide.slideNumber;
                    const isExpanded = expandedCards[page];
                    const issues = slide.issues || [];

                    const iconMap = {
                      SPEED: iconSpeed,
                      FILLER: iconHesitate,
                      REPETITION: iconRepeat,
                      ACCURACY: iconAim,
                    };

                    return (
                      <div
                        key={page}
                        className="timeline-item"
                        data-page={page}
                      >
                        <div className="timeline-node has-feedback">
                          <img src={iconNode} />
                        </div>

                        <div
                          className="thumbnail-box"
                          style={{
                            backgroundImage: `url("${slide.thumbnailUrl}")`,
                          }}
                        />

                        <div className="feedback-card">
                          <div className="card-header">
                            <div className="page-info">
                              <span className="page-number">{page}p</span>
                              <div className="tag-icon">
                                {issues.map((i) => (
                                  <img
                                    key={i.issueType}
                                    src={iconMap[i.issueType]}
                                  />
                                ))}
                              </div>
                            </div>

                            <div className="time-info">
                              <span className="timestamp">
                                {formatTime(slide.timestampSeconds)}
                              </span>
                              <span
                                className={`expand-icon ${
                                  isExpanded ? "expanded" : ""
                                }`}
                                onClick={() => toggleCard(page)}
                              >
                                <img src={iconChevron} />
                              </span>
                            </div>
                          </div>

                          {isExpanded && (
                            <div className="card-content">
                              <p>{slide.slideText}</p>
                              {issues.map((i, idx) => (
                                <div key={idx} className="feedback-comment">
                                  <p>{i.comment}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackCompact;
