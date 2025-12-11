import "../styles/Header.css";
import pres_mainLogo from "../assets/SVG_Main/pres/logoss.svg";
import mail from "../assets/SVG_Main/mail.svg";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { DataContext } from "../App";

const Header = () => {
  const { currentUser } = useContext(DataContext);
  const nav = useNavigate();
  return (
    <header className="Header">
      <div className="header_logo">
        <img
          src={pres_mainLogo}
          onClick={() => {
            nav("/");
          }}
        />
      </div>

      <div className="header_nav">
        <nav>
          <ul>
            <li>
              <Link to={"/"}>Home</Link>
            </li>
            <li>
              <Link to={"/classHome"}>Class</Link>
            </li>
            <li>
              <Link to={"/settings"}>설정</Link>
            </li>
          </ul>
        </nav>

        <button className="mail-icon">
          <img src={mail} />
        </button>
        <button className="user-icon" onClick={() => nav("/settings")}>
          <img src={currentUser.profileUrl} />
        </button>
      </div>
    </header>
  );
};
export default Header;
