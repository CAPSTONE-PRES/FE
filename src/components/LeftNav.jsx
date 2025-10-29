import "../styles/LeftNav.css";
import allOpen from "../assets/SVG_Presentation/allOpen.svg";
import download from "../assets/SVG_Presentation/Download.svg";
import questionIcon from "../assets/SVG_Presentation/analyze.svg";
import presIcon from "../assets/SVG_Presentation/presIcon.svg";
import presIconOff from "../assets/SVG_Presentation/presIconOff.svg";
import helpIcon from "../assets/SVG_Presentation/caption 1.svg";
import { useState } from "react";

const LeftNav = () => {
  const [isHovered, setIsHovered] = useState(false);

  const navItems = [
    { id: 1, icon: allOpen, label: "전체보기" },
    { id: 2, icon: questionIcon, label: "예상질문" },
    { id: 3, icon: download, label: "다운로드" },
    { id: 4, icon: presIcon, label: "피드백보기" },
  ];

  return (
    <div
      className={`LeftNav ${isHovered ? "expanded" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="LeftNav__top">
        {navItems.map((item) => (
          <button key={item.id} className="LeftNav__item" title={item.label}>
            <img src={item.icon} />
            {isHovered && <span className="LeftNav__label">{item.label}</span>}
          </button>
        ))}
      </div>

      <div className="LeftNav__bottom">
        <button className="LeftNav__btn LeftNav__btn--help" title="도움말">
          <img src={helpIcon} />
        </button>
      </div>
    </div>
  );
};

export default LeftNav;
