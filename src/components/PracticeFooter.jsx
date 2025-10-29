import "../styles/PracticeFooter.css";
import micIcon from "../assets/SVG_Practice/Mic.svg";
import line from "../assets/SVG_Practice/Line.svg";
import restartIcon from "../assets/SVG_Practice/Restart.svg";
import playIcon from "../assets/SVG_Practice/play.svg";
import pauseIcon from "../assets/SVG_Practice/Pause.svg";
import powerICon from "../assets/SVG_Practice/Power.svg";
import qrIcon from "../assets/SVG_Practice/qrIcon.svg";
import { useState } from "react";

const PracticeFooter = ({ limitTime }) => {
  const [status, setStatus] = useState("ready");

  return (
    <div className="PracticeFooter">
      <div className="PracticeFooter__timer">05:00:00</div>

      {status === "ready" && (
        <button className="PracticeFooter__btn-mic">
          <img src={micIcon} />
        </button>
      )}

      <div className="PracticeFooter__controls">
        {status === "ready" && (
          <button className="PracticeFooter__btn-start">
            <img src={playIcon} />
            시작
          </button>
        )}
      </div>
    </div>
  );
};

export default PracticeFooter;
