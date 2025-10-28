import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/ResetPassword.css";
import PrimaryButton from "../components/PrimaryButton";
import TextInput from "../components/TextInput";

const ResetPassword = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: send reset request
  };

  return (
    <div className="LoginPage">
      <section className="LoginCard">
        <div className="LoginCard__inner">
          <div className="reset-header">
            <h1 className="login-title">비밀번호 재설정</h1>
            <div className="progress-indicator">
              <span className="progress-step active">❶ 가입한 이메일 입력</span>
              <span className="progress-step">❷ 이메일 인증</span>
              <span className="progress-step">❸ 비밀번호 재설정</span>
            </div>
          </div>

          <div className="reset-instruction">
            비밀번호를 재설정 하기 위해 사용자 이름과 가입된 이메일을 입력해주세요.
          </div>

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

            <PrimaryButton type="submit">인증하기</PrimaryButton>
          </form>

          <div className="signup-cta">
            이미 계정이 있으신가요? <Link to="/login" className="link">로그인</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResetPassword;

