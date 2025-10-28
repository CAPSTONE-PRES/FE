import "../styles/PresentationHeader.css";
import logo from "../assets/SVG_Presentation/presColor.svg";
import playIcon from "../assets/SVG_Presentation/play.svg";
import separator from "../assets/SVG_Presentation/chevron-right.svg";
import { useContext } from "react";
import { DataContext } from "../App";
import { useNavigate } from "react-router-dom";

const PresentationHeader = ({ id, name, title }) => {
  const { presentations } = useContext(DataContext);
  const nav = useNavigate();
  const classId = presentations[id].classId;

  return (
    <div className="PresentationHeader">
      <div className="header-left">
        <img src={logo} onClick={() => nav("/")} />
        <div className="header-left_title">
          <span className="header-title">{name}</span>
          <img src={separator} />
          <span className="header-title">{title}</span>
        </div>
      </div>
      <div className="header-right">
        <button
          className="header_btn-outline"
          onClick={() => nav(`/class/${classId}`)}
        >
          Class로 돌아가기
        </button>
        <button className="header_btn-primary">
          <img src={playIcon} />
          연습하기
        </button>
      </div>
    </div>
  );
};

export default PresentationHeader;
