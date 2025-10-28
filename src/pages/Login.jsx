import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Login.css";
import PrimaryButton from "../components/PrimaryButton";
import iconKakao from "../assets/SVG_Login/icon-kakaoLogo.svg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // submit placeholder
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
            <label className="field-label" htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              className="text-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label className="field-label" htmlFor="password">비밀번호</label>
            <input
              id="password"
              type="password"
              className="text-input"
             
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="password-help">비밀번호를 잊어버리셨나요?</div>

            <PrimaryButton type="submit">로그인</PrimaryButton>
          </form>

          <div className="divider">
            <span>또는 간편 로그인</span>
          </div>

          <button className="btn btn-kakao" type="button">
            <img src={iconKakao} className="kakao-dot" /> 카카오 로그인
          </button>

          <div className="signup-cta">
            계정이 없으신가요? <Link to="#" className="link">회원가입</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
