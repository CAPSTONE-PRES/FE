import {
  getMyEmailNotifications,
  updateMyEmailNotifications,
} from "../api/notificationApi";
import "../styles/SettingsNotifications.css";

import React, { useEffect, useState } from "react";

const SettingsNotifications = () => {
  const [emailEnabled, setEmailEnabled] = useState(true);

  //   const [emailWorkspaceActivity, setEmailWorkspaceActivity] = useState(true);
  const [inviteEnabled, setInviteEnabled] = useState(true);
  const [reviewCommentEnabled, setReviewCommentEnabled] = useState(true);
  const [practiceReminderEnabled, setPracticeReminderEnabled] = useState(true);

  const [workspaceAll, setWorkspaceAll] = useState(true);
  const [workspaceNewComment, setWorkspaceNewComment] = useState(true);
  const [workspacePractice, setWorkspacePractice] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getMyEmailNotifications();
        console.log("알림 설정 조회:", data);

        setEmailEnabled(data.emailEnabled);
        setInviteEnabled(data.inviteEnabled);
        setReviewCommentEnabled(data.reviewCommentEnabled);
        setPracticeReminderEnabled(data.practiceReminderEnabled);
      } catch (e) {
        console.error("이메일 알림 설정 조회 실패", e);
      }
    };

    fetchNotifications();
  }, []);

  const saveEmailNotifications = async (next) => {
    const payload = {
      emailEnabled: next.emailEnabled,
      inviteEnabled: next.inviteEnabled,
      reviewCommentEnabled: next.reviewCommentEnabled,
      practiceReminderEnabled: next.practiceReminderEnabled,
      practiceRemindD1: next.practiceReminderEnabled,
      practiceRemindD2: next.practiceReminderEnabled,
    };

    try {
      await updateMyEmailNotifications(payload);
      console.log("토글 완료:", payload);
    } catch (e) {
      console.error("이메일 알림 설정 저장 실패:", e);
    }
  };

  const toggleEmailEnabled = (value) => {
    if (value === false) {
      const nextState = {
        emailEnabled: false,
        inviteEnabled: false,
        reviewCommentEnabled: false,
        practiceReminderEnabled: false,
      };

      setEmailEnabled(false);
      setInviteEnabled(false);
      setReviewCommentEnabled(false);
      setPracticeReminderEnabled(false);

      saveEmailNotifications(nextState);
    } else {
      setEmailEnabled(true);

      saveEmailNotifications({
        emailEnabled: true,
        inviteEnabled,
        reviewCommentEnabled,
        practiceReminderEnabled,
      });
    }
  };

  const toggleSub = (key, setter) => (value) => {
    const nextState = {
      emailEnabled,
      inviteEnabled,
      reviewCommentEnabled,
      practiceReminderEnabled,
      [key]: value,
    };

    // 하위 토글이 true가 되면 emailEnabled 자동 true
    if (value === true && emailEnabled === false) {
      setEmailEnabled(true);
      nextState.emailEnabled = true;
    }

    setter(value);
    saveEmailNotifications(nextState);
  };

  return (
    <>
      {/* 이메일 알림 */}
      <div className="Settings__section">
        <div className="Settings__section-header">
          <h2 className="Settings__section-title">이메일 알림</h2>
          <Toggle checked={emailEnabled} onChange={toggleEmailEnabled} />
        </div>
        <p className="Settings__section-description">
          이메일 알림 수신을 받을 수 있어요.
        </p>

        <div className="Settings__card">
          {/* <NotificationItem
            title="내 워크스페이스 활동 시 알림 수신"
            desc="검토의견, 워크스페이스 초대, 사용자 요청이 있을 때 이메일을 받을 수 있어요."
            checked={emailWorkspaceActivity}
            onChange={setEmailWorkspaceActivity}
          /> */}
          <NotificationItem
            title="이메일 초대 시 알림 수신"
            desc="팀 워크스페이스 초대 시 이메일을 받을 수 있어요."
            checked={inviteEnabled}
            onChange={toggleSub("inviteEnabled", setInviteEnabled)}
          />
          <NotificationItem
            title="새로운 검토의견 추가 시 알림 수신"
            desc="새로운 검토의견 댓글이 달리거나 팀원이 내용을 확인할 시 이메일을 받을 수 있어요."
            checked={reviewCommentEnabled}
            onChange={toggleSub(
              "reviewCommentEnabled",
              setReviewCommentEnabled
            )}
          />
          <NotificationItem
            title="발표 연습 이메일 Push 알림"
            desc="발표일 2일 전, 1일 전에 발표연습 Push 이메일을 받을 수 있어요."
            checked={practiceReminderEnabled}
            onChange={toggleSub(
              "practiceReminderEnabled",
              setPracticeReminderEnabled
            )}
          />
        </div>
      </div>

      {/* 워크스페이스 알림 */}
      <div className="Settings__section">
        <div className="Settings__section-header">
          <h2 className="Settings__section-title">워크스페이스 알림</h2>
          <Toggle checked={workspaceAll} onChange={(v) => setWorkspaceAll(v)} />
        </div>
        <p className="Settings__section-description">
          워크스페이스 알림 수신을 받을 수 있어요.
        </p>

        <div className="Settings__card">
          <NotificationItem
            title="새로운 검토의견 추가 시 알림 수신"
            desc="새로운 검토의견 댓글이 달리거나 팀원이 내용을 확인할 시 알림을 받을 수 있어요."
            checked={workspaceNewComment}
            onChange={setWorkspaceNewComment}
          />
          <NotificationItem
            title="발표 연습 알림"
            desc="발표일 2일 전, 1일 전에 발표연습 알림을 받을 수 있어요."
            checked={workspacePractice}
            onChange={setWorkspacePractice}
          />
        </div>
      </div>
    </>
  );
};

const Toggle = ({ checked, onChange }) => (
  <label className="toggle-switch">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
    />
    <span className="toggle-slider" />
  </label>
);

const NotificationItem = ({ title, desc, checked, onChange }) => {
  return (
    <div className="Settings__notification-item">
      <div className="Settings__notification-text">
        <p className="Settings__notification-title">{title}</p>
        <p className="Settings__notification-desc">{desc}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
};

export default SettingsNotifications;
