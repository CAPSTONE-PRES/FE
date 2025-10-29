import "../styles/NewButton.css";
import plus from "../assets/SVG_ClassHome/plus.svg";
import { useNavigate } from "react-router-dom";

const NewButton = ({ text, link, state }) => {
  const nav = useNavigate();
  return (
    <>
      {" "}
      <button
        className="new-button"
        onClick={() => {
          nav(link, { state });
        }}
      >
        <img src={plus} />
        {text}
      </button>
    </>
  );
};

export default NewButton;
