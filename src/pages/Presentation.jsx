import { useParams } from "react-router-dom";
import "../styles/Presentation.css";
import { useEffect, useState, useRef } from "react";
import PresentationHeader from "../components/PresentationHeader";
import CueCard from "../components/CueCard";
import AvatarGroup from "../components/AvatarGroup";
import chevronDown from "../assets/SVG_Presentation/ChevronDown.svg";
import checkIcon from "../assets/SVG_Presentation/check.svg";
import useOutsideClick from "../hooks/useOutsideClick";
import TeamMemberListModal from "../components/TeamMemberListModal";
import LeftNav from "../components/LeftNav";
import CommentList from "../components/CommentList";
import PresSlideView from "../components/PresSlideView";
import { getProjectInfo } from "../api/projectApi";
import { getCueCards, getSavedQnA, getSlides } from "../api/fileApi";
import {
  getCheckStatus,
  getUncheckedMembers,
  toggleCueCheck,
  updateCueCardById,
} from "../api/cueApi";
import {
  createComment,
  createReply,
  deleteComment,
  getComments,
  updateComment,
} from "../api/commentApi";
import SlideOverviewModal from "../components/SlideOverviewModal";
import QuestionModal from "../components/QuestionModal";
import ExportModal from "../components/ExportModal";
import FeedbackModal from "../components/FeedbackModal";

