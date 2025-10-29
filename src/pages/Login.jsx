import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";
import PrimaryButton from "../components/PrimaryButton";
import TextInput from "../components/TextInput";
import iconKakao from "../assets/SVG_Login/icon-kakaoLogo.svg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: validate and authenticate; on success navigate home
    navigate("/");
  };

  return (
    <div className="LoginPage">
      <section className="LoginCard">
        <div className="LoginCard__inner">
          <div className="login-header">
            <h1 className="login-title">로그인</h1>
            <p className="login-subtitle">로그인하고 Pres.로 완벽한 발표를 준비해보세요!</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <TextInput
              id="email"
              label="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextInput
              id="password"
              label="비밀번호"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div style={{ textAlign: "right", marginBottom: "8px" }}>
              <Link to="/reset-password" style={{ fontSize: "11px", color: "#9aa1a9", textDecoration: "none" }}>
                비밀번호를 잊어버리셨나요?
              </Link>
            </div>

            <PrimaryButton type="submit">로그인</PrimaryButton>
          </form>

          <div className="divider">
            <span>또는 간편 로그인</span>
          </div>

          <button className="btn btn-kakao" type="button">
            <img src={iconKakao} className="kakao-dot" /> 카카오 로그인
          </button>

          <div className="signup-cta">
            계정이 없으신가요? <Link to="/signup" className="link">회원가입</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
