import { useNavigate } from "react-router-dom";
import backIcon from "../assets/SVG_NewClass/back.svg";

const BackButton = ({ onClick }) => {
  const nav = useNavigate();

  return (
    <>
      <img
        className="BackButton"
        src={backIcon}
        onClick={onClick}
        style={{ cursor: "pointer" }}
      />
    </>
  );
};

export default BackButton;
