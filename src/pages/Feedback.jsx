import "../styles/Feedback.css";
import Header from "../components/Header";
import { useState, useRef, useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getFeedback } from "../api/feedbackApi";
import { mockFeedbackData } from "../mockFeedbackData";
import backgroundWave from "../assets/SVG_Feedback/background-wave.svg";
import backgroundLine from "../assets/SVG_Feedback/background-line.svg";
import backgroundChart from "../assets/SVG_Feedback/background-chart.svg";
import iconRetry from "../assets/SVG_Feedback/icon-retry.svg";
import iconThumbsUp from "../assets/SVG_Feedback/icon-thumbs-up.svg";
import iconNode from "../assets/SVG_Feedback/icon-node.svg";
import iconChevron from "../assets/SVG_Feedback/icon-chevron.svg";
import iconSpeed from "../assets/SVG_Feedback/icon-type-speed.svg";
import iconRepeat from "../assets/SVG_Feedback/icon-type-repeat.svg";
import iconHesitate from "../assets/SVG_Feedback/icon-type-hesitate.svg";
import iconAim from "../assets/SVG_Feedback/icon-type-aim.svg";
import { getQnaFeedback } from "../api/practiceApi";

const Feedback = () => {
  const { sessionId } = useParams();
  console.log("sessionId:", sessionId);
  const navigate = useNavigate();
  const location = useLocation();
  console.log("로케이션state:", location.state);
  const [activeTab, setActiveTab] = useState("page");
  const [expandedCards, setExpandedCards] = useState({});
  const [expandedRecommendedAnswer, setExpandedRecommendedAnswer] =
    useState(false);

  // 기본값 설정 (API 호출 실패 시 사용)
  const defaultFeedbackData = useMemo(() => mockFeedbackData, []);

  const [feedbackData, setFeedbackData] = useState(null);
  const [qnaFeedbackData, setQnaFeedbackData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const containerRef = useRef(null);
  const lineRef = useRef(null);
  const scrollRef = useRef(null);

  // API 호출
  useEffect(() => {
    const fetchFeedback = async () => {
      if (!sessionId) {
        // sessionId가 없으면 기본값 사용
        setFeedbackData(defaultFeedbackData);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        //발표 피드백 데이터 가져오기
        const feedback = await getFeedback(sessionId);
        setFeedbackData(feedback);

        //qna 피드백 데이터 가져오기
        const qnaFeedback = await getQnaFeedback(sessionId);
        setQnaFeedbackData(qnaFeedback);
        console.log("qna 피드백 조회 성공: ", qnaFeedback);
      } catch (err) {
        console.error("피드백 조회 실패:", err);
        // API 호출 실패 시 기본값 사용
        setFeedbackData(defaultFeedbackData);
        setError(null); // 에러를 표시하지 않고 기본값 사용
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [sessionId]);

  const toggleCard = (pageNumber) => {
    // 기준 요소: 카드 헤더의 화면 내 위치를 기준으로
    const header = document.querySelector(
      `.timeline-item[data-page="${pageNumber}"] .card-header`
    );

    const beforeTop = header?.getBoundingClientRect().top ?? null;

    setExpandedCards((prev) => ({
      ...prev,
      [pageNumber]: !prev[pageNumber],
    }));

    // 레이아웃 적용된 직후 프레임에서 재측정
    if (beforeTop !== null) {
      requestAnimationFrame(() => {
        if (!header) return;
        const afterTop = header.getBoundingClientRect().top;
        const diff = afterTop - beforeTop;
        // 뷰포트 역이동
        if (diff !== 0) {
          window.scrollBy({ top: diff, left: 0, behavior: "auto" });
        }
      });
    }
  };

  useEffect(() => {
    const containerEl = containerRef.current;
    const lineEl = lineRef.current;
    if (!containerEl || !lineEl) return;

    if (activeTab !== "page") return;

    const recalc = () => {
      const nodes = Array.from(containerEl.querySelectorAll(".timeline-node"));

      if (nodes.length < 2) {
        lineEl.style.height = "0px";
        return;
      }

      const containerTop = containerEl.getBoundingClientRect().top;
      const centers = nodes.map((n) => {
        const r = n.getBoundingClientRect();
        return r.top - containerTop + r.height / 2;
      });

      const firstY = Math.min(...centers);
      const lastY = Math.max(...centers);

      lineEl.style.top = `${firstY}px`;
      lineEl.style.height = `${lastY - firstY}px`;
    };

    recalc();

    const onResize = () => recalc();
    const onScroll = () => recalc();

    window.addEventListener("resize", onResize);
    scrollRef.current?.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("resize", onResize);
      scrollRef.current?.removeEventListener("scroll", onScroll);
    };
  }, [activeTab, expandedCards]);

  // tag-count 텍스트 속 어휘 추출 및 텍스트 강조 함수
  const highlightKeywords = (text, tagCountText) => {
    if (!tagCountText || !text) return text;

    //콤마 기준으로 나누기
    const pairs = tagCountText.split(",").map((p) => p.trim());

    //키워드만 추출
    const keywords = [];
    pairs.forEach((pair) => {
      const [word, count] = pair.split(":").map((s) => s.trim());
      if (word && !word.match(/^\d+회$/)) {
        keywords.push(word);
      }
    });

    // 중복 제거
    const uniqueKeywords = [...new Set(keywords.filter((k) => k.length > 0))];
    if (uniqueKeywords.length === 0) return text;

    //긴 단어부터 처리
    const sortedKeywords = uniqueKeywords.sort((a, b) => b.length - a.length);
    let highlightedText = text;

    //특수문자 이스케이프 후 강조
    sortedKeywords.forEach((keyword) => {
      const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(
        `(?<![가-힣a-zA-Z0-9])(${escapedKeyword})(?![가-힣a-zA-Z0-9])`,
        "gi"
      );
      highlightedText = highlightedText.replace(
        regex,
        '<span style="color: #FF0000; font-weight: 500;">$1</span>'
      );
    });

    return highlightedText;
  };

  const renderHighlightedText = (text, tagCountText) => {
    const highlighted = highlightKeywords(text, tagCountText);
    return <span dangerouslySetInnerHTML={{ __html: highlighted }} />;
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className="Feedback">
        <Header />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh",
          }}
        >
          <div>피드백을 불러오는 중...</div>
        </div>
      </div>
    );
  }

  const {
    grade,
    totalScore,
    spmScore,
    fillerScore,
    silenceScore,
    repeatScore,
    accuracyScore,
    totalDurationSeconds,
  } = feedbackData;

  // 발표 시간 포맷팅 (totalSilenceDuration을 이용해 계산하는 것이 좋지만, API에서 제공되지 않으면 기본값 사용)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}분 ${secs}초`;
  };

  // 피드백 메시지 생성 (등급과 점수에 따라)
  const getFeedbackMessage = () => {
    const scores = {
      SPEED: spmScore,
      FILLER: (fillerScore + silenceScore) / 2,
      REPETITION: repeatScore,
      ACCURACY: accuracyScore,
    };

    const lowestType = Object.entries(scores).reduce((min, cur) =>
      cur[1] < min[1] ? cur : min
    )[0];

    switch (lowestType) {
      case "SPEED":
        return ["말하기 속도를 조절하여", "전달력을 높여 보세요!"];

      case "FILLER":
        return ["말의 망설임을 줄여", "더 자연스러운 발표를 만들어보세요!"];

      case "REPETITION":
        return ["반복되는 표현을 줄이고", "다양한 어휘를 사용해보세요!"];

      case "ACCURACY":
        return ["발표 정확도를 높이면", "발표 완성도가 더 올라갈 거예요!"];

      default:
        return ["좋은 발표였어요!", "계속 노력해보세요."];
    }
  };

  const feedbackMessage = getFeedbackMessage();

  return (
    <div className="Feedback">
      <Header />

      {/* 배경 SVG들 */}
      <img
        src={backgroundWave}
        style={{
          position: "absolute",
          left: "-220px",
          top: "5px",
          width: "1180px",
          height: "444px",
          opacity: 1,
          zIndex: 0,
        }}
      />
      <img
        src={backgroundLine}
        style={{
          position: "absolute",
          left: "-66px",
          top: "520px",
          height: "180px",
          opacity: 0.7,
          zIndex: 0,
        }}
      />
      <img
        src={backgroundChart}
        style={{
          position: "absolute",
          left: "1154px",
          top: "150px",
          width: "173px",
          height: "356px",
          opacity: 0.8,
          zIndex: 0,
          borderTopRightRadius: "8px",
        }}
      />

      <div className="feedback-content">
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
              <div>{feedbackMessage[0]}</div>
              <div>{feedbackMessage[1]}</div>
              {/* <div>{feedbackData.overallFeedback}</div> */}
            </div>
            <div className="presentation-time">
              <span className="time-label">총 발표 시간 : </span>
              <span className="time-value">
                {totalDurationSeconds && formatTime(totalDurationSeconds)}
              </span>
            </div>
            <button
              className="practice-button"
              onClick={() => {
                // TODO: 연습 페이지로 돌아가기 (projectId나 sessionId를 이용해 practice 페이지로 이동)
                // 현재는 sessionId만 있으므로, projectId를 조회하는 API가 필요할 수 있습니다.
                navigate(-1);
              }}
            >
              <img src={iconRetry} alt="재시도" className="practice-icon" />
              다시 연습해보기
            </button>
          </div>
        </div>

        <div className="feedback-main">
          <div className="svg-section-container detail">
            <div className="section-content">
              <h2 className="section-title">세부 점수</h2>
              <div className="score-grid">
                <div className="score-item">
                  <span className="score-label">말하기 속도</span>
                  <span className="score-value">{spmScore || 0}점</span>
                </div>
                <div className="score-item">
                  <span className="score-label">말의 반복</span>
                  <span className="score-value">{repeatScore || 0}점</span>
                </div>
                <div className="score-item">
                  <span className="score-label">말의 망설임</span>
                  <span className="score-value">
                    {(fillerScore + silenceScore) / 2 || 0}점
                  </span>
                </div>
                <div className="score-item">
                  <span className="score-label">발표 정확도</span>
                  <span className="score-value">{accuracyScore || 0}점</span>
                </div>
              </div>
            </div>
          </div>

          <div className="record-wrapper">
            <div className="svg-section-container record">
              <div className="section-content">
                <h2 className="section-title">연습 기록</h2>
                <div className="record-container">
                  <div className="record-item current-record">
                    <span className="record-label">현재 점수</span>
                    <div className="record-bar-container">
                      <div
                        className="record-bar current-bar"
                        style={{ width: `${totalScore}%` }}
                      ></div>
                      <span className="record-score">{totalScore}점</span>
                    </div>
                  </div>
                  {/* 최근 연습 기록 (history) */}
                  {feedbackData.history?.slice(0, 2).map((h, idx) => {
                    const date = new Date(h.practicedAt);
                    const month = String(date.getMonth() + 1).padStart(2, "0");
                    const day = String(date.getDate()).padStart(2, "0");
                    const formattedDate = `${month}/${day}`;

                    return (
                      <div key={idx} className="record-item">
                        <span className="record-date">{formattedDate}</span>
                        <div className="record-bar-container">
                          <div
                            className="record-bar"
                            style={{ width: `${h.totalScore}%` }}
                          ></div>
                          <span className="record-score">{h.totalScore}점</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="record-note">최근 점수가 3개만 저장됩니다.</div>
          </div>
        </div>

        <div className="feedback-bottom-section">
          <div className="feedback-content-box">
            <div className="feedback-bottom-header">
              <h2 className="feedback-bottom-title">
                {activeTab === "page" ? "페이지별 피드백" : "질의응답 피드백"}
              </h2>
              <div className="tab-buttons">
                <button
                  className={`tab-button ${
                    activeTab === "page" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("page")}
                >
                  페이지별
                </button>
                <button
                  className={`tab-button ${activeTab === "qa" ? "active" : ""}`}
                  onClick={() => setActiveTab("qa")}
                >
                  질의응답
                </button>
              </div>
            </div>
            <div className="feedback-content-area" ref={scrollRef}>
              {activeTab === "page" ? (
                <div className="page-feedback">
                  <div className="timeline-container" ref={containerRef}>
                    <div className="timeline-line" ref={lineRef}></div>

                    {feedbackData.slideFeedbacks.map((slide) => {
                      const page = slide.slideNumber;
                      const isExpanded = expandedCards[page];

                      const issues = slide.issues || [];
                      const hasFeedback = issues.length > 0;

                      const timeText = formatTime(slide.timestampSeconds || 0);

                      //아이콘 매핑
                      const iconMap = {
                        SPEED: iconSpeed,
                        FILLER: iconHesitate,
                        REPETITION: iconRepeat,
                        ACCURACY: iconAim,
                        SILENCE:
                          "/src/assets/SVG_ Feedback/icon-type-hesitate.svg",
                      };

                      // 이슈명 매핑
                      const labelMap = {
                        SPEED: "발표 속도",
                        FILLER: "추임새 발생",
                        REPETITION: "반복되는 어휘",
                        ACCURACY: "발표 정확도",
                        SILENCE: "공백 발생",
                      };

                      // 이슈별 tagCountText 생성 함수
                      const getTagCountText = (issue) => {
                        switch (issue.issueType) {
                          case "FILLER":
                            return Object.entries(issue.fillerDetail || {})
                              .map(([word, count]) => `${word}: ${count}회`)
                              .join(", ");

                          case "REPETITION": {
                            // if (typeof issue.repeatDetail === "string") {
                            //   return `${issue.repeatCount}회 : ${issue.repeatDetail}`;
                            // }

                            // const entries = Object.entries(
                            //   issue.repeatDetail || {}
                            // );
                            // if (entries.length === 0) return "0회";

                            // const formatted = entries
                            //   .map(([word, count]) => `${word}: ${count}회`)
                            //   .join(", ");
                            // return formatted;
                            return Object.entries(issue.repeatDetail || {})
                              .map(([word, count]) => `${word}: ${count}회`)
                              .join(", ");
                          }

                          case "ACCURACY": {
                            const percent = (issue.similarity * 100).toFixed(1);
                            return `정확도 ${percent}%`;
                          }

                          case "SILENCE":
                            return `침묵 ${issue.silenceCount}회`;

                          case "SPEED": {
                            if (issue.spmUser < 330) return "속도 느림";
                            if (issue.spmUser > 370) return "속도 빠름";
                            return "속도 적정";
                          }

                          default:
                            return "";
                        }
                      };

                      // 텍스트 강조: 반복 / 필러만 강조
                      const getHighlightSource = () => {
                        const fillerIssue = issues.find(
                          (i) => i.issueType === "FILLER"
                        );
                        const repeatIssue = issues.find(
                          (i) => i.issueType === "REPETITION"
                        );

                        let parts = [];

                        if (fillerIssue) {
                          parts.push(getTagCountText(fillerIssue));
                        }
                        if (repeatIssue)
                          parts.push(getTagCountText(repeatIssue));

                        return parts.join(", ");
                      };

                      const highlightSource = getHighlightSource();

                      return (
                        <div
                          key={page}
                          className="timeline-item"
                          data-page={page}
                        >
                          {/* ----------------- 타임라인 점 ----------------- */}
                          <div
                            className={`timeline-node ${
                              hasFeedback ? "has-feedback" : ""
                            }`}
                          >
                            {hasFeedback && (
                              <img
                                src={iconNode}
                                alt="피드백"
                                style={{ width: "100%", height: "100%" }}
                              />
                            )}
                          </div>

                          {/* ----------------- 썸네일 ----------------- */}
                          <div
                            className="thumbnail-box"
                            style={{
                              backgroundImage: `url("${slide.thumbnailUrl}")`,
                            }}
                          >
                            {/* <div className="thumbnail-placeholder">
                              {!slide.thumbnailUrl && (
                                <img
                                  // src={slide.thumbnailUrl}
                                  alt={`${page}번 슬라이드`}
                                  className="thumbnail-image"
                                />
                              )}
                            </div> */}
                          </div>

                          {/* ----------------- 카드 ----------------- */}
                          <div className="feedback-card">
                            {/* header */}
                            <div className="card-header">
                              <div className="page-info">
                                <span className="page-number">{page}p</span>
                                {/* 여러 개의 아이콘 표시 */}
                                <div className="tag-icon">
                                  {issues.map((i) => (
                                    <img
                                      key={i.issueType}
                                      src={iconMap[i.issueType]}
                                      alt={i.issueType}
                                    />
                                  ))}
                                </div>
                              </div>

                              <div className="time-info">
                                <span className="timestamp">{timeText}</span>
                                <span
                                  className={`expand-icon ${
                                    isExpanded ? "expanded" : ""
                                  }`}
                                  onClick={() => toggleCard(page)}
                                >
                                  <img
                                    src={iconChevron}
                                    style={{ width: "14px" }}
                                  />
                                </span>
                              </div>
                            </div>

                            {isExpanded && (
                              <div className="content-divider"></div>
                            )}

                            {/* ----------------- 콘텐츠 ----------------- */}
                            {isExpanded && (
                              <div className="card-content">
                                {/* stt 텍스트 */}
                                <p>
                                  {highlightSource
                                    ? renderHighlightedText(
                                        slide.slideText,
                                        highlightSource
                                      )
                                    : slide.slideText}
                                </p>

                                {/* 이슈 전체 렌더링 */}
                                {issues.map((issue, idx) => (
                                  <div key={idx} className="feedback-details">
                                    {/* 라벨 + 카운트 */}
                                    <div className="feedback-tag">
                                      <span className="tag-label">
                                        {labelMap[issue.issueType]}
                                      </span>
                                      <span className="tag-count">
                                        {getTagCountText(issue)}
                                      </span>
                                    </div>

                                    {/* 그래프(speed 전용) */}
                                    {issue.issueType === "SPEED" ? (
                                      <div className="feedback-comment">
                                        <p>{issue.comment}</p>

                                        <div className="speed-comparison">
                                          <div className="speed-item">
                                            <span className="speed-label user">
                                              사용자 속도
                                            </span>
                                            <div className="speed-bar-container">
                                              <div
                                                className="speed-bar user-speed"
                                                style={{
                                                  width: `${Math.max(
                                                    0,
                                                    Math.min(
                                                      100,
                                                      (issue.spmUser /
                                                        issue.spmAverage) *
                                                        50
                                                    )
                                                  )}%`,
                                                }}
                                              ></div>
                                              <span className="speed-value">
                                                SPM: {issue.spmUser}
                                              </span>
                                            </div>
                                          </div>

                                          <div className="speed-item">
                                            <span className="speed-label">
                                              평균 속도
                                            </span>
                                            <div className="speed-bar-container">
                                              <div
                                                className="speed-bar average-speed"
                                                style={{
                                                  width: "50%",
                                                }}
                                              ></div>
                                              <span className="speed-value">
                                                SPM: {issue.spmAverage}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      // 일반 코멘트
                                      <div className="feedback-comment">
                                        <p>{issue.comment}</p>
                                      </div>
                                    )}
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
              ) : (
                <div className="qa-feedback">
                  {qnaFeedbackData ? (
                    <>
                      <div className="qa-question">
                        <span className="question-prefix">Q.</span>
                        <p className="question-text">
                          {qnaFeedbackData.question}
                        </p>
                      </div>

                      <div className="qa-user-answer">
                        <h3 className="answer-label">내가 한 답변</h3>
                        <div className="answer-box">
                          <p>{qnaFeedbackData.userAnswer}</p>
                        </div>
                      </div>

                      <div className="qa-recommended-answer">
                        <div
                          className="recommended-header"
                          onClick={() =>
                            setExpandedRecommendedAnswer(
                              !expandedRecommendedAnswer
                            )
                          }
                        >
                          <div className="recommended-title">
                            <img
                              src={iconThumbsUp}
                              alt="추천"
                              className="thumbs-up-icon"
                            />
                            <span>추천 답안 보기</span>
                            <span
                              className={`expand-icon ${
                                expandedRecommendedAnswer ? "expanded" : ""
                              }`}
                            >
                              <img
                                src={iconChevron}
                                alt="toggle"
                                style={{ width: "14px", height: "8px" }}
                              />
                            </span>
                          </div>
                        </div>
                        {expandedRecommendedAnswer && (
                          <div className="recommended-content">
                            <p>{qnaFeedbackData.idealAnswer}</p>
                          </div>
                        )}
                      </div>

                      {qnaFeedbackData.feedback && (
                        <div className="improvement-section">
                          <h3 className="improvement-title">
                            내 답변 개선점을 자세히 설명해드릴게요!
                          </h3>

                          {qnaFeedbackData.feedback.map((feedback, index) => (
                            <div className="improvement-card" key={index}>
                              <h4 className="improvement-card-title">{`${
                                index + 1
                              }. ${feedback.title}`}</h4>
                              <div className="improvement-content">
                                <p className="improvement-description">
                                  {feedback.content}
                                </p>
                                <p className="improvement-description">
                                  <span className="highlight-icon">👉</span>
                                  {` ${feedback.improvement}`}
                                </p>

                                {/* {qnaFeedbackData.missingKeywords &&
                                  qnaFeedbackData.missingKeywords.length >
                                    0 && (
                                    <div className="improvement-highlight">
                                      <span className="highlight-icon">👉</span>
                                      <span>
                                        누락된 키워드:{" "}
                                        {qnaFeedbackData.missingKeywords.join(
                                          ", "
                                        )}
                                      </span>
                                    </div>
                                  )}

                                <div className="improvement-result">
                                  <span>
                                    유사도:{" "}
                                    {(qnaFeedbackData.similarity * 100).toFixed(
                                      1
                                    )}
                                    %
                                  </span>
                                  <span>
                                    키워드 재현율:{" "}
                                    {(
                                      qnaFeedbackData.keywordRecall * 100
                                    ).toFixed(1)}
                                    %
                                  </span>
                                  <span>
                                    커버리지:{" "}
                                    {(qnaFeedbackData.coverage * 100).toFixed(
                                      1
                                    )}
                                    %
                                  </span>
                                </div> */}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div style={{ padding: "40px", textAlign: "center" }}>
                      질의응답 피드백 데이터가 없습니다.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
