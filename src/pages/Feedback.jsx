// import "../styles/Feedback.css";
// import Header from "../components/Header";
// import { useState, useRef, useEffect, useMemo } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { getFeedback } from "../api/feedbackApi";
// import backgroundWave from "../assets/SVG_ Feedback/background-wave.svg";
// import backgroundLine from "../assets/SVG_ Feedback/background-line.svg";
// import backgroundChart from "../assets/SVG_ Feedback/background-chart.svg";
// import iconRetry from "../assets/SVG_ Feedback/icon-retry.svg";
// import iconThumbsUp from "../assets/SVG_ Feedback/icon-thumbs-up.svg";
// import iconNode from "../assets/SVG_ Feedback/icon-node.svg";
// import iconChevron from "../assets/SVG_ Feedback/icon-chevron.svg";

// const Feedback = () => {
//   const { sessionId } = useParams();
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState("page");
//   const [expandedCards, setExpandedCards] = useState({
//     1: true,
//     2: true,
//     3: true,
//     4: true,
//     5: true,
//     6: true,
//     7: true,
//   });
//   const [expandedRecommendedAnswer, setExpandedRecommendedAnswer] =
//     useState(false);

//   // 기본값 설정 (API 호출 실패 시 사용)
//   const defaultFeedbackData = useMemo(
//     () => ({
//       grade: "B",
//       totalScore: 81,
//       spmScore: 45,
//       repeatScore: 75,
//       fillerScore: 88,
//       silenceScore: 88,
//       totalSilenceDuration: 272, // 4분 32초
//       qnaComparison: {
//         comparisonId: 0,
//         questionId: 0,
//         question:
//           "타당성 분석에서는 1차 연구를 먼저 하고 나서 2차 연구도 꼭 해야 하나요? 두 방법은 순차적으로 진행되는 필수 관계인가요?",
//         idealAnswer:
//           "1차 연구와 2차 연구는 반드시 순차적으로 진행할 필요는 없습니다. 상황과 목적에 따라 유연하게 선택하거나 병행할 수 있습니다. 일반적으로는 2차 연구를 통해 시장과 경쟁 상황을 파악한 뒤, 1차 연구로 고객의 구체적인 반응을 확인하는 방식을 사용합니다. 반대로 아이디어 검증이 우선일 경우 1차 연구를 먼저 수행하고, 이후 2차 연구로 데이터를 보완하기도 합니다. 핵심은 연구의 순서보다 목적에 맞는 방법을 활용해 실질적인 의사결정에 도움이 되도록 하는 것입니다.",
//         userAnswer:
//           "1차 연구와 2차 연구는 필수적인 순차 관계는 아니며, 상황과 목적에 따라 유연하게 선택하거나 병행할 수 있는데요, 일반적으로는 2차 연구를 먼저 해서 시장과 경쟁 상황을 파악하고, 그 후 1차 연구로 고객 반응을 구체적으로 확인하는 경우가 많습니다. 하지만 아이디어 검증을 위해 1차 연구를 먼저 하고, 이후 2차 연구로 데이터를 보완하는 방식도 가능합니다. 중요한 건 순서보다 목적에 맞게 분석 방법을 활용해 실질적인 의사결정에 도움을 주는 것입니다.",
//         similarity: 0.85,
//         keywordRecall: 0.75,
//         coverage: 0.8,
//         feedback:
//           "기존 문장은 한 문장 안에 여러 개념이 한꺼번에 들어 있어서 읽는 사람이 중간에 문맥을 따라가기 어려웠어요. 개선 문장은 문장을 짧게 나누어 구조화했어요. 문장이 좀 더 자연스럽고 구어체에 가까워져 '보고서'나 '발표용 원고'에 더 적합한 어조로 변했어요.",
//         missingKeywords: ["유연성", "병행"],
//       },
//     }),
//     []
//   );

//   const [feedbackData, setFeedbackData] = useState(defaultFeedbackData);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const containerRef = useRef(null);
//   const lineRef = useRef(null);
//   const scrollRef = useRef(null);

//   // API 호출
//   useEffect(() => {
//     const fetchFeedback = async () => {
//       if (!sessionId) {
//         // sessionId가 없으면 기본값 사용
//         setFeedbackData(defaultFeedbackData);
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);
//         setError(null);
//         const data = await getFeedback(sessionId);
//         setFeedbackData(data);
//       } catch (err) {
//         console.error("피드백 조회 실패:", err);
//         // API 호출 실패 시 기본값 사용
//         setFeedbackData(defaultFeedbackData);
//         setError(null); // 에러를 표시하지 않고 기본값 사용
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFeedback();
//   }, [sessionId]);

//   const toggleCard = (pageNumber) => {
//     // 기준 요소: 카드 헤더의 화면 내 위치를 기준으로
//     const header = document.querySelector(
//       `.timeline-item[data-page="${pageNumber}"] .card-header`
//     );

//     const beforeTop = header?.getBoundingClientRect().top ?? null;

//     setExpandedCards((prev) => ({
//       ...prev,
//       [pageNumber]: !prev[pageNumber],
//     }));

//     // 레이아웃 적용된 직후 프레임에서 재측정
//     if (beforeTop !== null) {
//       requestAnimationFrame(() => {
//         if (!header) return;
//         const afterTop = header.getBoundingClientRect().top;
//         const diff = afterTop - beforeTop;
//         // 뷰포트 역이동
//         if (diff !== 0) {
//           window.scrollBy({ top: diff, left: 0, behavior: "auto" });
//         }
//       });
//     }
//   };

//   useEffect(() => {
//     const containerEl = containerRef.current;
//     const lineEl = lineRef.current;
//     if (!containerEl || !lineEl) return;

//     if (activeTab !== "page") return;

//     const recalc = () => {
//       const nodes = Array.from(containerEl.querySelectorAll(".timeline-node"));

//       if (nodes.length < 2) {
//         lineEl.style.height = "0px";
//         return;
//       }

//       const containerTop = containerEl.getBoundingClientRect().top;
//       const centers = nodes.map((n) => {
//         const r = n.getBoundingClientRect();
//         return r.top - containerTop + r.height / 2;
//       });

//       const firstY = Math.min(...centers);
//       const lastY = Math.max(...centers);

//       lineEl.style.top = `${firstY}px`;
//       lineEl.style.height = `${lastY - firstY}px`;
//     };

//     recalc();

//     const onResize = () => recalc();
//     const onScroll = () => recalc();

//     window.addEventListener("resize", onResize);
//     scrollRef.current?.addEventListener("scroll", onScroll);

//     return () => {
//       window.removeEventListener("resize", onResize);
//       scrollRef.current?.removeEventListener("scroll", onScroll);
//     };
//   }, [activeTab, expandedCards]);

//   // tag-count 텍스트 속 어휘 추출 및 텍스트 강조 함수
//   const highlightKeywords = (text, tagCountText) => {
//     if (!tagCountText || !text) return text;

//     // tag-count 텍스트에서 어휘 추출
//     const keywords = [];

//     // 콜론(:) 뒤의 전체 텍스트 가져오기
//     const colonMatch = tagCountText.match(/:\s*(.+)/);
//     if (colonMatch) {
//       const afterColon = colonMatch[1].trim();
//       // 콤마로 구분된 각 어휘 추출
//       const commaSeparated = afterColon
//         .split(",")
//         .map((s) => s.trim())
//         .filter((s) => {
//           // "N회" 패턴 제외
//           return s && !s.match(/^\d+회$/);
//         });
//       keywords.push(...commaSeparated);
//     }

//     if (!colonMatch || tagCountText.split(":").length > 2) {
//       const parts = tagCountText.split(",").map((part) => part.trim());
//       parts.forEach((part) => {
//         if (part.includes(":")) {
//           const keyword = part.split(":")[0].trim();
//           if (keyword && !keyword.match(/^\d+회$/)) {
//             keywords.push(keyword);
//           }
//         }
//       });
//     }

//     // 중복 제거
//     const uniqueKeywords = [
//       ...new Set(keywords.filter((k) => k && k.length > 0)),
//     ];

//     if (uniqueKeywords.length === 0) return text;

//     // 텍스트에서 키워드를 찾아서 빨간색으로 강조
//     // 긴 키워드부터 처리하여 부분 매칭 방지
//     const sortedKeywords = uniqueKeywords.sort((a, b) => b.length - a.length);
//     let highlightedText = text;

//     sortedKeywords.forEach((keyword) => {
//       // 정규식으로 키워드 찾기 (특수문자 이스케이프)
//       const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
//       const regex = new RegExp(`(${escapedKeyword})`, "gi");
//       highlightedText = highlightedText.replace(
//         regex,
//         '<span style="color: #FF0000; font-weight: 500;">$1</span>'
//       );
//     });

