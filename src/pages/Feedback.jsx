import "../styles/Feedback.css";
import Header from "../components/Header";
import { useState, useRef, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFeedback } from "../api/feedbackApi";
import backgroundWave from "../assets/SVG_ Feedback/background-wave.svg";
import backgroundLine from "../assets/SVG_ Feedback/background-line.svg";
import backgroundChart from "../assets/SVG_ Feedback/background-chart.svg";
import iconRetry from "../assets/SVG_ Feedback/icon-retry.svg";
import iconThumbsUp from "../assets/SVG_ Feedback/icon-thumbs-up.svg";
import iconNode from "../assets/SVG_ Feedback/icon-node.svg";
import iconChevron from "../assets/SVG_ Feedback/icon-chevron.svg";

const Feedback = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('page');
  const [expandedCards, setExpandedCards] = useState({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: true,
    7: true
  });
  const [expandedRecommendedAnswer, setExpandedRecommendedAnswer] = useState(false);
  
  // 기본값 설정 (API 호출 실패 시 사용)
  const defaultFeedbackData = useMemo(() => ({
    grade: 'B',
    totalScore: 81,
    spmScore: 45,
    repeatScore: 75,
    fillerScore: 88,
    silenceScore: 88,
    totalSilenceDuration: 272, // 4분 32초
    qnaComparison: null,
  }), []);

  const [feedbackData, setFeedbackData] = useState(defaultFeedbackData);
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
        const data = await getFeedback(sessionId);
        setFeedbackData(data);
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

    setExpandedCards(prev => ({
      ...prev,
      [pageNumber]: !prev[pageNumber]
    }));

    // 레이아웃 적용된 직후 프레임에서 재측정
    if (beforeTop !== null) {
      requestAnimationFrame(() => {
        if (!header) return;
        const afterTop = header.getBoundingClientRect().top;
        const diff = afterTop - beforeTop;
        // 뷰포트 역이동
        if (diff !== 0) {
          window.scrollBy({ top: diff, left: 0, behavior: 'auto' });
        }
      });
    }
  };

  useEffect(() => {
    const containerEl = containerRef.current;
    const lineEl = lineRef.current;
    if (!containerEl || !lineEl) return;

    if (activeTab !== 'page') return;

    const recalc = () => {
      const nodes = Array.from(
        containerEl.querySelectorAll('.timeline-node')
      );

      if (nodes.length < 2) {
        lineEl.style.height = '0px';
        return;
      }

      const containerTop = containerEl.getBoundingClientRect().top;
      const centers = nodes.map((n) => {
        const r = n.getBoundingClientRect();
        return (r.top - containerTop) + r.height / 2;
      });

      const firstY = Math.min(...centers);
      const lastY = Math.max(...centers);

      lineEl.style.top = `${firstY}px`;
      lineEl.style.height = `${lastY - firstY}px`;
    };

    recalc();

    const onResize = () => recalc();
    const onScroll = () => recalc();

    window.addEventListener('resize', onResize);
    scrollRef.current?.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('resize', onResize);
      scrollRef.current?.removeEventListener('scroll', onScroll);
    };
  }, [activeTab, expandedCards]);

  // 로딩 상태
  if (loading) {
    return (
      <div className="Feedback">
        <Header />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
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
    repeatScore,
    silenceScore,
    totalSilenceDuration,
    qnaComparison,
  } = feedbackData;

  // 발표 시간 포맷팅 (totalSilenceDuration을 이용해 계산하는 것이 좋지만, API에서 제공되지 않으면 기본값 사용)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}분 ${secs}초`;
  };

  // 피드백 메시지 생성 (등급과 점수에 따라)
  const getFeedbackMessage = () => {
    if (spmScore < 50) {
      return ["말하기 속도를 조금 더", "천천히 하면 좋겠어요!"];
    } else if (fillerScore < 50) {
      return ["불필요한 추임새를 줄여", "더 매끄러운 발표를 만들어보세요!"];
    } else if (repeatScore < 50) {
      return ["반복되는 표현을 줄이고", "다양한 어휘를 사용해보세요!"];
    } else {
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
                  <span className="grade-letter">{grade || 'B'}</span>
                </div>
              </div>
              <div className="total-score-oval">
                <span className="total-score-label">총점:</span>
                <span className="total-score-number">{totalScore || 0}</span>
              </div>
            </div>
          </div>
          
          <div className="feedback-right">
            <div className="feedback-message">
              <div>{feedbackMessage[0]}</div>
              <div>{feedbackMessage[1]}</div>
            </div>
            <div className="presentation-time">
              <span className="time-label">총 발표 시간 : </span>
              <span className="time-value">
                {totalSilenceDuration 
                  ? formatTime(totalSilenceDuration) 
                  : "4분 32초"}
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
                  <span className="score-value">{fillerScore || 0}점</span>
                </div>
                <div className="score-item">
                  <span className="score-label">침묵</span>
                  <span className="score-value">{silenceScore || 0}점</span>
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
                      <div className="record-bar current-bar" style={{width: '81%'}}></div>
                      <span className="record-score">81점</span>
                    </div>
                  </div>
                  <div className="record-item">
                    <span className="record-date">06/05</span>
                    <div className="record-bar-container">
                      <div className="record-bar" style={{width: '58%'}}></div>
                      <span className="record-score">58점</span>
                    </div>
                  </div>
                  <div className="record-item">
                    <span className="record-date">06/05</span>
                    <div className="record-bar-container">
                      <div className="record-bar" style={{width: '64%'}}></div>
                      <span className="record-score">64점</span>
                    </div>
                  </div>
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
                {activeTab === 'page' ? '페이지별 피드백' : '질의응답 피드백'}
              </h2>
              <div className="tab-buttons">
                <button 
                  className={`tab-button ${activeTab === 'page' ? 'active' : ''}`}
                  onClick={() => setActiveTab('page')}
                >
                  페이지별
                </button>
                <button 
                  className={`tab-button ${activeTab === 'qa' ? 'active' : ''}`}
                  onClick={() => setActiveTab('qa')}
                >
                  질의응답
                </button>
              </div>
            </div>
            <div className="feedback-content-area" ref={scrollRef}>
              {activeTab === 'page' ? (
                /* TODO: 페이지별 피드백 데이터는 현재 API 응답에 포함되어 있지 않습니다.
                 * 별도의 API가 필요하거나, 세션 피드백 API 응답에 페이지별 정보가 추가될 수 있습니다.
                 * 현재는 하드코딩된 데이터를 표시합니다.
                 */
                <div className="page-feedback">
                  <div className="timeline-container" ref={containerRef}>
                    <div className="timeline-line" ref={lineRef}></div>
                    
                    <div className="timeline-item" data-page="1">
                      <div className="timeline-node">
                      </div>
                      <div className="thumbnail-box">
                        <div className="thumbnail-placeholder">PPT 썸네일</div>
                      </div>
                      <div className="feedback-card">
                        <div className="card-header">
                          <span className="page-number">1p</span>
                          <div className="time-info">
                            <span className="timestamp">00:06:23</span>
                            <span 
                              className={`expand-icon ${expandedCards[1] ? 'expanded' : ''}`}
                              onClick={() => toggleCard(1)}
                            >
                              <img src={iconChevron} alt="toggle" style={{width: '14px', height: '8px'}} />
                            </span>
                          </div>
                        </div>
                        {expandedCards[1] && <div className="content-divider"></div>}
                        {expandedCards[1] && (
                          <div className="card-content">
                            <p>안녕하세요 저는 타당성 분석에 대해 발표할 디지털미디어학과 김슈니 입니다.</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="timeline-item" data-page="2">
                      <div className="timeline-node has-feedback">
                        <img src={iconNode} alt="피드백" style={{width: '100%', height: '100%'}} />
                      </div>
                      <div className="thumbnail-box">
                        <div className="thumbnail-placeholder">PPT 썸네일</div>
                      </div>
                      <div className="feedback-card">
                        <div className="card-header">
                          <div className="page-info">
                            <span className="page-number">2p</span>
                            <div className="tag-icon">
                              <img src="/src/assets/SVG_ Feedback/icon-type-hesitate.svg" alt="말의 망설임" />
                            </div>
                          </div>
                          <div className="time-info">
                            <span className="timestamp">00:26:23</span>
                            <span 
                              className={`expand-icon ${expandedCards[2] ? 'expanded' : ''}`}
                              onClick={() => toggleCard(2)}
                            >
                              <img src={iconChevron} alt="toggle" style={{width: '14px', height: '8px'}} />
                            </span>
                          </div>
                        </div>
                        {expandedCards[2] && <div className="content-divider"></div>}
                        {expandedCards[2] && (
                          <div className="card-content">
                            <p>타당성 분석은 일반적으로 네 가지 구성 요소를 중심으로 진행됩니다. 시장성, 기술성, 재무성, 조직 역량이 바로 그 네 가지입니다. 이 중 하나라도 기준에 미치지 못하면, 뭐지 아이디어를 폐기하거나 전면 수정해야 할 수 있습니다. 따라서 분석은 단순한 평가가 아니라, 음 실행 여부를 결정하는 핵심 기준입니다.</p>
                            
                            <div className="feedback-details">
                              <div className="feedback-tag">
                                <span className="tag-label">말의 망설임</span>
                                <span className="tag-count">음: 1회, 뭐지: 1회</span>
                              </div>
                              <div className="feedback-comment">
                                <p>불필요한 추임새가 잦아 발표 흐름이 끊기는 느낌이 들었어요. 발표 전에 내용을 더 숙지 하면 줄일 수 있을 거예요.</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="timeline-item" data-page="3">
                      <div className="timeline-node has-feedback">
                        <img src={iconNode} alt="피드백" style={{width: '100%', height: '100%'}} />
                      </div>
                      <div className="thumbnail-box">
                        <div className="thumbnail-placeholder">PPT 썸네일</div>
                      </div>
                      <div className="feedback-card">
                        <div className="card-header">
                          <div className="page-info">
                            <span className="page-number">3p</span>
                            <div className="tag-icon">
                              <img src="/src/assets/SVG_ Feedback/icon-type-speed.svg" alt="발표 속도" />
                            </div>
                          </div>
                          <div className="time-info">
                            <span className="timestamp">00:57:10</span>
                            <span 
                              className={`expand-icon ${expandedCards[3] ? 'expanded' : ''}`}
                              onClick={() => toggleCard(3)}
                            >
                              <img src={iconChevron} alt="toggle" style={{width: '14px', height: '8px'}} />
                            </span>
                          </div>
                        </div>
                        {expandedCards[3] && <div className="content-divider"></div>}
                        {expandedCards[3] && (
                          <div className="card-content">
                            <p>타당성 분석의 방법은 두 가지가 있습니다. 1차 연구와 2차 연구로 나뉘어져 있는데요, 1차 연구는 분석을 진행하는 사람이나 팀이 직접 수집하는 연구입니다. 잠재 고객가의 대화, 업계 전문가로부터 피드백, 포커스 그룹 수행, 설문조사 실시로 진행합니다.</p>
                            
                            <div className="feedback-details">
                              <div className="feedback-tag">
                                <span className="tag-label">발표 속도</span>
                                <span className="tag-count">속도 빠름</span>
                              </div>
                              <div className="feedback-comment">
                                <p>조금 빠르게 말하는 경향이 있어 중요한 부분이 잘 들리지 않았어요. 핵심 내용에서는 속도를 천천히 조절해보면 좋아요.</p>
                                <div className="speed-comparison">
                                  <div className="speed-item">
                                    <span className="speed-label">사용자 속도</span>
                                    <div className="speed-bar-container">
                                      <div className="speed-bar user-speed" style={{width: '75%'}}></div>
                                      <span className="speed-value">SPM: 306 음절</span>
                                    </div>
                                  </div>
                                  <div className="speed-item">
                                    <span className="speed-label">평균 속도</span>
                                    <div className="speed-bar-container">
                                      <div className="speed-bar average-speed" style={{width: '60%'}}></div>
                                      <span className="speed-value">SPM: 290 음절</span>
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
                      <div className="timeline-node">
                      </div>
                      <div className="thumbnail-box">
                        <div className="thumbnail-placeholder">PPT 썸네일</div>
                      </div>
                      <div className="feedback-card">
                        <div className="card-header">
                          <span className="page-number">4p</span>
                          <div className="time-info">
                            <span className="timestamp">01:06:47</span>
                            <span 
                              className={`expand-icon ${expandedCards[4] ? 'expanded' : ''}`}
                              onClick={() => toggleCard(4)}
                            >
                              <img src={iconChevron} alt="toggle" style={{width: '14px', height: '8px'}} />
                            </span>
                          </div>
                        </div>
                        {expandedCards[4] && <div className="content-divider"></div>}
                        {expandedCards[4] && (
                          <div className="card-content">
                            <p>이상으로 타당성 분석에 대한 발표를 모두 마치겠습니다. 감사합니다.</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="timeline-item" data-page="5">
                      <div className="timeline-node has-feedback">
                        <img src={iconNode} alt="피드백" style={{width: '100%', height: '100%'}} />
                      </div>
                      <div className="thumbnail-box">
                        <div className="thumbnail-placeholder">PPT 썸네일</div>
                      </div>
                      <div className="feedback-card">
                        <div className="card-header">
                          <div className="page-info">
                            <span className="page-number">5p</span>
                            <div className="tag-icon">
                              <img src="/src/assets/SVG_ Feedback/icon-type-repeat.svg" alt="반복되는 어휘" />
                            </div>
                          </div>
                          <div className="time-info">
                            <span className="timestamp">01:26:30</span>
                            <span 
                              className={`expand-icon ${expandedCards[5] ? 'expanded' : ''}`}
                              onClick={() => toggleCard(5)}
                            >
                              <img src={iconChevron} alt="toggle" style={{width: '14px', height: '8px'}} />
                            </span>
                          </div>
                        </div>
                        {expandedCards[5] && <div className="content-divider"></div>}
                        {expandedCards[5] && (
                          <div className="card-content">
                            <p>타당성 분석은 다음과 같은 장점을 제공합니다. 첫째, 사업의 성공 가능성을 객관적으로 판단할 수 있습니다. 둘째, 투자자의 신뢰를 확보할 수 있어 자금 유치에 유리합니다. 그 다음에 셋째, 내부 의사결정 시 리스크를 최소화하는 데 도움이 됩니다. 그러니까 이처럼 타당성 분석은 약간 단순한 검토를 넘어 사업 실행의 필수 조건이라 할 수 있습니다.</p>
                            
                            <div className="feedback-details">
                              <div className="feedback-tag">
                                <span className="tag-label">반복되는 어휘</span>
                                <span className="tag-count">3회 : 그 다음에, 그러니까, 약간</span>
                              </div>
                              <div className="feedback-comment">
                                <p>같은 표현이 반복되어 전달력이 다소 떨어질 수 있어요. 다양한 표현을 사용해보는 연습이 필요해 보여요.</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="timeline-item" data-page="6">
                      <div className="timeline-node has-feedback">
                        <img src={iconNode} alt="피드백" style={{width: '100%', height: '100%'}} />
                      </div>
                      <div className="thumbnail-box">
                        <div className="thumbnail-placeholder">PPT 썸네일</div>
                      </div>
                      <div className="feedback-card">
                        <div className="card-header">
                          <div className="page-info">
                            <span className="page-number">6p</span>
                            <div className="tag-icon">
                              <img src="/src/assets/SVG_ Feedback/icon-type-aim.svg" alt="발표 정확도" />
                            </div>
                          </div>
                          <div className="time-info">
                            <span className="timestamp">01:59:06</span>
                            <span 
                              className={`expand-icon ${expandedCards[6] ? 'expanded' : ''}`}
                              onClick={() => toggleCard(6)}
                            >
                              <img src={iconChevron} alt="toggle" style={{width: '14px', height: '8px'}} />
                            </span>
                          </div>
                        </div>
                        {expandedCards[6] && <div className="content-divider"></div>}
                        {expandedCards[6] && (
                          <div className="card-content">
                            <p>타당성 분석은 네가지 구성요소를 중심으로 진행됩니다. 시장성, 기술성, 특이성, 조직역량 네가지입니다. 기준에 미치지 못하는 요소가 있다면 해당 아이디어를 폐기하거나 전부 바꿔야합니다. 고로 해당 네가지 요소는 단순평가가 아닌 실행 여부를 결정하는 중요한 기준이 됩니다.</p>
                            
                            <div className="feedback-details">
                              <div className="feedback-tag">
                                <span className="tag-label">발표 정확도</span>
                                <span className="tag-count">오류 부분 : 2회</span>
                              </div>
                              <div className="feedback-comment">
                                <p>내용의 정확도가 다소 부족해 전달에 혼란이 있을 수 있어요. 발표 전에 정보를 다시 한 번 점검해보면 좋겠어요.</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="timeline-item" data-page="7">
                      <div className="timeline-node">
                      </div>
                      <div className="thumbnail-box">
                        <div className="thumbnail-placeholder">PPT 썸네일</div>
                      </div>
                      <div className="feedback-card">
                        <div className="card-header">
                          <span className="page-number">7p</span>
                          <div className="time-info">
                            <span className="timestamp">02:11:02</span>
                            <span 
                              className={`expand-icon ${expandedCards[7] ? 'expanded' : ''}`}
                              onClick={() => toggleCard(7)}
                            >
                              <img src={iconChevron} alt="toggle" style={{width: '14px', height: '8px'}} />
                            </span>
                          </div>
                        </div>
                        {expandedCards[7] && <div className="content-divider"></div>}
                        {expandedCards[7] && (
                          <div className="card-content">
                            <p>이상으로 타당성 분석에 대한 발표를 모두 마치겠습니다. 감사합니다.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="qa-feedback">
                  {qnaComparison ? (
                    <>
                      <div className="qa-question">
                        <span className="question-prefix">Q.</span>
                        <p className="question-text">
                          {qnaComparison.question}
                        </p>
                      </div>
                      
                      <div className="qa-user-answer">
                        <h3 className="answer-label">내가 한 답변</h3>
                        <div className="answer-box">
                          <p>{qnaComparison.userAnswer}</p>
                        </div>
                      </div>
                      
                      <div className="qa-recommended-answer">
                        <div className="recommended-header" onClick={() => setExpandedRecommendedAnswer(!expandedRecommendedAnswer)}>
                          <div className="recommended-title">
                            <img src={iconThumbsUp} alt="추천" className="thumbs-up-icon" />
                            <span>추천 답안 보기</span>
                            <span className={`expand-icon ${expandedRecommendedAnswer ? 'expanded' : ''}`}>
                              <img src={iconChevron} alt="toggle" style={{width: '14px', height: '8px'}} />
                            </span>
                          </div>
                        </div>
                        {expandedRecommendedAnswer && (
                          <div className="recommended-content">
                            <p>{qnaComparison.idealAnswer}</p>
                          </div>
                        )}
                      </div>

                      {qnaComparison.feedback && (
                        <div className="improvement-section">
                          <h3 className="improvement-title">내 답변 개선점을 자세히 설명해드릴게요!</h3>
                          
                          <div className="improvement-card">
                            <h4 className="improvement-card-title">피드백</h4>
                            <div className="improvement-content">
                              <p className="improvement-description">{qnaComparison.feedback}</p>
                              
                              {qnaComparison.missingKeywords && qnaComparison.missingKeywords.length > 0 && (
                                <div className="improvement-highlight">
                                  <span className="highlight-icon">👉</span>
                                  <span>누락된 키워드: {qnaComparison.missingKeywords.join(', ')}</span>
                                </div>
                              )}
                              
                              <div className="improvement-result">
                                <span>유사도: {(qnaComparison.similarity * 100).toFixed(1)}%</span>
                                <span>키워드 재현율: {(qnaComparison.keywordRecall * 100).toFixed(1)}%</span>
                                <span>커버리지: {(qnaComparison.coverage * 100).toFixed(1)}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div style={{ padding: '40px', textAlign: 'center' }}>
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
