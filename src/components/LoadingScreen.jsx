import { useEffect, useState } from "react";
import "../styles/LoadingScreen.css";

const LoadingScreen = ({
  text = "로딩 중",
  duration,
  isComplete = false,
  onComplete,
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer;
    if (!isComplete) {
      const interval = 200;
      const target = 90;
      const steps = (duration * 1000) / interval;

      const increasePerStep = target / steps;

      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= target) return prev;
          return prev + increasePerStep;
        });
      }, interval);
    } else {
      // API 완료 → 90까지 보정
      setProgress((prev) => (prev < 90 ? 90 : prev));

      // 약간의 지연 후 100까지 채움
      setTimeout(() => {
        setProgress(100);
      }, 100);
    }

    return () => clearInterval(timer);
  }, [isComplete, duration]);

  useEffect(() => {
    if (progress === 100 && onComplete) {
      onComplete(); // 부모에게 알림
    }
  }, [progress, onComplete]);

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
