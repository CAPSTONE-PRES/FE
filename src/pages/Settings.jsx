import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import PrimaryButton from "../components/PrimaryButton";
import TextButton from "../components/TextButton";
import TextInput from "../components/TextInput";
import userIcon from "../assets/SVG_Main/user/user1.svg";
import "../styles/Settings.css";

const Settings = () => {
  const navigate = useNavigate();
  const [selectedMenu, setSelectedMenu] = useState("account");
  const [profileName, setProfileName] = useState("박민영");
  const [email, setEmail] = useState("minyoung1234@gmail.com");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);
  const previousUrlRef = useRef(null);

  useEffect(() => {
    return () => {
      if (previousUrlRef.current) {
        URL.revokeObjectURL(previousUrlRef.current);
      }
    };
  }, []);

  const handleSelectProfileImage = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleProfileFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      if (previousUrlRef.current) {
        URL.revokeObjectURL(previousUrlRef.current);
      }
      previousUrlRef.current = objectUrl;
      setProfileImage(objectUrl);
    }
  };

  const handleRemoveProfileImage = () => {
    if (previousUrlRef.current) {
      URL.revokeObjectURL(previousUrlRef.current);
      previousUrlRef.current = null;
    }
    setProfileImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const menuItems = [
    { id: "account", label: "계정" },
    { id: "notifications", label: "알림" },
    { id: "permissions", label: "웹사이트 권한" },
    { id: "terms", label: "약관 정보" },
  ];

  const renderContent = () => {
    switch (selectedMenu) {
      case "account":
        return (
          <>
            <div className="Settings__section">
              <h2 className="Settings__section-title">프로필</h2>
              <p className="Settings__section-description">
                다른 사용자가 귀하의 프로필 사진과 이름을 볼 수 있어요. 설정에
                따라 내 계정 이름과 다를 수 있어요.
              </p>

              <div className="Settings__card">
                <div className="Settings__field">
                  <label className="Settings__field-label">프로필 사진</label>
                  <div className="Settings__field-content">
                    <div className="Settings__profile-avatar">
                      <img
                        src={profileImage || userIcon}
                        alt="user"
                        width={48}
                        height={48}
                      />
                    </div>
                    {profileImage ? (
                      <div style={{ display: "flex", gap: 8 }}>
                        <TextButton onClick={handleRemoveProfileImage}>
                          제거하기
                        </TextButton>
                        <TextButton onClick={handleSelectProfileImage}>
                          변경하기
                        </TextButton>
                      </div>
                    ) : (
                      <TextButton onClick={handleSelectProfileImage}>
                        프로필 사진 추가하기
                      </TextButton>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleProfileFileChange}
                    />
                  </div>
                </div>

                <div className="Settings__field">
                  <label className="Settings__field-label">프로필 이름</label>
                  <div className="Settings__field-content">
                    {isEditingName ? (
                      <>
                        <TextInput
                          id="settings-profile-name"
                          type="text"
                          value={profileName}
                          onChange={(e) => setProfileName(e.target.value)}
                          placeholder="프로필 이름"
                        />
                        <TextButton onClick={() => setIsEditingName(false)}>
                          저장하기
                        </TextButton>
                      </>
                    ) : (
                      <>
                        <span className="Settings__field-value">
                          {profileName}
                        </span>
                        <TextButton onClick={() => setIsEditingName(true)}>
                          변경하기
                        </TextButton>
                      </>
                    )}
                  </div>
                </div>

                <div className="Settings__field">
                  <label className="Settings__field-label">이메일</label>
                  <div className="Settings__field-content">
                    {isEditingEmail ? (
                      <>
                        <TextInput
                          id="settings-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="이메일"
                        />
                        <TextButton onClick={() => setIsEditingEmail(false)}>
                          저장하기
                        </TextButton>
                      </>
                    ) : (
                      <>
                        <span className="Settings__field-value">{email}</span>
                        <TextButton onClick={() => setIsEditingEmail(true)}>
                          변경하기
                        </TextButton>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="Settings__section">
              <h2 className="Settings__section-title">비밀번호</h2>
              <p className="Settings__section-description">
                비밀번호를 변경하려면 현재 비밀번호를 확인한 다음 이전에
                사용하지 않은 새로운 비밀번호를 만드세요. 비밀번호는 영문
                소문자와 숫자를 필수적으로 포함되어야 해요.
              </p>

              <div className="Settings__card">
                <div className="Settings__field">
                  <label className="Settings__field-label">비밀번호</label>
                  <div className="Settings__field-content">
                    <TextInput
                      id="settings-password"
                      type="password"
                      value={"password"}
                      readOnly
                      placeholder="••••••••"
                    />
                    <TextButton onClick={() => {}}>변경하기</TextButton>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      case "notifications":
        return (
          <div className="Settings__section">
            <h2 className="Settings__section-title">알림</h2>
            <p className="Settings__section-description">
              알림 설정을 관리할 수 있어요.
            </p>
          </div>
        );
      case "permissions":
        return (
          <div className="Settings__section">
            <h2 className="Settings__section-title">웹사이트 권한</h2>
            <p className="Settings__section-description">
              웹사이트 권한을 관리할 수 있어요.
            </p>
          </div>
        );
      case "terms":
        return (
          <div className="Settings__section">
            <h2 className="Settings__section-title">약관 정보</h2>
            <p className="Settings__section-description">
              약관 정보를 확인할 수 있어요.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="Settings">
      <Header />
      <div className="Settings__layout">
        <aside>
          <h3 className="Settings__sidebar-title">설정</h3>
          <div className="Settings__sidebar">
            <nav className="Settings__sidebar-nav">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  className={`Settings__menu-item ${
                    selectedMenu === item.id ? "active" : ""
                  }`}
                  onClick={() => setSelectedMenu(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        <div className="Settings__main">
          <div className="Settings__container">
            <main className="Settings__content">{renderContent()}</main>
          </div>

          {selectedMenu === "account" && (
            <div className="Settings__actions">
              <PrimaryButton onClick={() => navigate("/login")}>
                로그아웃
              </PrimaryButton>
              <a href="#" className="Settings__delete-link">
                계정 탈퇴
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
