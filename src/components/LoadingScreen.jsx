import "../styles/LoadingScreen.css";

const LoadingScreen = ({ text = "로딩 중" }) => {
  return (
    <div className="LoadingScreen">
      <h3 className="LoadingScreen__text">{text}</h3>
      <div className="LoadingScreen__bar">
        <div className="LoadingScreen__progress"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;