//     return highlightedText;
//   };

//   const renderHighlightedText = (text, tagCountText) => {
//     const highlighted = highlightKeywords(text, tagCountText);
//     return <span dangerouslySetInnerHTML={{ __html: highlighted }} />;
//   };

//   // 로딩 상태
//   if (loading) {
//     return (
//       <div className="Feedback">
//         <Header />
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             minHeight: "50vh",
//           }}
//         >
//           <div>피드백을 불러오는 중...</div>
//         </div>
//       </div>
//     );
//   }

//   const {
//     grade,
//     totalScore,
//     spmScore,
//     fillerScore,
//     repeatScore,
//     silenceScore,
//     totalSilenceDuration,
//     qnaComparison,
//   } = feedbackData;

//   // 발표 시간 포맷팅 (totalSilenceDuration을 이용해 계산하는 것이 좋지만, API에서 제공되지 않으면 기본값 사용)
//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = Math.floor(seconds % 60);
//     return `${mins}분 ${secs}초`;
//   };

//   // 피드백 메시지 생성 (등급과 점수에 따라)
//   const getFeedbackMessage = () => {
//     if (spmScore < 50) {
//       return ["말하기 속도를 조금 더", "천천히 하면 좋겠어요!"];
//     } else if (fillerScore < 50) {
//       return ["불필요한 추임새를 줄여", "더 매끄러운 발표를 만들어보세요!"];
//     } else if (repeatScore < 50) {
//       return ["반복되는 표현을 줄이고", "다양한 어휘를 사용해보세요!"];
//     } else {
//       return ["좋은 발표였어요!", "계속 노력해보세요."];
//     }
//   };

//   const feedbackMessage = getFeedbackMessage();

//   return (
//     <div className="Feedback">
//       <Header />

//       {/* 배경 SVG들 */}
//       <img
//         src={backgroundWave}
//         style={{
//           position: "absolute",
//           left: "-220px",
//           top: "5px",
//           width: "1180px",
//           height: "444px",
//           opacity: 1,
//           zIndex: 0,
//         }}
//       />
//       <img
//         src={backgroundLine}
//         style={{
//           position: "absolute",
//           left: "-66px",
//           top: "520px",
//           height: "180px",
//           opacity: 0.7,
//           zIndex: 0,
//         }}
//       />
//       <img
//         src={backgroundChart}
//         style={{
//           position: "absolute",
//           left: "1154px",
//           top: "150px",
//           width: "173px",
//           height: "356px",
//           opacity: 0.8,
//           zIndex: 0,
//           borderTopRightRadius: "8px",
//         }}
//       />

//       <div className="feedback-content">
//         <div className="feedback-top">
//           <div className="feedback-left">
//             <div className="grade-container">
//               <div className="grade-circle">
//                 <div className="grade-inner-circle">
//                   <span className="grade-letter">{grade || "B"}</span>
//                 </div>
//               </div>
//               <div className="total-score-oval">
//                 <span className="total-score-label">총점:</span>
//                 <span className="total-score-number">{totalScore || 0}</span>
//               </div>
//             </div>
//           </div>

//           <div className="feedback-right">
//             <div className="feedback-message">
//               <div>{feedbackMessage[0]}</div>
//               <div>{feedbackMessage[1]}</div>
//             </div>
//             <div className="presentation-time">
//               <span className="time-label">총 발표 시간 : </span>
//               <span className="time-value">
//                 {totalSilenceDuration
//                   ? formatTime(totalSilenceDuration)
//                   : "4분 32초"}
//               </span>
//             </div>
//             <button
//               className="practice-button"
//               onClick={() => {
//                 // TODO: 연습 페이지로 돌아가기 (projectId나 sessionId를 이용해 practice 페이지로 이동)
//                 // 현재는 sessionId만 있으므로, projectId를 조회하는 API가 필요할 수 있습니다.
//                 navigate(-1);
//               }}
//             >
//               <img src={iconRetry} alt="재시도" className="practice-icon" />
//               다시 연습해보기
//             </button>
//           </div>
//         </div>

//         <div className="feedback-main">
//           <div className="svg-section-container detail">
//             <div className="section-content">
//               <h2 className="section-title">세부 점수</h2>
//               <div className="score-grid">
//                 <div className="score-item">
//                   <span className="score-label">말하기 속도</span>
//                   <span className="score-value">{spmScore || 0}점</span>
//                 </div>
//                 <div className="score-item">
//                   <span className="score-label">말의 반복</span>
//                   <span className="score-value">{repeatScore || 0}점</span>
//                 </div>
//                 <div className="score-item">
//                   <span className="score-label">말의 망설임</span>
//                   <span className="score-value">{fillerScore || 0}점</span>
//                 </div>
//                 <div className="score-item">
//                   <span className="score-label">침묵</span>
//                   <span className="score-value">{silenceScore || 0}점</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="record-wrapper">
//             <div className="svg-section-container record">
//               <div className="section-content">
//                 <h2 className="section-title">연습 기록</h2>
//                 <div className="record-container">
//                   <div className="record-item current-record">
//                     <span className="record-label">현재 점수</span>
//                     <div className="record-bar-container">
//                       <div
//                         className="record-bar current-bar"
//                         style={{ width: "81%" }}
//                       ></div>
//                       <span className="record-score">81점</span>
//                     </div>
//                   </div>
//                   <div className="record-item">
//                     <span className="record-date">06/05</span>
//                     <div className="record-bar-container">
//                       <div
//                         className="record-bar"
//                         style={{ width: "58%" }}
//                       ></div>
//                       <span className="record-score">58점</span>
//                     </div>
//                   </div>
//                   <div className="record-item">
//                     <span className="record-date">06/05</span>
//                     <div className="record-bar-container">
//                       <div
//                         className="record-bar"
//                         style={{ width: "64%" }}
//                       ></div>
//                       <span className="record-score">64점</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="record-note">최근 점수가 3개만 저장됩니다.</div>
//           </div>
//         </div>

//         <div className="feedback-bottom-section">
//           <div className="feedback-content-box">
//             <div className="feedback-bottom-header">
//               <h2 className="feedback-bottom-title">
//                 {activeTab === "page" ? "페이지별 피드백" : "질의응답 피드백"}
//               </h2>
//               <div className="tab-buttons">
//                 <button
//                   className={`tab-button ${
//                     activeTab === "page" ? "active" : ""
//                   }`}
//                   onClick={() => setActiveTab("page")}
//                 >
//                   페이지별
//                 </button>
//                 <button
//                   className={`tab-button ${activeTab === "qa" ? "active" : ""}`}
//                   onClick={() => setActiveTab("qa")}
//                 >
//                   질의응답
//                 </button>
//               </div>
//             </div>
//             <div className="feedback-content-area" ref={scrollRef}>
//               {activeTab === "page" ? (
//                 /* TODO: 페이지별 피드백 데이터는 현재 API 응답에 포함되어 있지 않습니다.
//                  * 별도의 API가 필요하거나, 세션 피드백 API 응답에 페이지별 정보가 추가될 수 있습니다.
//                  * 현재는 하드코딩된 데이터를 표시합니다.
//                  */
//                 <div className="page-feedback">
//                   <div className="timeline-container" ref={containerRef}>
//                     <div className="timeline-line" ref={lineRef}></div>

