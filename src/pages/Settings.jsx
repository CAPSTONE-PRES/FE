import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import PrimaryButton from "../components/PrimaryButton";
import TextButton from "../components/TextButton";
import TextInput from "../components/TextInput";
import userIcon from "../assets/SVG_Main/user/user1.svg";
import "../styles/Settings.css";
import { logoutApi } from "../api/authApi";
import { AuthContext } from "../contexts/AuthContext";
import {
  getMyInfo,
  updateMyInfo,
  uploadProfileImage,
  deleteProfileImage,
} from "../api/userApi";
import SettingsNotifications from "../components/SettingsNotifications";

const Settings = () => {
  const navigate = useNavigate();
  const [selectedMenu, setSelectedMenu] = useState("account");
  const [userInfo, setUserInfo] = useState({});
  const [profileName, setProfileName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);
  const previousUrlRef = useRef(null);

  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMyInfo();

        setUserInfo(data);
        setProfileName(data.username);
        setEmail(data.email);

        if (data.profileUrl) {
          setProfileImage(data.profileUrl);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

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

  const handleProfileFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await uploadProfileImage(file);

      const previewUrl = URL.createObjectURL(file);

      if (previousUrlRef.current) {
        URL.revokeObjectURL(previousUrlRef.current);
      }

      previousUrlRef.current = previewUrl;
      setProfileImage(previewUrl);
    } catch (err) {
      console.error(err);
      alert("이미지 업로드에 실패했습니다.");
    }
  };

  const handleRemoveProfileImage = async () => {
    try {
      await deleteProfileImage();
    } catch (err) {
      console.error(err);
    }

    if (previousUrlRef.current) URL.revokeObjectURL(previousUrlRef.current);
    previousUrlRef.current = null;

    setProfileImage(null);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const saveProfileName = async () => {
    try {
      await updateMyInfo({
        username: profileName,
      });

      setUserInfo((prev) => ({ ...prev, username: profileName }));
      setIsEditingName(false);
    } catch (err) {
      console.error(err);
      alert("이름 업데이트 실패");
    }
  };

  const saveEmail = async () => {
    try {
      await updateMyInfo({
        email: email,
      });

      setUserInfo((prev) => ({ ...prev, email }));
      setIsEditingEmail(false);
    } catch (err) {
      console.error(err);
      alert("이메일 업데이트 실패");
    }
  };

  const savePassword = async () => {
    if (!newPassword || newPassword.length < 8) {
      alert("비밀번호는 8자 이상이어야 합니다.");
      return;
    }

    try {
      await updateMyInfo({
        password: newPassword,
      });

      alert("비밀번호가 변경되었습니다.");
      setIsEditingPassword(false);
      setNewPassword("");
    } catch (err) {
      console.error(err);
      alert("비밀번호 변경 실패");
    }
  };

  const handleLogout = async () => {
    try {
      await logoutApi();
      logout();
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("오류가 발생했습니다");
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
                        <TextButton onClick={saveProfileName}>
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
                        <TextButton onClick={saveEmail}>저장하기</TextButton>
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
                    {isEditingPassword ? (
                      <>
                        <TextInput
                          id="settings-password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="새 비밀번호 입력 (8자 이상)"
                        />
                        <TextButton onClick={savePassword}>저장하기</TextButton>
                      </>
                    ) : (
                      <>
                        <TextInput
                          id="settings-password"
                          type="password"
                          value={"********"}
                          readOnly
                        />
                        <TextButton onClick={() => setIsEditingPassword(true)}>
                          변경하기
                        </TextButton>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      case "notifications":
        return (
          <div className="Settings__section">
            <SettingsNotifications />
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
              <PrimaryButton onClick={handleLogout}>로그아웃</PrimaryButton>
              {/* <a href="#" className="Settings__delete-link">
                계정 탈퇴
              </a> */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
