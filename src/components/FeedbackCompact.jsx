import { useEffect, useState } from "react";
import { getFeedback } from "../api/feedbackApi";
import iconNode from "../assets/SVG_Feedback/icon-node.svg";
import iconChevron from "../assets/SVG_Feedback/icon-chevron.svg";
import iconSpeed from "../assets/SVG_Feedback/icon-type-speed.svg";
import iconRepeat from "../assets/SVG_Feedback/icon-type-repeat.svg";
import iconHesitate from "../assets/SVG_Feedback/icon-type-hesitate.svg";
import iconAim from "../assets/SVG_Feedback/icon-type-aim.svg";

const iconMap = {
  SPEED: iconSpeed,
  FILLER: iconHesitate,
  REPETITION: iconRepeat,
  ACCURACY: iconAim,
};

const FeedbackCompact = ({ sessionId }) => {
  const [data, setData] = useState(null);
  const [openPage, setOpenPage] = useState(null);

  useEffect(() => {
    if (!sessionId) return;
    getFeedback(sessionId).then(setData);
  }, [sessionId]);

  if (!data) return <div>피드백 불러오는 중...</div>;

  return (
    <div className="CompactFeedback">
      <div className="CompactFeedback__top">
        <span className="CompactFeedback__title">
          총점: {data.totalScore}점
        </span>
        <p className="CompactFeedback__msg">{data.overallFeedback}</p>
      </div>

      <div className="CompactFeedback__timeline">
        {data.slideFeedbacks.map((slide) => {
          const expanded = openPage === slide.slideNumber;
          const time = slide.timestampSeconds;

          return (
            <div key={slide.slideNumber} className="CF__item">
              <div className="CF__node">
                {slide.issues.length > 0 && <img src={iconNode} />}
              </div>

              <div
                className="CF__thumb"
                style={{ backgroundImage: `url(${slide.thumbnailUrl})` }}
              />

              <div className="CF__card">
                <div
                  className="CF__header"
                  onClick={() =>
                    setOpenPage(expanded ? null : slide.slideNumber)
                  }
                >
                  <div className="CF__page">
                    <span>{slide.slideNumber}p</span>
                    <div className="CF__icons">
                      {slide.issues.map((i) => (
                        <img src={iconMap[i.issueType]} key={i.issueType} />
                      ))}
                    </div>
                  </div>

                  <div className="CF__time">
                    <span>{format(time)}</span>
                    <img
                      src={iconChevron}
                      className={expanded ? "expanded" : ""}
                    />
                  </div>
                </div>

                {expanded && (
                  <div className="CF__content">
                    <p>{slide.slideText}</p>

                    {slide.issues.map((i, idx) => (
                      <div key={idx} className="CF__issue">
                        <span className="CF__label">{i.issueType}</span>
                        <p className="CF__comment">{i.comment}</p>
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
  );
};

function format(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(Math.floor(sec % 60)).padStart(2, "0");
  return `${m}:${s}`;
}

export default FeedbackCompact;