//                     <div className="timeline-item" data-page="1">
//                       <div className="timeline-node"></div>
//                       <div className="thumbnail-box">
//                         <div className="thumbnail-placeholder">PPT 썸네일</div>
//                       </div>
//                       <div className="feedback-card">
//                         <div className="card-header">
//                           <span className="page-number">1p</span>
//                           <div className="time-info">
//                             <span className="timestamp">00:06:23</span>
//                             <span
//                               className={`expand-icon ${
//                                 expandedCards[1] ? "expanded" : ""
//                               }`}
//                               onClick={() => toggleCard(1)}
//                             >
//                               <img
//                                 src={iconChevron}
//                                 alt="toggle"
//                                 style={{ width: "14px", height: "8px" }}
//                               />
//                             </span>
//                           </div>
//                         </div>
//                         {expandedCards[1] && (
//                           <div className="content-divider"></div>
//                         )}
//                         {expandedCards[1] && (
//                           <div className="card-content">
//                             <p>
//                               안녕하세요 저는 타당성 분석에 대해 발표할
//                               디지털미디어학과 김슈니 입니다.
//                             </p>
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     <div className="timeline-item" data-page="2">
//                       <div className="timeline-node has-feedback">
//                         <img
//                           src={iconNode}
//                           alt="피드백"
//                           style={{ width: "100%", height: "100%" }}
//                         />
//                       </div>
//                       <div className="thumbnail-box">
//                         <div className="thumbnail-placeholder">PPT 썸네일</div>
//                       </div>
//                       <div className="feedback-card">
//                         <div className="card-header">
//                           <div className="page-info">
//                             <span className="page-number">2p</span>
//                             <div className="tag-icon">
//                               <img
//                                 src="/src/assets/SVG_ Feedback/icon-type-hesitate.svg"
//                                 alt="말의 망설임"
//                               />
//                             </div>
//                           </div>
//                           <div className="time-info">
//                             <span className="timestamp">00:26:23</span>
//                             <span
//                               className={`expand-icon ${
//                                 expandedCards[2] ? "expanded" : ""
//                               }`}
//                               onClick={() => toggleCard(2)}
//                             >
//                               <img
//                                 src={iconChevron}
//                                 alt="toggle"
//                                 style={{ width: "14px", height: "8px" }}
//                               />
//                             </span>
//                           </div>
//                         </div>
//                         {expandedCards[2] && (
//                           <div className="content-divider"></div>
//                         )}
//                         {expandedCards[2] && (
//                           <div className="card-content">
//                             <p>
//                               {renderHighlightedText(
//                                 "타당성 분석은 일반적으로 네 가지 구성 요소를 중심으로 진행됩니다. 시장성, 기술성, 재무성, 조직 역량이 바로 그 네 가지입니다. 이 중 하나라도 기준에 미치지 못하면, 뭐지 아이디어를 폐기하거나 전면 수정해야 할 수 있습니다. 따라서 분석은 단순한 평가가 아니라, 음 실행 여부를 결정하는 핵심 기준입니다.",
//                                 "음: 1회, 뭐지: 1회"
//                               )}
//                             </p>

//                             <div className="feedback-details">
//                               <div className="feedback-tag">
//                                 <span className="tag-label">말의 망설임</span>
//                                 <span className="tag-count">
//                                   음: 1회, 뭐지: 1회
//                                 </span>
//                               </div>
//                               <div className="feedback-comment">
//                                 <p>
//                                   불필요한 추임새가 잦아 발표 흐름이 끊기는
//                                   느낌이 들었어요. 발표 전에 내용을 더 숙지 하면
//                                   줄일 수 있을 거예요.
//                                 </p>
//                               </div>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     <div className="timeline-item" data-page="3">
//                       <div className="timeline-node has-feedback">
//                         <img
//                           src={iconNode}
//                           alt="피드백"
//                           style={{ width: "100%", height: "100%" }}
//                         />
//                       </div>
//                       <div className="thumbnail-box">
//                         <div className="thumbnail-placeholder">PPT 썸네일</div>
//                       </div>
//                       <div className="feedback-card">
//                         <div className="card-header">
//                           <div className="page-info">
//                             <span className="page-number">3p</span>
//                             <div className="tag-icon">
//                               <img
//                                 src="/src/assets/SVG_ Feedback/icon-type-speed.svg"
//                                 alt="발표 속도"
//                               />
//                             </div>
//                           </div>
//                           <div className="time-info">
//                             <span className="timestamp">00:57:10</span>
//                             <span
//                               className={`expand-icon ${
//                                 expandedCards[3] ? "expanded" : ""
//                               }`}
//                               onClick={() => toggleCard(3)}
//                             >
//                               <img
//                                 src={iconChevron}
//                                 alt="toggle"
//                                 style={{ width: "14px", height: "8px" }}
//                               />
//                             </span>
//                           </div>
//                         </div>
//                         {expandedCards[3] && (
//                           <div className="content-divider"></div>
//                         )}
//                         {expandedCards[3] && (
//                           <div className="card-content">
//                             <p>
//                               타당성 분석의 방법은 두 가지가 있습니다. 1차
//                               연구와 2차 연구로 나뉘어져 있는데요, 1차 연구는
//                               분석을 진행하는 사람이나 팀이 직접 수집하는
//                               연구입니다. 잠재 고객가의 대화, 업계 전문가로부터
//                               피드백, 포커스 그룹 수행, 설문조사 실시로
//                               진행합니다.
//                             </p>

//                             <div className="feedback-details">
//                               <div className="feedback-tag">
//                                 <span className="tag-label">발표 속도</span>
//                                 <span className="tag-count">속도 빠름</span>
//                               </div>
//                               <div className="feedback-comment">
//                                 <p>
//                                   조금 빠르게 말하는 경향이 있어 중요한 부분이
//                                   잘 들리지 않았어요. 핵심 내용에서는 속도를
//                                   천천히 조절해보면 좋아요.
//                                 </p>
//                                 <div className="speed-comparison">
//                                   <div className="speed-item">
//                                     <span className="speed-label">
//                                       사용자 속도
//                                     </span>
//                                     <div className="speed-bar-container">
//                                       <div
//                                         className="speed-bar user-speed"
//                                         style={{ width: "75%" }}
//                                       ></div>
//                                       <span className="speed-value">
//                                         SPM: 306 음절
//                                       </span>
//                                     </div>
//                                   </div>
//                                   <div className="speed-item">
//                                     <span className="speed-label">
//                                       평균 속도
//                                     </span>
//                                     <div className="speed-bar-container">
//                                       <div
//                                         className="speed-bar average-speed"
//                                         style={{ width: "60%" }}
//                                       ></div>
//                                       <span className="speed-value">
//                                         SPM: 290 음절
//                                       </span>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     <div className="timeline-item" data-page="4">
//                       <div className="timeline-node"></div>
//                       <div className="thumbnail-box">
//                         <div className="thumbnail-placeholder">PPT 썸네일</div>
//                       </div>
//                       <div className="feedback-card">
//                         <div className="card-header">
//                           <span className="page-number">4p</span>
//                           <div className="time-info">
//                             <span className="timestamp">01:06:47</span>
//                             <span
//                               className={`expand-icon ${
//                                 expandedCards[4] ? "expanded" : ""
//                               }`}
//                               onClick={() => toggleCard(4)}
//                             >
//                               <img
//                                 src={iconChevron}
//                                 alt="toggle"
//                                 style={{ width: "14px", height: "8px" }}
//                               />
//                             </span>
//                           </div>
//                         </div>
//                         {expandedCards[4] && (
//                           <div className="content-divider"></div>
//                         )}
//                         {expandedCards[4] && (
//                           <div className="card-content">
//                             <p>
//                               이상으로 타당성 분석에 대한 발표를 모두
//                               마치겠습니다. 감사합니다.
//                             </p>
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     <div className="timeline-item" data-page="5">
//                       <div className="timeline-node has-feedback">
//                         <img
//                           src={iconNode}
//                           alt="피드백"
//                           style={{ width: "100%", height: "100%" }}
//                         />
//                       </div>
//                       <div className="thumbnail-box">
//                         <div className="thumbnail-placeholder">PPT 썸네일</div>
//                       </div>
//                       <div className="feedback-card">
//                         <div className="card-header">
//                           <div className="page-info">
//                             <span className="page-number">5p</span>
//                             <div className="tag-icon">
//                               <img
//                                 src="/src/assets/SVG_ Feedback/icon-type-repeat.svg"
//                                 alt="반복되는 어휘"
//                               />
//                             </div>
//                           </div>
//                           <div className="time-info">
//                             <span className="timestamp">01:26:30</span>
//                             <span
//                               className={`expand-icon ${
//                                 expandedCards[5] ? "expanded" : ""
//                               }`}
//                               onClick={() => toggleCard(5)}
//                             >
//                               <img
//                                 src={iconChevron}
//                                 alt="toggle"
//                                 style={{ width: "14px", height: "8px" }}
//                               />
//                             </span>
//                           </div>
//                         </div>
//                         {expandedCards[5] && (
//                           <div className="content-divider"></div>
//                         )}
//                         {expandedCards[5] && (
//                           <div className="card-content">
//                             <p>
//                               {renderHighlightedText(
//                                 "타당성 분석은 다음과 같은 장점을 제공합니다. 첫째, 사업의 성공 가능성을 객관적으로 판단할 수 있습니다. 둘째, 투자자의 신뢰를 확보할 수 있어 자금 유치에 유리합니다. 그 다음에 셋째, 내부 의사결정 시 리스크를 최소화하는 데 도움이 됩니다. 그러니까 이처럼 타당성 분석은 약간 단순한 검토를 넘어 사업 실행의 필수 조건이라 할 수 있습니다.",
//                                 "3회 : 그 다음에, 그러니까, 약간"
//                               )}
//                             </p>

