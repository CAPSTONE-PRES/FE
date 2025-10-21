import { useLocation, useParams } from "react-router-dom";
import "../styles/Presentation.css";
import { useEffect, useState } from "react";
import PresentationHeader from "../components/PresentationHeader";
import CueCard from "../components/CueCard";
import AvatarGroup from "../components/AvatarGroup";
import chevronDown from "../assets/SVG_Presentation/ChevronDown.svg";
import useOutsideClick from "../hooks/useOutsideClick";
import TeamMemberListModal from "../components/TeamMemberListModal";
import LeftNav from "../components/LeftNav";

const Presentation = () => {
  //pid: params.id
  const params = useParams();
  const location = useLocation();
  const { name, title } = location.state;

  //actions
  const [isReviewOpen, setIsReviewOpen] = useState(false); //검토의견
  const [isNonverbal, setIsNonverbal] = useState(true); // 비언어적 표현
  const [isDeepMode, setIsDeepMode] = useState(false); // 심화버전

  const [prevStates, setPrevStates] = useState({
    reveiwOpen: false,
    nonverbal: true,
  });

  useEffect(() => {
    const slide = backendResponse.slides[0];

    if (isDeepMode) {
      setPrevStates({
        reveiwOpen: isReviewOpen,
        nonverbal: isNonverbal,
      });

      setIsReviewOpen(false);
      setIsNonverbal(false);

      // advanced 데이터가 있다면 교체
      setCueCards(
        slide.advanced.map((item) => ({
          section: item.section,
          keyword: item.keyword,
          text: item.text,
        }))
      );
    } else {
      setIsReviewOpen(prevStates.reveiwOpen);
      setIsNonverbal(prevStates.nonverbal);

      // 기본 데이터로 복원
      setCueCards(
        slide.basic.map((item) => ({
          section: item.section,
          keyword: item.keyword,
          text: item.text,
        }))
      );
    }
  }, [isDeepMode]);

  //cue-card
  const backendResponse = {
    fileId: 16,
    slides: [
      {
        slideNumber: 1,
        basic: [
          {
            section: 1,
            keyword: "인사말",
            text: "안녕하세요. 오늘은 '타겟 및 비즈니스 모델'에 대해 발표하겠습니다. <🌬 호흡>이번 발표에서는 카페 사장님과 20대 카공족을 대상으로 한 전략을 설명드리겠습니다. <🔍 청중 바라보기>",
          },
          {
            section: 2,
            keyword: "타겟 고객",
            text: "우리의 주요 타겟은 장시간 이용 고객 관리가 필요한 카페 사장님과, 눈치 보지 않고 카페를 이용하고 싶은 20대 카공족입니다. <👉 화면 가리키기> 이 두 그룹의 요구를 충족시키기 위해 맞춤형 서비스를 제공할 것입니다. <🌬 호흡>",
          },
          {
            section: 3,
            keyword: "초기 유저 모으기 전략",
            text: "초기 유저를 모으기 위해 카공 가능한 카페 정보 및 예약 시스템을 제공할 계획입니다. <✋ 제스처> 카페 이용료는 1인 시간당 1000원으로 설정하고, 서비스 이용 시 수수료 10%를 부과할 것입니다. <👉 화면 가리키기>",
          },
          {
            section: 4,
            keyword: "경영 전략",
            text: "또한, 청년 사업 비용을 지원하기 위해 월별 카페 이용료와 청년 Office 구독권 패키지를 제공할 예정입니다. <🔍 청중 바라보기> 제휴 카페와의 매칭 및 무료 이용권을 통해 청년들에게 실질적인 혜택을 제공할 것입니다. <🌬 호흡>",
          },
          {
            section: 5,
            keyword: "매출 전략",
            text: "이제 이러한 전략들이 어떻게 매출로 이어질 수 있는지에 대해 설명드리겠습니다. <📄 발표자료 보기>",
          },
        ],
        advanced: [
          {
            section: 1,
            keyword: "매출 전략",
            text: "타겟 고객을 정의하고 비즈니스 모델을 통해 매출 전략을 설명하는 발표.",
          },
          {
            section: 2,
            keyword: "매출 전략",
            text: "타겟 고객을 정의하고 비즈니스 모델을 통해 매출 전략을 설명하는 발표.",
          },
        ],
        qrSlug: "f9aacd893f65",
        qrUrl: "https://pres.app/cuecard/f9aacd893f65",
      },
    ],
    errors: {},
  };

  const [cueCards, setCueCards] = useState(
    backendResponse.slides[0].basic.map((item) => ({
      section: item.section,
      keyword: item.keyword,
      text: item.text,
    }))
  );

  //cue-card-review
  const [selectedSection, setSelectedSection] = useState(null);
  const [openMemberModal, setOpenMemberModal] = useState(null);
  const [isChecked, setIsChecked] = useState(false);

  useOutsideClick(".Presentation__cue-selection", () =>
    setSelectedSection(null)
  );
  useOutsideClick(".Presentation__unchecked", () => setOpenMemberModal(null));

  const handleCardChange = (section, newText) => {
    setCueCards((prev) =>
      prev.map((card) =>
        card.section === section ? { ...card, text: newText } : card
      )
    );
  };

  const uncheckedMembers = [
    {
      id: "u3",
      name: "이호성",
      avatar: "/avatars/user3.svg",
      email: "333@gmail.com",
    },
    {
      id: "u4",
      name: "김소영",
      avatar: "/avatars/user4.svg",
      email: "444@gmail.com",
    },
    {
      id: "u5",
      name: "김현서",
      avatar: "/avatars/user1.svg",
      email: "555@gmail.com",
    },
  ];

  return (
    <div className="Presentation">
      <PresentationHeader id={params.id} name={name} title={title} />
      <div className="Presentation__panel">
        <div className={`Presentation__left ${isReviewOpen ? "shrink" : ""}`}>
          <div className="Presentation__left-nav">
            <LeftNav />
          </div>
          <div></div>
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
              {cueCards.map((card) => (
                <div key={card.section} className="Presentation__cue-item">
                  {isReviewOpen ? (
                    <div>
                      <div
                        className={`Presentation__cue-selection ${
                          card.section === selectedSection ? "selected" : ""
                        }`}
                        onClick={() => setSelectedSection(card.section)}
                      >
                        <div className="Presentation__review-cue">
                          <label className="Presentation__checkbox">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                setIsChecked(e.target.checked);
                              }}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </label>
                          <CueCard
                            keyword={card.keyword}
                            value={card.text}
                            onChange={(text) =>
                              handleCardChange(card.section, text)
                            }
                            showNonverbal={isNonverbal}
                          />
                        </div>

                        <div className="Presentation__unchecked">
                          <span className="Presentation__unchecked-label">
                            확인 안 한 팀원
                          </span>
                          <AvatarGroup
                            members={uncheckedMembers}
                            spacing={8}
                            border={false}
                            max={2}
                            showRemaining={false}
                          />
                          <img
                            src={chevronDown}
                            onClick={(e) => {
                              e.stopPropagation();
                              openMemberModal
                                ? setOpenMemberModal(null)
                                : setOpenMemberModal(card.section);
                            }}
                            style={{ cursor: "pointer" }}
                          />
                          {openMemberModal === card.section && (
                            <TeamMemberListModal
                              teamMembers={uncheckedMembers}
                              variant="pres"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <CueCard
                      keyword={card.keyword}
                      value={card.text}
                      onChange={(text) => handleCardChange(card.section, text)}
                      showNonverbal={isNonverbal}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {isReviewOpen && <div className="Presentation__review">review</div>}

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

            <div className={"Presentation__action-buttons"}>
              <button
                className={`Presentation__btn-left ${
                  isNonverbal ? "active" : ""
                }`}
                disabled={isDeepMode}
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
                disabled={isDeepMode}
                onClick={() => setIsReviewOpen(!isReviewOpen)}
              >
                <span className="Presentation__gradient-text">검토 의견</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Presentation;
