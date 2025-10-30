import "../styles/LoadingScreen.css";

const LoadingScreen = ({ text = "발표 피드백 중..." }) => {
  return (
    <div className="LoadingScreen">
      <h3>{text}</h3>
      <div className="LoadingScreen__bar">
        <div className="LoadingScreen__progress"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;