//                             <div className="feedback-details">
//                               <div className="feedback-tag">
//                                 <span className="tag-label">반복되는 어휘</span>
//                                 <span className="tag-count">
//                                   3회 : 그 다음에, 그러니까, 약간
//                                 </span>
//                               </div>
//                               <div className="feedback-comment">
//                                 <p>
//                                   같은 표현이 반복되어 전달력이 다소 떨어질 수
//                                   있어요. 다양한 표현을 사용해보는 연습이 필요해
//                                   보여요.
//                                 </p>
//                               </div>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     <div className="timeline-item" data-page="6">
//                       <div className="timeline-node has-feedback">
//                         <img
//                           src={iconNode}
//                           alt="피드백"
//                           style={{ width: "100%", height: "100%" }}
//                         />
//                       </div>
//                       <div className="thumbnail-box">
//                         <div className="thumbnail-placeholder">PPT 썸네일</div>
//                       </div>
//                       <div className="feedback-card">
//                         <div className="card-header">
//                           <div className="page-info">
//                             <span className="page-number">6p</span>
//                             <div className="tag-icon">
//                               <img
//                                 src="/src/assets/SVG_ Feedback/icon-type-aim.svg"
//                                 alt="발표 정확도"
//                               />
//                             </div>
//                           </div>
//                           <div className="time-info">
//                             <span className="timestamp">01:59:06</span>
//                             <span
//                               className={`expand-icon ${
//                                 expandedCards[6] ? "expanded" : ""
//                               }`}
//                               onClick={() => toggleCard(6)}
//                             >
//                               <img
//                                 src={iconChevron}
//                                 alt="toggle"
//                                 style={{ width: "14px", height: "8px" }}
//                               />
//                             </span>
//                           </div>
//                         </div>
//                         {expandedCards[6] && (
//                           <div className="content-divider"></div>
//                         )}
//                         {expandedCards[6] && (
//                           <div className="card-content">
//                             <p>
//                               타당성 분석은 네가지 구성요소를 중심으로
//                               진행됩니다. 시장성, 기술성, 특이성, 조직역량
//                               네가지입니다. 기준에 미치지 못하는 요소가 있다면
//                               해당 아이디어를 폐기하거나 전부 바꿔야합니다. 고로
//                               해당 네가지 요소는 단순평가가 아닌 실행 여부를
//                               결정하는 중요한 기준이 됩니다.
//                             </p>

//                             <div className="feedback-details">
//                               <div className="feedback-tag">
//                                 <span className="tag-label">발표 정확도</span>
//                                 <span className="tag-count">
//                                   오류 부분 : 2회
//                                 </span>
//                               </div>
//                               <div className="feedback-comment">
//                                 <p>
//                                   내용의 정확도가 다소 부족해 전달에 혼란이 있을
//                                   수 있어요. 발표 전에 정보를 다시 한 번
//                                   점검해보면 좋겠어요.
//                                 </p>
//                               </div>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     <div className="timeline-item" data-page="7">
//                       <div className="timeline-node"></div>
//                       <div className="thumbnail-box">
//                         <div className="thumbnail-placeholder">PPT 썸네일</div>
//                       </div>
//                       <div className="feedback-card">
//                         <div className="card-header">
//                           <span className="page-number">7p</span>
//                           <div className="time-info">
//                             <span className="timestamp">02:11:02</span>
//                             <span
//                               className={`expand-icon ${
//                                 expandedCards[7] ? "expanded" : ""
//                               }`}
//                               onClick={() => toggleCard(7)}
//                             >
//                               <img
//                                 src={iconChevron}
//                                 alt="toggle"
//                                 style={{ width: "14px", height: "8px" }}
//                               />
//                             </span>
//                           </div>
//                         </div>
//                         {expandedCards[7] && (
//                           <div className="content-divider"></div>
//                         )}
//                         {expandedCards[7] && (
//                           <div className="card-content">
//                             <p>
//                               이상으로 타당성 분석에 대한 발표를 모두
//                               마치겠습니다. 감사합니다.
//                             </p>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="qa-feedback">
//                   {qnaComparison ? (
//                     <>
//                       <div className="qa-question">
//                         <span className="question-prefix">Q.</span>
//                         <p className="question-text">
//                           {qnaComparison.question}
//                         </p>
//                       </div>

//                       <div className="qa-user-answer">
//                         <h3 className="answer-label">내가 한 답변</h3>
//                         <div className="answer-box">
//                           <p>{qnaComparison.userAnswer}</p>
//                         </div>
//                       </div>

//                       <div className="qa-recommended-answer">
//                         <div
//                           className="recommended-header"
//                           onClick={() =>
//                             setExpandedRecommendedAnswer(
//                               !expandedRecommendedAnswer
//                             )
//                           }
//                         >
//                           <div className="recommended-title">
//                             <img
//                               src={iconThumbsUp}
//                               alt="추천"
//                               className="thumbs-up-icon"
//                             />
//                             <span>추천 답안 보기</span>
//                             <span
//                               className={`expand-icon ${
//                                 expandedRecommendedAnswer ? "expanded" : ""
//                               }`}
//                             >
//                               <img
//                                 src={iconChevron}
//                                 alt="toggle"
//                                 style={{ width: "14px", height: "8px" }}
//                               />
//                             </span>
//                           </div>
//                         </div>
//                         {expandedRecommendedAnswer && (
//                           <div className="recommended-content">
//                             <p>{qnaComparison.idealAnswer}</p>
//                           </div>
//                         )}
//                       </div>

//                       {qnaComparison.feedback && (
//                         <div className="improvement-section">
//                           <h3 className="improvement-title">
//                             내 답변 개선점을 자세히 설명해드릴게요!
//                           </h3>

//                           <div className="improvement-card">
//                             <h4 className="improvement-card-title">피드백</h4>
//                             <div className="improvement-content">
//                               <p className="improvement-description">
//                                 {qnaComparison.feedback}
//                               </p>

//                               {qnaComparison.missingKeywords &&
//                                 qnaComparison.missingKeywords.length > 0 && (
//                                   <div className="improvement-highlight">
//                                     <span className="highlight-icon">👉</span>
//                                     <span>
//                                       누락된 키워드:{" "}
//                                       {qnaComparison.missingKeywords.join(", ")}
//                                     </span>
//                                   </div>
//                                 )}

//                               <div className="improvement-result">
//                                 <span>
//                                   유사도:{" "}
//                                   {(qnaComparison.similarity * 100).toFixed(1)}%
//                                 </span>
//                                 <span>
//                                   키워드 재현율:{" "}
//                                   {(qnaComparison.keywordRecall * 100).toFixed(
//                                     1
//                                   )}
//                                   %
//                                 </span>
//                                 <span>
//                                   커버리지:{" "}
//                                   {(qnaComparison.coverage * 100).toFixed(1)}%
//                                 </span>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       )}
//                     </>
//                   ) : (
//                     <div style={{ padding: "40px", textAlign: "center" }}>
//                       질의응답 피드백 데이터가 없습니다.
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Feedback;

import "../styles/Feedback.css";
import Header from "../components/Header";
import { useState, useRef, useEffect } from "react";
import backgroundWave from "../assets/SVG_ Feedback/background-wave.svg";
import backgroundLine from "../assets/SVG_ Feedback/background-line.svg";
import backgroundChart from "../assets/SVG_ Feedback/background-chart.svg";
import iconRetry from "../assets/SVG_ Feedback/icon-retry.svg";
import iconThumbsUp from "../assets/SVG_ Feedback/icon-thumbs-up.svg";
import iconNode from "../assets/SVG_ Feedback/icon-node.svg";
import iconChevron from "../assets/SVG_ Feedback/icon-chevron.svg";

