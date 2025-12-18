import "../styles/Landing.css";

import { useNavigate } from "react-router-dom";
import LandingBg1 from "../assets/SVG_Landing/LandingBg1.svg";
import LandingBg2 from "../assets/SVG_Landing/LandingBg2.svg";
import LandingBg3 from "../assets/SVG_Landing/LandingBg3.svg";
import LandingBg4 from "../assets/SVG_Landing/LandingBg4.svg";
import LandingBg5 from "../assets/SVG_Landing/LandingBg5.svg";
import LandingBg6 from "../assets/SVG_Landing/LandingBg6.svg";
import LandingBg7 from "../assets/SVG_Landing/LandingBg7.svg";
import graphic1 from "../assets/SVG_Landing/graphic1.svg";
import graphic2 from "../assets/SVG_Landing/graphic2.svg";
import graphic3 from "../assets/SVG_Landing/graphic3.svg";
import pres_mainLogo from "../assets/SVG_Main/pres/logoss.svg";
import pres_textOnly from "../assets/SVG_Landing/pres_textOnly.svg";
import useFadeInOnScroll from "../hooks/useFadeInOnScroll";

const Landing = () => {
  const bg = (
    <>
      <img
        src={LandingBg1}
        style={{
          position: "absolute",
          left: 0,
          top: -80,
          zIndex: 1,
        }}
      />
      <img
        src={LandingBg2}
        style={{
          position: "absolute",
          left: 0,
          top: 117,
          zIndex: 2,
        }}
      />
      <img
        src={LandingBg3}
        style={{
          position: "absolute",
          left: 74,
          top: 501,
        }}
      />
      <img
        src={LandingBg4}
        style={{
          position: "absolute",
          right: -30,
          top: 76,
          transform: "rotate(5.919deg)",
        }}
      />
      <img
        src={LandingBg5}
        style={{
          position: "absolute",
          right: 51.8,
          top: -80,
        }}
      />
      <img
        src={LandingBg6}
        style={{
          position: "absolute",
          right: 43,
          top: 76,
        }}
      />
      <img
        src={LandingBg7}
        style={{
          position: "absolute",
          right: 35.4,
          top: 572,
        }}
      />
    </>
  );
  const nav = useNavigate();
  const sectionRef1 = useFadeInOnScroll();
  const sectionRef2 = useFadeInOnScroll();
  const sectionRef3 = useFadeInOnScroll();

  const markVisited = () => localStorage.setItem("pres_has_visited", "true");

  const goLogin = () => {
    markVisited();
    nav("/login");
  };

  const goStart = () => {
    markVisited();
    nav("/signup");
  };

  return (
    <div className="Landing">
      <header className="Landing__header">
        <div className="Landing__header-logo">
          <img src={pres_mainLogo} />
        </div>
        <div className="Landing__header-nav">
          <button className="Landing__header-login" onClick={goLogin}>
            로그인
          </button>
          <button className="Landing__header-start" onClick={goStart}>
            Pres. 사용 시작하기
          </button>
        </div>
      </header>

      <div className="LandingHero">
        <div className="Landing__bg">{bg}</div>
        <div className="LandingHero__content">
          <h1 className="LandingHero__title">Pres, 발표의 습관이 되다</h1>

          <p className="LandingHero__subtitle">
            연습부터 피드백까지, 혼자서도 완벽하게 연습하세요.
          </p>

          <div className="LandingHero__buttons">
            <button className="LandingHero__login" onClick={goLogin}>
              로그인
            </button>

            <button className="LandingHero__start" onClick={goStart}>
              Pres. 사용 시작하기
            </button>
          </div>
        </div>
      </div>
      <div className="LandingSection__container">
        <section className="LandingSection fade-section" ref={sectionRef1}>
          <div className="LandingText">
            <span className="LandingBadge">자동 대본 작성</span>
            <h2 className="LandingTitle">
              발표의 전달과 완성을 위한
              <br />
              연습 시간을 높일 수 있도록
            </h2>
            <p className="LandingDesc">
              발표 자료를 업로드 하면 수정 가능한
              <br />
              발표 대본을 자동 생성하여 제공해요.
            </p>
          </div>

          <div className="LandingGraphic">
            <img src={graphic1} alt="자동 대본 작성" />
          </div>
        </section>

        <section className="LandingSection fade-section" ref={sectionRef2}>
          <div className="LandingGraphic">
            <img src={graphic2} alt="실전 발표 훈련" />
          </div>

          <div className="LandingText">
            <span className="LandingBadge">발표 실전 훈련</span>
            <h2 className="LandingTitle">
              실전 발표 환경과
              <br />
              더욱 유사하게
            </h2>
            <p className="LandingDesc" style={{ textAlign: "right" }}>
              디바이스 분리로 모바일 대본을 제공하여 <br />
              실제 발표 환경에서도 활용할 수 있도록 해요.
              <br />
              연습모드를 통해 시간 측정을 측정하고
              <br />
              발표 후 질의응답까지 마무리하며
              <br />
              실제 발표처럼 연습하세요.
            </p>
          </div>
        </section>

        <section className="LandingSection fade-section" ref={sectionRef3}>
          <div className="LandingText">
            <span className="LandingBadge">피드백</span>
            <h2 className="LandingTitle">
              AI 피드백으로 부담없이
              <br />
              혼자서 연습
            </h2>
            <p className="LandingDesc">
              발표 전달력에 대한
              <br />
              AI의 정량적 피드백을 제공해요.
              <br />
              또, 팀원들이 대본 내용 확인하고
              <br />
              피드백할 수 있는 팀스페이스를 제공해요.
            </p>
          </div>

          <div className="LandingGraphic">
            <img src={graphic3} alt="AI 피드백" />
          </div>
        </section>
      </div>

      <div className="LandingBottom">
        <img src={pres_textOnly} alt="pres" className="LandingBottom__logo" />
        <div className="LandingBottom__text">
          <p>Pres. 소개</p>
          <p>이용약관 및 개인보호정책</p>
          <p>개인정보 보호 권한</p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
