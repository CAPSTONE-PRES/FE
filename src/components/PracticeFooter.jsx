import "../styles/PracticeFooter.css";
import micIcon from "../assets/SVG_Practice/Mic.svg";
import line from "../assets/SVG_Practice/Line.svg";
import restartIcon from "../assets/SVG_Practice/Restart.svg";
import playIcon from "../assets/SVG_Practice/play.svg";
import pauseIcon from "../assets/SVG_Practice/Pause.svg";
import powerIcon from "../assets/SVG_Practice/Power.svg";
import qrIcon from "../assets/SVG_Practice/qrIcon.svg";
import { useState, useRef, useEffect } from "react";
import { startPractice, endPractice } from "../api/practiceApi";

const PracticeFooter = ({ projectId, currentSlide, limitTime }) => {
  const [status, setStatus] = useState("ready"); // ready | running | paused
  const [sessionId, setSessionId] = useState(null);
  const [slideTransitions, setSlideTransitions] = useState([]);
  const [activeSlide, setActiveSlide] = useState(null);
  const mediaRef = useRef({ recorder: null, stream: null, chunks: [] });
  const startTimeRef = useRef(null);
  const [remainingTime, setRemainingTime] = useState(0); // 남은시간(초 단위)
  const timerRef = useRef(null);

  //limitTime 초로 변환
  useEffect(() => {
    if (limitTime) {
      const totalSec = (limitTime.minute || 0) * 60 + (limitTime.second || 0);
      setRemainingTime(totalSec);
    }
  }, [limitTime]);

  //타이머 시작/정지/리셋
  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleStop(); // 자동 종료
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pauseTimer = () => clearInterval(timerRef.current);

  const resetTimer = () => {
    clearInterval(timerRef.current);
    const totalSec = (limitTime.minute || 0) * 60 + (limitTime.second || 0);
    setRemainingTime(totalSec);
  };

  // 남은 시간 → 00:00:00 포맷
  const formatTime = (sec) => {
    const h = String(Math.floor(sec / 3600)).padStart(2, "0");
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const getElapsedSec = () =>
    ((Date.now() - startTimeRef.current) / 1000).toFixed(2);

  //세션 시작
  const handleStart = async () => {
    try {
      //세션 생성 요청
      const res = await startPractice(projectId);
      console.log("세션 시작:", res);

      const newSessionId = res.sessionId || res.id || res;
      setSessionId(newSessionId);

      //마이크 접근 및 녹음 시작
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRef.current = { recorder, stream, chunks: [] };
      startTimeRef.current = Date.now();

      recorder.ondataavailable = (e) => mediaRef.current.chunks.push(e.data);
      recorder.start();

      // 첫 슬라이드 시작 시간 기록
      setSlideTransitions([{ slide: currentSlide, startSec: 0, endSec: null }]);
      setActiveSlide(currentSlide);

      startTimer();

      console.log("녹음 시작됨");
      setStatus("running");
    } catch (err) {
      console.error("세션 시작 오류: ", err);
    }
  };

  //일시정지
  const handlePause = () => {
    pauseTimer();
    const { recorder } = mediaRef.current;
    if (recorder && recorder.state === "recording") {
      recorder.pause();
    }
    console.log("녹음 및 타이머 일시정지");
    setStatus("paused");
  };

  //재개
  const handleResume = () => {
    startTimer();
    const { recorder } = mediaRef.current;
    if (recorder && recorder.state === "paused") {
      recorder.resume();
    }
    console.log("재개됨");
    setStatus("running");
  };

  //녹음 중지 및 업로드
  const handleStop = async () => {
    clearInterval(timerRef.current);
    if (!mediaRef.current.recorder) return;
    const { recorder, stream, chunks } = mediaRef.current;

    recorder.stop();

    recorder.onstop = async () => {
      const blob = new Blob(chunks, { type: "audio/webm" });
      console.log("Blob 생성 완료:", blob);

      //마지막 슬라이드 종료시점
      const finalTransitions = slideTransitions.map((t) => ({
        ...t,
        endSec: t.endSec ?? parseFloat(getElapsedSec()),
      }));

      console.log("최종 slideTransitions:", finalTransitions);

      try {
        // 세션 종료 및 업로드
        const res = await endPractice(sessionId, blob, finalTransitions);
        console.log("업로드 완료:", res);
      } catch (err) {
        console.error("업로드 실패:", err);
      } finally {
        stream.getTracks().forEach((t) => t.stop());
        setStatus("ended");
      }
    };
  };

  //슬라이드 변경 시
  useEffect(() => {
    if (status !== "running" || !startTimeRef.current) return;

    const nowSec = parseFloat(getElapsedSec());
    console.log(`슬라이드 변경 감지 → ${currentSlide}, ${nowSec}s`);

    setSlideTransitions((prev) => {
      const updated = [...prev];
      // 이전 슬라이드 종료 처리
      if (updated.length > 0 && updated[updated.length - 1].endSec === null) {
        updated[updated.length - 1].endSec = nowSec;
      }
      // 새 슬라이드 시작 추가
      updated.push({ slide: currentSlide, startSec: nowSec, endSec: null });
      return updated;
    });

    setActiveSlide(currentSlide);
  }, [currentSlide]);

  // 버튼 상태별 UI 렌더링
  const renderControls = () => {
    switch (status) {
      case "ready":
        return (
          <button className="PracticeFooter__btn-primary" onClick={handleStart}>
            <img src={playIcon} alt="start" />
            시작
          </button>
        );

      case "running":
        return (
          <>
            {" "}
            <button className="PracticeFooter__btn-pause" onClick={handlePause}>
              <img src={pauseIcon} alt="pause" />
            </button>
            <button
              className="PracticeFooter__btn-primary"
              onClick={handleStop}
            >
              <img src={powerIcon} alt="stop" />
              종료
            </button>
          </>
        );

      case "paused":
        return (
          <>
            <button
              className="PracticeFooter__btn-restart"
              onClick={resetTimer}
            >
              <img src={restartIcon} alt="restart" />
            </button>
            <button
              className="PracticeFooter__btn-resume"
              onClick={handleResume}
            >
              <img src={playIcon} alt="resume" />
            </button>
            <button
              className="PracticeFooter__btn-primary"
              onClick={handleStop}
            >
              <img src={powerIcon} alt="stop" />
              종료
            </button>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="PracticeFooter">
      <div className="PracticeFooter__timer">{formatTime(remainingTime)}</div>

      <img src={line} />

      {status === "ready" && (
        <button className="PracticeFooter__btn-mic">
          <img src={micIcon} alt="mic" />
          <span>마이크</span>
        </button>
      )}

      <div className="PracticeFooter__controls">{renderControls()}</div>

      <img src={line} />

      <button className="PracticeFooter__btn-qr">
        <img src={qrIcon} alt="qr" />
      </button>
    </div>
  );
};

export default PracticeFooter;
