import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Signup.css";
import PrimaryButton from "../components/PrimaryButton";
import TextInput from "../components/TextInput";
import iconKakao from "../assets/SVG_Login/icon-kakaoLogo.svg";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showEmailVerify, setShowEmailVerify] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [verifyCode, setVerifyCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowEmailVerify(true);
  };

  const handleVerify = (e) => {
    e.preventDefault();
    setShowComplete(true);
  };

  return (
    <div className="LoginPage">
      <section className="LoginCard">
        <div className="LoginCard__inner">
          {showComplete ? (
            <>
              <div className="signup-header">
                <h1 className="login-title">가입완료</h1>
                <div className="progress-indicator">
                  <span className="progress-step">❶ 개인정보 입력</span>
                  <span className="progress-step">❷ 이메일 인증</span>
                  <span className="progress-step active">❸ 가입완료</span>
                </div>
              </div>

              <div className="complete-message">
                로그인 후 Pres. 이용을 시작해보세요!
              </div>

              <Link to="/login">
                <PrimaryButton type="button">로그인하기</PrimaryButton>
              </Link>
            </>
          ) : !showEmailVerify ? (
            <>
              <div className="signup-header">
                <h1 className="login-title">회원가입</h1>
                <div className="progress-indicator">
                  <span className="progress-step active">❶ 개인정보 입력</span>
                  <span className="progress-step">❷ 이메일 인증</span>
                  <span className="progress-step">❸ 가입완료</span>
                </div>
              </div>

              <div className="signup-content">
                <form className="login-form" onSubmit={handleSubmit}>
                  <TextInput
                    id="name"
                    label="이름"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />

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

                  <div className="terms-checkbox">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={agree}
                      onChange={(e) => setAgree(e.target.checked)}
                    />
                    <label htmlFor="terms" className="terms-text">
                      <button type="button" className="terms-link" onClick={() => setShowTerms(true)}>이용약관</button>
                      {" "}및{" "}
                      <button type="button" className="terms-link" onClick={() => setShowTerms(true)}>개인정보처리방침</button>
                      에 동의하고 회원가입을 계속 진행합니다.
                    </label>
                  </div>

                  <PrimaryButton type="submit">회원가입</PrimaryButton>
                </form>

                <div className="divider">
                  <span>또는 간편 로그인</span>
                </div>

                <button className="btn btn-kakao" type="button">
                  <img src={iconKakao} className="kakao-dot" /> 카카오로 시작하기
                </button>

                <div className="signup-cta">
                  이미 계정이 있으신가요? <Link to="/login" className="link">로그인</Link>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="signup-header">
                <h1 className="login-title">이메일 인증</h1>
                <div className="progress-indicator">
                  <span className="progress-step">❶ 개인정보 입력</span>
                  <span className="progress-step active">❷ 이메일 인증</span>
                  <span className="progress-step">❸ 가입완료</span>
                </div>
              </div>

              <div className="email-verify-message">
                입력하신 이메일로 인증번호를 보내드렸어요!
              </div>

              <form className="login-form" onSubmit={handleVerify}>
                <TextInput
                  id="verifyCode"
                  label="인증번호"
                  type="text"
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value)}
                />

                <PrimaryButton type="submit">인증하기</PrimaryButton>
              </form>

              <div className="signup-cta">
                이미 계정이 있으신가요? <Link to="/login" className="link">로그인</Link>
              </div>
            </>
          )}
        </div>
      </section>

      {showTerms && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal">
            <button className="modal-close" aria-label="닫기" onClick={() => setShowTerms(false)}>
              ×
            </button>
            <div className="modal-body">아직 이용약관은 준비중이에요!</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;