const Feedback = () => {
  const [activeTab, setActiveTab] = useState("page");
  const [expandedCards, setExpandedCards] = useState({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: true,
    7: true,
    8: true,
    9: true,
    10: true,
    11: true,
    12: true,
    13: true,
    14: true,
    15: true,
    16: true,
    17: true,
    18: true,
    19: true,
    20: true,
    21: true,
  });
  const [expandedRecommendedAnswer, setExpandedRecommendedAnswer] =
    useState(false);
  const containerRef = useRef(null);
  const lineRef = useRef(null);
  const scrollRef = useRef(null);

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
                  <span className="grade-letter">B</span>
                </div>
              </div>
              <div className="total-score-oval">
                <span className="total-score-label">총점:</span>
                <span className="total-score-number">85</span>
              </div>
            </div>
          </div>

          <div className="feedback-right">
            <div className="feedback-message">
              <div>말하기 속도를 좀만 더 천천히하여</div>
              <div>전달력을 높여보아요!</div>
            </div>
            <div className="presentation-time">
              <span className="time-label">총 발표 시간 : </span>
              <span className="time-value">4분 32초 11</span>
            </div>
            <button className="practice-button">
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
                  <span className="score-value">88점</span>
                </div>
                <div className="score-item">
                  <span className="score-label">말의 반복</span>
                  <span className="score-value">75점</span>
                </div>
                <div className="score-item">
                  <span className="score-label">말의 망설임</span>
                  <span className="score-value">88점</span>
                </div>
                <div className="score-item">
                  <span className="score-label">발표 정확도</span>
                  <span className="score-value">88점</span>
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
                        style={{ width: "81%" }}
                      ></div>
                      <span className="record-score">85점</span>
                    </div>
                  </div>
                  {/* <div className="record-item">
                    <span className="record-date">06/05</span>
                    <div className="record-bar-container">
                      <div
                        className="record-bar"
                        style={{ width: "58%" }}
                      ></div>
                      <span className="record-score">58점</span>
                    </div>
                  </div>
                  <div className="record-item">
                    <span className="record-date">06/05</span>
                    <div className="record-bar-container">
                      <div
                        className="record-bar"
                        style={{ width: "64%" }}
                      ></div>
                      <span className="record-score">64점</span>
                    </div>
                  </div> */}
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
                  disabled={true}
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

                    <div className="timeline-item" data-page="1">
                      <div className="timeline-node"></div>
                      <div className="thumbnail-box">
                        <div className="thumbnail-placeholder">PPT 썸네일</div>
                      </div>
                      <div className="feedback-card">
                        <div className="card-header">
                          <span className="page-number">1p</span>
                          <div className="time-info">
                            {/* <span className="timestamp">00:06:23</span> */}
                            <span
                              className={`expand-icon ${
                                expandedCards[1] ? "expanded" : ""
                              }`}
                              onClick={() => toggleCard(1)}
                            >
                              <img
                                src={iconChevron}
                                alt="toggle"
                                style={{ width: "14px", height: "8px" }}
                              />
                            </span>
                          </div>
                        </div>
                        {expandedCards[1] && (
                          <div className="content-divider"></div>
                        )}
                        {expandedCards[1] && (
                          <div className="card-content">
                            <p>
                              대학생의 발표 완성도 향상을 위한 AI 발표 피드백
                              서비스 프레스 발표를 시작하겠습니다.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="timeline-item" data-page="2">
                      <div className="timeline-node has-feedback">
                        <img
                          src={iconNode}
                          alt="피드백"
                          style={{ width: "100%", height: "100%" }}
                        />
                      </div>
                      <div className="thumbnail-box">
                        <div className="thumbnail-placeholder">PPT 썸네일</div>
                      </div>
                      <div className="feedback-card">
                        <div className="card-header">
                          <div className="page-info">
                            <span className="page-number">2p</span>
                            <div className="tag-icon">
                              <img
                                src="/src/assets/SVG_ Feedback/icon-type-hesitate.svg"
                                alt="말의 망설임"
                              />
                            </div>
                          </div>
                          <div className="time-info">
                            {/* <span className="timestamp">00:26:23</span> */}
                            <span
                              className={`expand-icon ${
                                expandedCards[2] ? "expanded" : ""
                              }`}
                              onClick={() => toggleCard(2)}
                            >
                              <img
                                src={iconChevron}
                                alt="toggle"
                                style={{ width: "14px", height: "8px" }}
                              />
                            </span>
                          </div>
                        </div>
                        {expandedCards[2] && (
                          <div className="content-divider"></div>
                        )}
                        {expandedCards[2] && (
                          <div className="card-content">
                            <p>
                              연구 조사 사례 결과를 통해 대학생들은 프레젠테이션
                              능력 향상의 중요함을 인지하고 있음을 알 수
                              있었습니다.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="timeline-item" data-page="3">
                      <div className="timeline-node has-feedback">
                        <img
                          src={iconNode}
                          alt="피드백"
                          style={{ width: "100%", height: "100%" }}
                        />
                      </div>
                      <div className="thumbnail-box">
                        <div className="thumbnail-placeholder">PPT 썸네일</div>
                      </div>
                      <div className="feedback-card">
                        <div className="card-header">
                          <div className="page-info">
                            <span className="page-number">3p</span>
                            <div className="tag-icon">
                              <img
                                src="/src/assets/SVG_ Feedback/icon-type-speed.svg"
                                alt="발표 속도"
                              />
                            </div>
                          </div>
                          <div className="time-info">
                            {/* <span className="timestamp">00:57:10</span> */}
                            <span
                              className={`expand-icon ${
                                expandedCards[3] ? "expanded" : ""
                              }`}
                              onClick={() => toggleCard(3)}
                            >
                              <img
                                src={iconChevron}
                                alt="toggle"
                                style={{ width: "14px", height: "8px" }}
                              />
                            </span>
                          </div>
                        </div>
                        {expandedCards[3] && (
                          <div className="content-divider"></div>
                        )}
                        {expandedCards[3] && (
                          <div className="card-content">
                            <p>
                              그러나 실전과 다른 연습 환경에 의해 연습의
                              필요성을 크게 못느끼고 이는 실전 발표 까지 영향을
                              줍니다. 그런데 왜 발표를 부담스러워할까요?
                              대학생들의 발표 과업에서 나타나는 문제를 찾기 위해
                              발표 과업 경험 인터뷰를 해본 결과 대학생들은
                              실전과 다른 연습 환경에 연습 의 필요성을 크게
                              못느끼고 이는 실전 발표 까지 영향을 주며 결국 발표
                              불안과 연결된다는 점을 알 수 있었습니다.
                            </p>

                            <div className="feedback-details">
                              <div className="feedback-tag">
                                <span className="tag-label">발표 속도</span>
                                <span className="tag-count">속도 빠름</span>
                              </div>
                              <div className="feedback-comment">
                                <p>
                                  조금 빠르게 말하는 경향이 있어 중요한 부분이
                                  잘 들리지 않았어요. 핵심 내용에서는 속도를
                                  천천히 조절해보면 좋아요.
                                </p>
                                <div className="speed-comparison">
                                  <div className="speed-item">
                                    <span className="speed-label">
                                      사용자 속도
                                    </span>
                                    <div className="speed-bar-container">
                                      <div
                                        className="speed-bar user-speed"
                                        style={{ width: "75%" }}
                                      ></div>
                                      <span className="speed-value">
                                        SPM: 306 음절
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
                                        style={{ width: "60%" }}
                                      ></div>
                                      <span className="speed-value">
                                        SPM: 290 음절
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="timeline-item" data-page="4">
                      <div className="timeline-node"></div>
                      <div className="thumbnail-box">
                        <div className="thumbnail-placeholder">PPT 썸네일</div>
                      </div>
                      <div className="feedback-card">
                        <div className="card-header">
                          <span className="page-number">4p</span>
                          <div className="time-info">
                            {/* <span className="timestamp">01:06:47</span> */}
                            <span
                              className={`expand-icon ${
                                expandedCards[4] ? "expanded" : ""
                              }`}
                              onClick={() => toggleCard(4)}
                            >
                              <img
                                src={iconChevron}
                                alt="toggle"
                                style={{ width: "14px", height: "8px" }}
                              />
                            </span>
                          </div>
                        </div>
                        {expandedCards[4] && (
                          <div className="content-divider"></div>
                        )}
                        {expandedCards[4] && (
                          <div className="card-content">
                            <p>
                              현존하는 서비스를 찾아보았으나 이는 단기적인 발표
                              과업이 아닌 말하기 전반의 능력 향상이 목표로
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="timeline-item" data-page="5">
                      <div className="timeline-node has-feedback">
                        <img
                          src={iconNode}
                          alt="피드백"
                          style={{ width: "100%", height: "100%" }}
                        />
                      </div>
                      <div className="thumbnail-box">
                        <div className="thumbnail-placeholder">PPT 썸네일</div>
                      </div>
                      <div className="feedback-card">
                        <div className="card-header">
                          <div className="page-info">
                            <span className="page-number">5p</span>
                            <div className="tag-icon">
                              <img
                                src="/src/assets/SVG_ Feedback/icon-type-repeat.svg"
                                alt="반복되는 어휘"
                              />
                            </div>
                          </div>
                          <div className="time-info">
                            {/* <span className="timestamp">01:26:30</span> */}
                            <span
                              className={`expand-icon ${
                                expandedCards[5] ? "expanded" : ""
                              }`}
                              onClick={() => toggleCard(5)}
                            >
                              <img
                                src={iconChevron}
                                alt="toggle"
                                style={{ width: "14px", height: "8px" }}
                              />
                            </span>
                          </div>
                        </div>
                        {expandedCards[5] && (
                          <div className="content-divider"></div>
                        )}
                        {expandedCards[5] && (
                          <div className="card-content">
                            <p>
                              자료 구성 연습 피드백 반복 개선의 과정으로
                              이루어지는 발표 상황에서의 맥락 반영이 부족합니다.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="timeline-item" data-page="6">
                      <div className="timeline-node has-feedback">
                        <img
                          src={iconNode}
                          alt="피드백"
                          style={{ width: "100%", height: "100%" }}
                        />
                      </div>
                      <div className="thumbnail-box">
                        <div className="thumbnail-placeholder">PPT 썸네일</div>
                      </div>
                      <div className="feedback-card">
                        <div className="card-header">
                          <div className="page-info">
                            <span className="page-number">6p</span>
                            <div className="tag-icon">
                              <img
                                src="/src/assets/SVG_ Feedback/icon-type-aim.svg"
                                alt="발표 정확도"
                              />
                            </div>
                          </div>
                          <div className="time-info">
                            {/* <span className="timestamp">01:59:06</span> */}
                            <span
                              className={`expand-icon ${
                                expandedCards[6] ? "expanded" : ""
                              }`}
                              onClick={() => toggleCard(6)}
                            >
                              <img
                                src={iconChevron}
                                alt="toggle"
                                style={{ width: "14px", height: "8px" }}
                              />
                            </span>
                          </div>
                        </div>
                        {expandedCards[6] && (
                          <div className="content-divider"></div>
                        )}
                        {expandedCards[6] && (
                          <div className="card-content">
                            <p>
                              그래서 저희는 혼자서도 실전처럼 발표해볼 수 있는
                              체계적인 시스템이 부재하다는 점을 문제로
                              정의하였습니다.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="timeline-item" data-page="7">
                      <div className="timeline-node"></div>
                      <div className="thumbnail-box">
                        <div className="thumbnail-placeholder">PPT 썸네일</div>
                      </div>
                      <div className="feedback-card">
                        <div className="card-header">
                          <span className="page-number">7p</span>
                          <div className="time-info">
                            {/* <span className="timestamp">02:11:02</span> */}
                            <span
                              className={`expand-icon ${
                                expandedCards[7] ? "expanded" : ""
                              }`}
                              onClick={() => toggleCard(7)}
                            >
                              <img
                                src={iconChevron}
                                alt="toggle"
                                style={{ width: "14px", height: "8px" }}
                              />
                            </span>
                          </div>
                        </div>
                        {expandedCards[7] && (
                          <div className="content-divider"></div>
                        )}
                        {expandedCards[7] && (
                          <div className="card-content">
                            <p>
                              발표 완성도를 높이고 싶은 대학생에게 피드백을
                              제공하여 발표 연습 과업을 꼼꼼하게 수행할 수
                              있도록 도와 최종 발표의 완성도를 올리고자 하는
                              욕구를 사용자 가치로 선정하였습니다.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="timeline-item" data-page="8">
                      <div className="timeline-node"></div>
                      <div className="thumbnail-box">
                        <div className="thumbnail-placeholder">PPT 썸네일</div>
                      </div>
                      <div className="feedback-card">
                        <div className="card-header">
                          <span className="page-number">8p</span>
                          <div className="time-info">
                            {/* <span className="timestamp">02:11:02</span> */}
                            <span
                              className={`expand-icon ${
                                expandedCards[8] ? "expanded" : ""
                              }`}
                              onClick={() => toggleCard(8)}
                            >
                              <img
                                src={iconChevron}
                                alt="toggle"
                                style={{ width: "14px", height: "8px" }}
                              />
                            </span>
                          </div>
                        </div>
                        {expandedCards[8] && (
                          <div className="content-divider"></div>
                        )}
                        {expandedCards[8] && (
                          <div className="card-content">
                            <p>
                              대학생들 AI랑 연습하며 발표점수 만점 받자 라는
                              서비스 컨셉으로 발표 점수 만큼은 A+받을 수 있도록
                              자연스럽고 전달력 있는 발표로 마무리 할 수 있도록
                              프레스가 도와드리고자 합니다.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="timeline-item" data-page="9">
                      <div className="timeline-node"></div>
                      <div className="thumbnail-box">
                        <div className="thumbnail-placeholder">PPT 썸네일</div>
                      </div>
                      <div className="feedback-card">
                        <div className="card-header">
                          <span className="page-number">9p</span>
                          <div className="time-info">
                            {/* <span className="timestamp">02:11:02</span> */}
                            <span
                              className={`expand-icon ${
                                expandedCards[9] ? "expanded" : ""
                              }`}
                              onClick={() => toggleCard(9)}
                            >
                              <img
                                src={iconChevron}
                                alt="toggle"
                                style={{ width: "14px", height: "8px" }}
                              />
                            </span>
                          </div>
                        </div>
                        {expandedCards[9] && (
                          <div className="content-divider"></div>
                        )}
                        {expandedCards[9] && (
                          <div className="card-content">
                            <p>
                              저희는 자동 대본 작성 발표 실전 훈련 피드백 기능을
                              제공합니다.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="timeline-item" data-page="10">
                      <div className="timeline-node"></div>
                      <div className="thumbnail-box">
                        <div className="thumbnail-placeholder">PPT 썸네일</div>
                      </div>
                      <div className="feedback-card">
                        <div className="card-header">
                          <span className="page-number">10p</span>
                          <div className="time-info">
                            {/* <span className="timestamp">02:11:02</span> */}
                            <span
                              className={`expand-icon ${
                                expandedCards[10] ? "expanded" : ""
                              }`}
                              onClick={() => toggleCard(10)}
                            >
                              <img
                                src={iconChevron}
                                alt="toggle"
                                style={{ width: "14px", height: "8px" }}
                              />
                            </span>
                          </div>
                        </div>
                        {expandedCards[10] && (
                          <div className="content-divider"></div>
                        )}
                        {expandedCards[10] && (
                          <div className="card-content">
                            <p>
                              사용자 피드백 평가로는 총 네 가지 항목을
                              측정하는데요 발화속도는 음절 개수를 합산해 분당
                              음절을 계산합니다 말의 망설임은 아 음 그와 같은
                              추임새를 필링 워드 데이터셋을 기반으로 측정하며
                              단어 간 사이 간격이나 말 사이의 공백도 함께
                              판단합니다. 말의 반복은 20초 단위로 동일한 단어가
                              3회 이상 반복될 시 판단하며 자주 반복될 수 밖에
                              없는 핵심어는 반복 감지 대상에서 제외하여 불필요한
                              피드백을 최소화합니다. 마지막으로 발표 스크립트와
                              STT를 대조하여 문장 유사도 및 핵심 키워드 포함률을
                              기반으로 발표 정확도를 측정합니다. 이어서 디자인
                              컨셉입니다. 키워드는 생동감과 투명함으로 맑고
                              투명한 푸른색 계열의 색상들을 통해 사용자에게
                              신뢰감 집중력을 제공합니다. 우측 상단은 대표 컬러
                              하단은 정돈된 산세리프체를 보여주는 타이포입니다.
                            </p>
                          </div>
                        )}
                        <div className="feedback-details">
                          <div className="feedback-tag">
                            <span className="tag-label">말의 추임새</span>
                            <span className="tag-count">아: 1회 음: 1회</span>
                          </div>
                          <div className="feedback-comment">
                            <p>
                              추임새가 들어간 부분이 있습니다. 발표 전에 내용을
                              다시 점검해보면 좋겠어요.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="timeline-item" data-page="11">
                      <div className="timeline-node"></div>
                      <div className="thumbnail-box">
                        <div className="thumbnail-placeholder">PPT 썸네일</div>
                      </div>
                      <div className="feedback-card">
                        <div className="card-header">
                          <span className="page-number">11p</span>
                          <div className="time-info">
                            {/* <span className="timestamp">02:11:02</span> */}
                            <span
                              className={`expand-icon ${
                                expandedCards[11] ? "expanded" : ""
                              }`}
                              onClick={() => toggleCard(11)}
                            >
                              <img
                                src={iconChevron}
                                alt="toggle"
                                style={{ width: "14px", height: "8px" }}
                              />
                            </span>
                          </div>
                        </div>
                        {expandedCards[11] && (
                          <div className="content-divider"></div>
                        )}
                        {expandedCards[11] && (
                          <div className="card-content">
                            <p>
                              이어서 디자인 컨셉입니다. 키워드는 생동감과
                              투명함으로 맑고 투명한 푸른색 계열의 색상들을 통해
                              사용자에게 신뢰감 집중력을 제공합니다. 우측 상단은
                              대표 컬러 하단은 정돈된 산세리프체를 보여주는
                              타이포입니다.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="timeline-item" data-page="12">
                      <div className="timeline-node"></div>
                      <div className="thumbnail-box">
                        <div className="thumbnail-placeholder">PPT 썸네일</div>
                      </div>
                      <div className="feedback-card">
                        <div className="card-header">
                          <span className="page-number">12p</span>
                          <div className="time-info">
                            {/* <span className="timestamp">02:11:02</span> */}
                            <span
                              className={`expand-icon ${
                                expandedCards[12] ? "expanded" : ""
                              }`}
                              onClick={() => toggleCard(12)}
                            >
                              <img
                                src={iconChevron}
                                alt="toggle"
                                style={{ width: "14px", height: "8px" }}
                              />
                            </span>
                          </div>
                        </div>
                        {expandedCards[12] && (
                          <div className="content-divider"></div>
                        )}
                        {expandedCards[12] && (
                          <div className="card-content">
                            <p>
                              {" "}
                              이어서 피쳐 플로우 및 프레스의 주요기능에 대해
                              설명 드리겠습니다. 첫 번째로 워크 스페이스
                              생성입니다. 홈 화면에서 클래스를 생성한 후 수업의
                              이름과 요일 시간을 작성합니다.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="timeline-item" data-page="13">
                      <div className="timeline-node"></div>
                      <div className="thumbnail-box">
                        <div className="thumbnail-placeholder">PPT 썸네일</div>
                      </div>
                      <div className="feedback-card">
                        <div className="card-header">
                          <span className="page-number">13p</span>
                          <div className="time-info">
                            {/* <span className="timestamp">02:11:02</span> */}
                            <span
                              className={`expand-icon ${
                                expandedCards[13] ? "expanded" : ""
                              }`}
                              onClick={() => toggleCard(13)}
                            >
                              <img
                                src={iconChevron}
                                alt="toggle"
                                style={{ width: "14px", height: "8px" }}
                              />
                            </span>
                          </div>
                        </div>
                        {expandedCards[13] && (
                          <div className="content-divider"></div>
                        )}
                        {expandedCards[13] && (
                          <div className="card-content">
                            <p>
                              {" "}
                              두 번째로 사용자의 발표 자료를 업로드합니다. 발표
                              예정일과 발표 알림 유무 발표 제한시간 발표자를
                              선택한 후 pdf 혹은 pptx 형식의 파일을 업로드
                              합니다.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="timeline-item" data-page="14">
                      <div className="timeline-node"></div>
                      <div className="thumbnail-box">
                        <div className="thumbnail-placeholder">PPT 썸네일</div>
                      </div>
                      <div className="feedback-card">
                        <div className="card-header">
                          <span className="page-number">14p</span>
                          <div className="time-info">
                            {/* <span className="timestamp">02:11:02</span> */}
                            <span
                              className={`expand-icon ${
                                expandedCards[14] ? "expanded" : ""
                              }`}
                              onClick={() => toggleCard(14)}
                            >
                              <img
                                src={iconChevron}
                                alt="toggle"
                                style={{ width: "14px", height: "8px" }}
                              />
                            </span>
                          </div>
                        </div>
                        {expandedCards[14] && (
                          <div className="content-divider"></div>
                        )}
                        {expandedCards[14] && (
                          <div className="card-content">
                            <p>
                              {" "}
                              업로드한 발표자료를 기반으로 발표 대본이 생성되어
                              스플릿 뷰로 제공됩니다. 대본은 수정 가능하여
                              부족한 내용이나 추가하고 싶은 내용을 입력할 수
                              있습니다. 또한 상황에 어울리는 비언어적 태그로
                              직관적이고 자연스러운 발표자의 행동 가이드를
                              제시합니다.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="timeline-item" data-page="15">
                      <div className="timeline-node"></div>
                      <div className="thumbnail-box">
                        <div className="thumbnail-placeholder">PPT 썸네일</div>
                      </div>
                      <div className="feedback-card">
                        <div className="card-header">
                          <span className="page-number">15p</span>
                          <div className="time-info">
                            {/* <span className="timestamp">02:11:02</span> */}
                            <span
                              className={`expand-icon ${
                                expandedCards[15] ? "expanded" : ""
                              }`}
                              onClick={() => toggleCard(15)}
                            >
                              <img
                                src={iconChevron}
                                alt="toggle"
                                style={{ width: "14px", height: "8px" }}
                              />
                            </span>
                          </div>
                        </div>
                        {expandedCards[15] && (
                          <div className="content-divider"></div>
                        )}
                        {expandedCards[15] && (
                          <div className="card-content">
                            <p>
                              {" "}
                              추가의견 기능을 통해 팀원들의 의견을 코멘트로 남길
                              수 있고 연습 진행 상황을 공유할 수 있습니다.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="timeline-item" data-page="16">
                      <div className="timeline-node"></div>
                      <div className="thumbnail-box">
                        <div className="thumbnail-placeholder">PPT 썸네일</div>
                      </div>
                      <div className="feedback-card">
                        <div className="card-header">
                          <span className="page-number">16p</span>
                          <div className="time-info">
                            {/* <span className="timestamp">02:11:02</span> */}
                            <span
                              className={`expand-icon ${
                                expandedCards[16] ? "expanded" : ""
                              }`}
                              onClick={() => toggleCard(16)}
                            >
                              <img
                                src={iconChevron}
                                alt="toggle"
                                style={{ width: "14px", height: "8px" }}
                              />
                            </span>
                          </div>
                        </div>
                        {expandedCards[16] && (
                          <div className="content-divider"></div>
                        )}
                        {expandedCards[16] && (
                          <div className="card-content">
                            <p>
                              {" "}
                              그 다음 연습 모드입니다. 방금 발표를 시작하기 전
                              홈 화면에서 보셨던 스플릿 뷰 우측 상단의 연습하기
                              버튼을 눌러 실제 발표 상황을 대비할 수 있는 환경을
                              제공합니다. 초반 워크스페이스 생성 시 설정했던
                              제한 시간에 맞춰 타이머가 제공되어 원하는 발표
                              길이에 맞출 수 있도록 유도합니다.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="timeline-item" data-page="17">
                      <div className="timeline-node"></div>
                      <div className="thumbnail-box">
                        <div className="thumbnail-placeholder">PPT 썸네일</div>
                      </div>
                      <div className="feedback-card">
                        <div className="card-header">
                          <span className="page-number">17p</span>
                          <div className="time-info">
                            {/* <span className="timestamp">02:11:02</span> */}
                            <span
                              className={`expand-icon ${
                                expandedCards[17] ? "expanded" : ""
                              }`}
                              onClick={() => toggleCard(17)}
                            >
                              <img
                                src={iconChevron}
                                alt="toggle"
                                style={{ width: "14px", height: "8px" }}
                              />
                            </span>
                          </div>
                        </div>
                        {expandedCards[17] && (
                          <div className="content-divider"></div>
                        )}
                        {expandedCards[17] && (
                          <div className="card-content">
                            <p>
                              {" "}
                              그리고 하단의 대본 큐카드 큐알을 제공하여 QR
                              코드를 통해 모바일 기기에서 발표 대본을 간편하게
                              확인할 수 있습니다.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="timeline-item" data-page="18">
                      <div className="timeline-node"></div>
                      <div className="thumbnail-box">
                        <div className="thumbnail-placeholder">PPT 썸네일</div>
                      </div>
                      <div className="feedback-card">
                        <div className="card-header">
                          <span className="page-number">18p</span>
                          <div className="time-info">
                            {/* <span className="timestamp">02:11:02</span> */}
                            <span
                              className={`expand-icon ${
                                expandedCards[18] ? "expanded" : ""
                              }`}
                              onClick={() => toggleCard(18)}
                            >
                              <img
                                src={iconChevron}
                                alt="toggle"
                                style={{ width: "14px", height: "8px" }}
                              />
                            </span>
                          </div>
                        </div>
                        {expandedCards[18] && (
                          <div className="content-divider"></div>
                        )}
                        {expandedCards[18] && (
                          <div className="card-content">
                            <p>
                              {" "}
                              연습 모드가 끝나면 질의 응답 여부를 선택할 수
                              있습니다. 발표 자료를 기반으로 예상 질문과 모범
                              답안을 생성하여 사용자는 해당 질문에 답변해 실제
                              발표 상황에 대비할 수 있습니다.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="timeline-item" data-page="19">
                      <div className="timeline-node"></div>
                      <div className="thumbnail-box">
                        <div className="thumbnail-placeholder">PPT 썸네일</div>
                      </div>
                      <div className="feedback-card">
                        <div className="card-header">
                          <span className="page-number">19p</span>
                          <div className="time-info">
                            {/* <span className="timestamp">02:11:02</span> */}
                            <span
                              className={`expand-icon ${
                                expandedCards[19] ? "expanded" : ""
                              }`}
                              onClick={() => toggleCard(19)}
                            >
                              <img
                                src={iconChevron}
                                alt="toggle"
                                style={{ width: "14px", height: "8px" }}
                              />
                            </span>
                          </div>
                        </div>
                        {expandedCards[19] && (
                          <div className="content-divider"></div>
                        )}
                        {expandedCards[19] && (
                          <div className="card-content">
                            <p>
                              {" "}
                              연습모드와 질의응답을 마친 후에는 사용자가
                              진행했던 발표를 측정하여 피드백을 제공합니다. 연습
                              모드와 질의응답에 대한 피드백을 각각 제공하며 총
                              네 가지 평가 항목과 종합 총평을 제시합니다.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="timeline-item" data-page="20">
                      <div className="timeline-node"></div>
                      <div className="thumbnail-box">
                        <div className="thumbnail-placeholder">PPT 썸네일</div>
                      </div>
                      <div className="feedback-card">
                        <div className="card-header">
                          <span className="page-number">20p</span>
                          <div className="time-info">
                            {/* <span className="timestamp">02:11:02</span> */}
                            <span
                              className={`expand-icon ${
                                expandedCards[20] ? "expanded" : ""
                              }`}
                              onClick={() => toggleCard(20)}
                            >
                              <img
                                src={iconChevron}
                                alt="toggle"
                                style={{ width: "14px", height: "8px" }}
                              />
                            </span>
                          </div>
                        </div>
                        {expandedCards[20] && (
                          <div className="content-divider"></div>
                        )}
                        {expandedCards[20] && (
                          <div className="card-content">
                            <p>
                              {" "}
                              연습 모드 시 사용자가 어 피피티를 넘기는 시간과
                              머무른 데이터를 기반으로 페이지마다 STT 데이터가
                              대조되어 축적되는데요 이를 통해 페이지 별 상세
                              피드백을 통해 점수가 부족한 항목과 발생 횟수 등
                              구체적인 피드백을 제공합니다.
                            </p>
                          </div>
                        )}
                        <div className="feedback-details">
                          <div className="feedback-tag">
                            <span className="tag-label">말의 추임새</span>
                            <span className="tag-count">어: 1회</span>
                          </div>
                          <div className="feedback-comment">
                            <p>
                              추임새가 들어간 부분이 있습니다. 발표 전에 내용을
                              다시 점검해보면 좋겠어요.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="timeline-item" data-page="21">
                      <div className="timeline-node"></div>
                      <div className="thumbnail-box">
                        <div className="thumbnail-placeholder">PPT 썸네일</div>
                      </div>
                      <div className="feedback-card">
                        <div className="card-header">
                          <span className="page-number">21p</span>
                          <div className="time-info">
                            {/* <span className="timestamp">02:11:02</span> */}
                            <span
                              className={`expand-icon ${
                                expandedCards[21] ? "expanded" : ""
                              }`}
                              onClick={() => toggleCard(21)}
                            >
                              <img
                                src={iconChevron}
                                alt="toggle"
                                style={{ width: "14px", height: "8px" }}
                              />
                            </span>
                          </div>
                        </div>
                        {expandedCards[21] && (
                          <div className="content-divider"></div>
                        )}
                        {expandedCards[21] && (
                          <div className="card-content">
                            <p>
                              {" "}
                              이상으로 프레젠테이션 발표를 마치며 시연을 마저
                              진행하겠습니다.{" "}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="qa-feedback">
                  <div className="qa-question">
                    <span className="question-prefix">Q.</span>
                    <p className="question-text">
                      타당성 분석에서는 1차 연구를 먼저 하고 나서 2차 연구도 꼭
                      해야 하나요? 두 방법은 순차적으로 진행되는 필수
                      관계인가요?
                    </p>
                  </div>

                  <div className="qa-user-answer">
                    <h3 className="answer-label">내가 한 답변</h3>
                    <div className="answer-box">
                      <p>
                        1차 연구와 2차 연구는 필수적인 순차 관계는 아니며,
                        상황과 목적에 따라 유연하게 선택하거나 병행할 수
                        있는데요, 일반적으로는 2차 연구를 먼저 해서 시장과 경쟁
                        상황을 파악하고, 그 후 1차 연구로 고객 반응을 구체적으로
                        확인하는 경우가 많습니다. 하지만 아이디어 검증을 위해
                        1차 연구를 먼저 하고, 이후 2차 연구로 데이터를 보완하는
                        방식도 가능합니다. 중요한 건 순서보다 목적에 맞게 분석
                        방법을 활용해 실질적인 의사결정에 도움을 주는 것입니다.
                      </p>
                    </div>
                  </div>

                  <div className="qa-recommended-answer">
                    <div
                      className="recommended-header"
                      onClick={() =>
                        setExpandedRecommendedAnswer(!expandedRecommendedAnswer)
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
                        <p>
                          1차 연구와 2차 연구는 반드시 순차적으로 진행할 필요는
                          없습니다. 상황과 목적에 따라 유연하게 선택하거나
                          병행할 수 있습니다. 일반적으로는 2차 연구를 통해
                          시장과 경쟁 상황을 파악한 뒤, 1차 연구로 고객의
                          구체적인 반응을 확인하는 방식을 사용합니다. 반대로
                          아이디어 검증이 우선일 경우 1차 연구를 먼저 수행하고,
                          이후 2차 연구로 데이터를 보완하기도 합니다. 핵심은
                          연구의 순서보다 목적에 맞는 방법을 활용해 실질적인
                          의사결정에 도움이 되도록 하는 것입니다.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="improvement-section">
                    <h3 className="improvement-title">
                      내 답변 개선점을 자세히 설명해드릴게요!
                    </h3>

                    <div className="improvement-card">
                      <h4 className="improvement-card-title">
                        1. 문장 구조의 명확화
                      </h4>
                      <div className="improvement-content">
                        <p className="improvement-description">
                          기존 문장은 한 문장 안에 여러 개념(순서, 목적, 예외,
                          핵심)이 한꺼번에 들어 있어서 읽는 사람이 중간에 문맥을
                          따라가기 어려웠어요.
                        </p>
                        <p className="improvement-description">
                          개선 문장은 문장을 짧게 나누어,
                        </p>
                        <ul className="improvement-list">
                          <li>• 원칙(순차 관계 X)</li>
                          <li>• 일반적인 흐름(2차 → 1차)</li>
                          <li>• 예외적 흐름(1차 → 2차)</li>
                          <li>• 핵심 요지(목적 중심 접근)</li>
                        </ul>
                        <p className="improvement-description">
                          ...으로 구조화했어요.
                        </p>
                        <div className="improvement-highlight">
                          <span className="highlight-icon">👉</span>
                          <span>
                            즉, "논리적 흐름이 명확한 문단 구조"로 바뀐 점이
                            개선 포인트예요.
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="improvement-card">
                      <h4 className="improvement-card-title">
                        2. 연결어와 리듬의 개선
                      </h4>
                      <div className="improvement-content">
                        <p className="improvement-description">
                          기존 문장은 쉼표와 접속부사("하지만", "그리고",
                          "그러나")가 많아서 리듬이 단조롭고 긴 문장처럼
                          느껴졌어요.
                        </p>
                        <p className="improvement-description">
                          개선된 문장은 문장을 끊고 문단 구분을 넣어서 가독성을
                          높였어요.
                        </p>
                        <div className="improvement-example">
                          <p className="example-label">예:</p>
                          <div className="example-content">
                            <p className="example-text">
                              "하지만 아이디어 검증을 위해 1차 연구를 먼저 하고,
                              이후 2차 연구로 데이터를 보완하는 방식도
                              가능합니다."
                            </p>
                            <span className="arrow-icon">→</span>
                            <p className="example-text">
                              "반대로 아이디어 검증이 우선일 경우 1차 연구를
                              먼저 수행하고, 이후 2차 연구로 데이터를 보완하기도
                              합니다."
                            </p>
                          </div>
                        </div>
                        <div className="improvement-highlight">
                          <span className="highlight-icon">👉</span>
                          <span>
                            문장이 좀 더 자연스럽고 구어체에 가까워져 '보고서'나
                            '발표용 원고'에 더 적합한 어조로 변했어요.
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="improvement-card">
                      <h4 className="improvement-card-title">
                        3. 핵심 메시지 강조
                      </h4>
                      <div className="improvement-content">
                        <p className="improvement-description">
                          기존 문장은 마지막 문장 "중요한 건 순서보다 목적에
                          맞게……"가 내용상 핵심이지만, 문단 내에서 시각적으로
                          묻혀 있었어요.
                        </p>
                        <p className="improvement-description">
                          개선 문장에서는 마지막 문장을 강조 구조(핵심은 ~이다)
                          로 만들어 핵심이 한눈에 들어오게 했어요.
                        </p>
                        <div className="improvement-highlight">
                          <span className="highlight-icon">👉</span>
                          <span>
                            "핵심은 연구의 순서보다 목적에 맞는 방법을 활용해
                            실질적인 의사결정에 도움이 되도록 하는 것"
                          </span>
                        </div>
                        <div className="improvement-result">
                          <span className="arrow-icon">→</span>
                          <span>마지막에 남는 메시지가 명확해졌어요.</span>
                        </div>
                      </div>
                    </div>
                  </div>
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