const Presentation = () => {
  //pid: params.id
  const params = useParams();
  const [projectInfo, setProjectInfo] = useState(null);
  const [slides, setSlides] = useState([]);
  const [cueData, setCueData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  //actions
  const [isReviewOpen, setIsReviewOpen] = useState(false); //검토의견
  const [isNonverbal, setIsNonverbal] = useState(true); // 비언어적 표현
  const [isDeepMode, setIsDeepMode] = useState(false); // 심화버전

  //cue-card
  const [cueCards, setCueCards] = useState([]);

  //cue-card-review
  const [selectedCueId, setSelectedCueId] = useState(null);
  const [openMemberModal, setOpenMemberModal] = useState(null);
  const [checkedCues, setCheckedCues] = useState({});
  const [uncheckedMembers, setUncheckedMembers] = useState({}); //{ [cueId]: [] }

  //comment
  const [commentsBySlide, setCommentsBySlide] = useState({}); // { [slideIndex]: [comments] }

  //modal
  const [openedMenu, setOpenedMenu] = useState(null);
  const [qnaData, setQnaData] = useState(null);

  //초기 데이터 불러오기
  useEffect(() => {
    const fetchProject = async () => {
      try {
        //프로젝트 정보 불러오기
        const project = await getProjectInfo(params.id);
        setProjectInfo(project);

        if (project.fileIds && project.fileIds.length > 0) {
          const fileId = project.fileIds?.[0];
          if (!fileId) return;

          //슬라이드 불러오기
          const imageList = await getSlides(fileId);
          setSlides(imageList);

          //큐카드 불러오기
          const cueRes = await getCueCards(fileId);
          setCueData(cueRes);

          //체크 상태 불러오기
          const checkStatus = await getCheckStatus(fileId);
          const checked = {};
          checkStatus?.checkedCueIds?.forEach((id) => (checked[id] = true));
          setCheckedCues(checked);

          //예상질문 불러오기
          const qna = await getSavedQnA(fileId);
          setQnaData(qna);
        }
        console.log("프로젝트 정보:", project);
      } catch (err) {
        console.error("프로젝트 정보 불러오기 실패:", err);
      }
    };

    fetchProject();
  }, [params.id]);

  //비언어적표현, 검토의견 상태 저장
  const prevReviewRef = useRef(isReviewOpen);
  const prevNonverbalRef = useRef(isNonverbal);

  //슬라이드, 모드 별 큐카드 세팅
  useEffect(() => {
    if (!cueData || !cueData.slides?.length) return;
    const slideData = cueData.slides[currentIndex];
    if (!slideData) return;

    const data = isDeepMode ? slideData.advanced : slideData.basic;
    setCueCards(data);
  }, [cueData, currentIndex, isDeepMode]);

  //심화버전 on,off 시 상태저장
  useEffect(() => {
    if (isDeepMode) {
      prevReviewRef.current = isReviewOpen;
      prevNonverbalRef.current = isNonverbal;
      setIsReviewOpen(false);
      setIsNonverbal(false);
    } else {
      setIsReviewOpen(prevReviewRef.current);
      setIsNonverbal(prevNonverbalRef.current);
    }
  }, [isDeepMode]);

  //미확인 멤버 세팅
  useEffect(() => {
    const fetchUncheckedMembers = async () => {
      if (!cueCards.length) return;

      const allMembers = {};
      for (const card of cueCards) {
        try {
          const res = await getUncheckedMembers(card.cueId);
          const members = res?.cueCards?.[0]?.uncheckedMembers || [];
          allMembers[card.cueId] = members;
        } catch (err) {
          console.error(`큐카드 ${card.cueId} 미체크 멤버 조회 실패:`, err);
        }
      }
      setUncheckedMembers(allMembers);
    };

    fetchUncheckedMembers();
  }, [cueCards]);

  //슬라이드, 모드 변경 시 모달 닫기
  useEffect(() => {
    setOpenMemberModal(null);
  }, [currentIndex, isDeepMode]);

  useEffect(() => {
    setSelectedCueId(null);
  }, [currentIndex]);

  //슬라이드 변경 시 curIds로 코멘트 불러오기
  useEffect(() => {
    if (!cueData || !cueData.slides?.length) return;
    const currentSlide = cueData.slides[currentIndex];
    if (!currentSlide) return;

    //이미 캐싱된 슬라이드는 skip
    if (commentsBySlide[currentIndex]) return;

    const cueIds = currentSlide.basic.map((c) => c.cueId);

    const fetchCommentsForSlide = async () => {
      try {
        const res = await Promise.all(cueIds.map((id) => getComments(id)));
        console.log("코멘트 불러오기 성공:", res);

        const merged = res
          .map((item) =>
            item.comments.map((comment) => ({
              ...comment,
              cueId: item.cueId, // 응답에서 cueId 바로 사용
            }))
          )
          .flat();

        console.log(`${currentIndex}번 슬라이드 코멘트:`, merged);

        setCommentsBySlide((prev) => ({
          ...prev,
          [currentIndex]: merged,
        }));
        console.log("commentBySlide: ", commentsBySlide);
      } catch (err) {
        console.error("코멘트 불러오기 실패:", err);
      }
    };

    fetchCommentsForSlide();
  }, [cueData, currentIndex]);

  // 체크 토글 핸들러
  const handleCheckToggle = async (cueId) => {
    setCheckedCues((prev) => {
      const newChecked = !prev[cueId];

      toggleCueCheck(cueId, newChecked ? "on" : "off")
        .then(() =>
          getUncheckedMembers(cueId).then((res) => {
            const members = res?.cueCards?.[0]?.uncheckedMembers || [];
            setUncheckedMembers((prev) => ({ ...prev, [cueId]: members }));
          })
        )
        .catch((err) => console.error("큐카드 체크 토글 실패:", err));

      return { ...prev, [cueId]: newChecked };
    });
  };

  //큐카드 편집
  const handleCardChange = (cueId, newText) => {
    setCueCards((prev) =>
      prev.map((card) =>
        card.cueId === cueId ? { ...card, text: newText } : card
      )
    );
  };

  //큐카드 수정 저장
  const handleCardBlur = async (cueId, text) => {
    try {
      const card = cueCards.find((c) => c.cueId === cueId);
      if (!card) {
        console.warn(`cueId ${cueId}에 해당하는 큐카드를 찾을 수 없습니다.`);
        return;
      }

      const mode = isDeepMode ? "ADVANCED" : "BASIC";
      const updateRes = await updateCueCardById(card.cueId, mode, text);
      console.log("큐카드 저장 완료:", updateRes);

      setCueData((prev) => {
        if (!prev) return prev;

        const newSlides = [...prev.slides];
        const slide = newSlides[currentIndex];
        if (!slide) return prev;

        const targetList = isDeepMode ? slide.advanced : slide.basic;
        const updatedList = targetList.map((item) =>
          item.cueId === card.cueId ? { ...item, text } : item
        );

        if (isDeepMode) slide.advanced = updatedList;
        else slide.basic = updatedList;

        return { ...prev, slides: newSlides };
      });
    } catch (err) {
      console.error("큐카드 저장 실패:", err);
    }
  };

  //코멘트 작성
  const handleAddComment = async (cueId, content, location) => {
    try {
      const newComment = await createComment(cueId, content, location);
      setCommentsBySlide((prev) => ({
        ...prev,
        [currentIndex]: [...(prev[currentIndex] || []), newComment],
      }));
    } catch (err) {
      console.error("코멘트 생성 실패:", err);
    }
  };

  //답글 작성
  const handleAddReply = async (parentId, content) => {
    try {
      const newReply = await createReply(parentId, content, "");
      setCommentsBySlide((prev) => ({
        ...prev,
        [currentIndex]: prev[currentIndex].map((c) =>
          c.commentId === parentId
            ? { ...c, replies: [...(c.replies || []), newReply] }
            : c
        ),
      }));
    } catch (err) {
      console.error("답글 생성 실패: ", err);
    }
  };

  //코멘트 수정
  const handleUpdateComment = async (commentId, newContent, location) => {
    try {
      const updated = await updateComment(commentId, newContent, location);

      setCommentsBySlide((prev) => {
        const currentComments = prev[currentIndex] || [];

        const updated = currentComments.map((comment) => {
          //최상위 댓글 수정
          if (comment.commentId === commentId) {
            return { ...comment, content: newContent };
          }

          //답글 수정
          if (comment.replies?.some((r) => r.commentId === commentId)) {
            return {
              ...comment,
              replies: comment.replies.map((r) =>
                r.commentId === commentId ? { ...r, content: newContent } : r
              ),
            };
          }

          return comment;
        });

        return { ...prev, [currentIndex]: updated };
      });
    } catch (err) {
      console.error("코멘트 수정 실패:", err);
    }
  };

  //코멘트 삭제
  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      setCommentsBySlide((prev) => {
        const currentComments = prev[currentIndex] || [];

        //새 배열 생성
        const updated = currentComments
          .map((comment) => {
            //답글 삭제
            if (comment.replies?.some((r) => r.commentId === commentId)) {
              return {
                ...comment,
                replies: comment.replies.filter(
                  (r) => r.commentId !== commentId
                ),
              };
            }
            return comment;
          })
          .filter((comment) => comment.commentId !== commentId);

        return {
          ...prev,
          [currentIndex]: updated,
        };
      });
    } catch (err) {
      console.error("코멘트 삭제 실패:", err);
    }
  };

  useOutsideClick(".Presentation__cue-selection", () => setSelectedCueId(null));
  useOutsideClick(".Presentation__unchecked", () => setOpenMemberModal(null));

  if (!projectInfo) {
    return <div className="Presentation"></div>;
  }

  const {
    projectId,
    projectTitle,
    workspaceName,
    workspaceId,
    fileIds,
    latestSession,
  } = projectInfo;

  return (
    <div className="Presentation">
      <PresentationHeader
        id={projectId}
        workspaceId={workspaceId}
        workspaceName={workspaceName}
        title={projectTitle}
        mode="splitView"
      />
      <div className="Presentation__panel">
        <div className={`Presentation__left ${isReviewOpen ? "shrink" : ""}`}>
          <LeftNav openedMenu={openedMenu} setOpenedMenu={setOpenedMenu} />

          <div className="Presentation__slide">
            <PresSlideView
              slides={slides}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
            />
          </div>
        </div>

        <div
          className={`Presentation__rightCluster ${isReviewOpen ? "open" : ""}`}
        >
          <div className={"Presentation__right"}>
            {isReviewOpen ? (
              <span className="Presentation__checkbox-label">확인</span>
            ) : (
              ""
            )}
            <div
              className={`Presentation__cue-list ${
                isReviewOpen ? "review-mode" : ""
              }`}
            >
              {cueCards.map((card) => {
                return (
                  <div key={card.cueId} className="Presentation__cue-item">
                    {isReviewOpen ? (
                      <div>
                        <div
                          className={`Presentation__cue-selection ${
                            card.cueId === selectedCueId ? "selected" : ""
                          }`}
                          onClick={() =>
                            selectedCueId === card.cueId
                              ? setSelectedCueId(null)
                              : setSelectedCueId(card.cueId)
                          }
                        >
                          <div className="Presentation__review-cue">
                            <label className="Presentation__checkbox">
                              <input
                                type="checkbox"
                                checked={!!checkedCues[card.cueId]}
                                onChange={() => handleCheckToggle(card.cueId)}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </label>
                            <CueCard
                              cueId={card.cueId}
                              keyword={card.keyword}
                              value={card.text}
                              onChange={(text) =>
                                handleCardChange(card.cueId, text)
                              }
                              onBlur={(newText) =>
                                handleCardBlur(card.cueId, newText)
                              }
                              onAddComment={handleAddComment}
                              showNonverbal={isNonverbal}
                            />
                          </div>

                          {uncheckedMembers[card.cueId] !== undefined && (
                            <div className="Presentation__unchecked">
                              <span className="Presentation__unchecked-label">
                                확인 안 한 팀원
                              </span>

                              {uncheckedMembers[card.cueId] !== undefined &&
                              uncheckedMembers[card.cueId].length === 0 ? (
                                <div className="Presentation__all-checked">
                                  <img src={checkIcon} />
                                  모두 확인
                                </div>
                              ) : (
                                <div
                                  className="Presentation__unchecked-members"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openMemberModal === card.cueId
                                      ? setOpenMemberModal(null)
                                      : setOpenMemberModal(card.cueId);
                                  }}
                                  style={{ cursor: "pointer" }}
                                >
                                  <AvatarGroup
                                    members={uncheckedMembers[card.cueId] || []}
                                    spacing={8}
                                    border={false}
                                    max={2}
                                    showRemaining={false}
                                  />
                                  <img src={chevronDown} />
                                  {openMemberModal === card.cueId && (
                                    <TeamMemberListModal
                                      teamMembers={
                                        uncheckedMembers[card.cueId] || []
                                      }
                                      variant="pres"
                                    />
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <CueCard
                        cueId={card.cueId}
                        keyword={card.keyword}
                        value={card.text}
                        onChange={(text) =>
                          handleCardChange(card.section, text)
                        }
                        onBlur={(newText) =>
                          handleCardBlur(card.cueId, newText)
                        }
                        onAddComment={handleAddComment}
                        showNonverbal={isNonverbal}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {isReviewOpen && (
            <div className="Presentation__review">
              <h3>검토의견</h3>

              {(() => {
                const allComments = commentsBySlide[currentIndex] || [];

                // cueId가 같은 코멘트만 필터링
                const filteredComments =
                  selectedCueId === null
                    ? allComments
                    : allComments.filter(
                        (comment) => comment.cueId === selectedCueId
                      );

                return (
                  <CommentList
                    comments={filteredComments}
                    onAddReply={handleAddReply}
                    onDelete={handleDeleteComment}
                    onUpdate={handleUpdateComment}
                  />
                );
              })()}
            </div>
          )}

          <div className={"Presentation__floating-action"}>
            <div className="Presentation__version-toggle">
              <span>심화버전</span>
              <label className="Presentation__toggle-switch">
                <input
                  type="checkbox"
                  checked={isDeepMode}
                  onChange={() => setIsDeepMode(!isDeepMode)}
                />
                <span className="presentation__slider" />
              </label>
            </div>

            {!isDeepMode && (
              <div className={"Presentation__action-buttons"}>
                <button
                  className={`Presentation__btn-left ${
                    isNonverbal ? "active" : ""
                  }`}
                  onClick={() => setIsNonverbal(!isNonverbal)}
                >
                  <span className="Presentation__gradient-text">
                    비언어적 표현
                  </span>
                </button>
                <button
                  className={`Presentation__btn-right ${
                    isReviewOpen ? "active" : ""
                  }`}
                  onClick={() => setIsReviewOpen(!isReviewOpen)}
                >
                  <span className="Presentation__gradient-text">검토 의견</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 모달 렌더링 */}
      <SlideOverviewModal
        isOpen={openedMenu === "slides"}
        onClose={() => setOpenedMenu(null)}
        slides={slides}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      />
      <QuestionModal
        isOpen={openedMenu === "question"}
        onClose={() => setOpenedMenu(null)}
        qna={qnaData}
      />
      <ExportModal
        isOpen={openedMenu === "export"}
        onClose={() => setOpenedMenu(null)}
        projectTitle={projectTitle}
        fileId={fileIds?.[0]}
      />
      <FeedbackModal
        isOpen={openedMenu === "feedback"}
        onClose={() => setOpenedMenu(null)}
        sessionId={latestSession}
      />
    </div>
  );
};

export default Presentation;
