import "../styles/LeftNav.css";
import allOpen from "../assets/SVG_Presentation/allOpen.svg";
import exportIcon from "../assets/SVG_Presentation/Export.svg";
import questionIcon from "../assets/SVG_Presentation/analyze.svg";
import presIcon from "../assets/SVG_Presentation/presIcon.svg";
import presIconOff from "../assets/SVG_Presentation/presIconOff.svg";
import helpIcon from "../assets/SVG_Presentation/caption 1.svg";
import { useState } from "react";

const LeftNav = ({ openedMenu, setOpenedMenu }) => {
  const [isHovered, setIsHovered] = useState(false);

  const navItems = [
    {
      id: 1,
      icon: allOpen,
      label: "전체보기",
      onClick: () => setOpenedMenu("slides"),
    },
    {
      id: 2,
      icon: questionIcon,
      label: "예상질문",
      onClick: () => setOpenedMenu("question"),
    },
    {
      id: 3,
      icon: exportIcon,
      label: "다운로드",
      onClick: () => setOpenedMenu("export"),
    },
    {
      id: 4,
      icon: presIconOff, //비활성화
      label: "피드백보기",
      onClick: () => setOpenedMenu("feedback"),
    },
  ];

  return (
    <div
      className={`LeftNav ${isHovered ? "expanded" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="LeftNav__top">
        {navItems.map((item) => (
          <button
            key={item.id}
            className="LeftNav__item"
            title={item.label}
            onClick={item.onClick}
            disabled={item.id === 4}
          >
            <img src={item.icon} />
            {isHovered && (
              <span
                className={`LeftNav__labe ${item.id === 4 ? "disabled" : ""}`}
              >
                {item.label}
              </span>
            )}
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
