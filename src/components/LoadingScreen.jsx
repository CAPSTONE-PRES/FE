import { useEffect, useState } from "react";
import "../styles/LoadingScreen.css";

const LoadingScreen = ({ text = "로딩 중", isComplete = "false" }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer;
    if (!isComplete) {
      // 전체 속도 조절: 0.1초마다 0.2%씩 (→ 약 45초에 90%)
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev < 90) return prev + 0.2;
          return prev;
        });
      }, 100); // 100ms마다 업데이트 (프레임 기준으로 부드럽게)
    } else {
      // 완료 시 100%로 채우기
      setProgress(100);
    }

    return () => clearInterval(timer);
  }, [isComplete]);

  return (
    <div className="LoadingScreen">
      <h3 className="LoadingScreen__text">{text}</h3>
      <div className="LoadingScreen__bar">
        <div
          className="LoadingScreen__progress"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default LoadingScreen;
