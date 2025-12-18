import "../styles/PracticeFooter.css";
import micIcon from "../assets/SVG_Practice/Mic.svg";
import line from "../assets/SVG_Practice/Line.svg";
import restartIcon from "../assets/SVG_Practice/Restart.svg";
import playIcon from "../assets/SVG_Practice/play.svg";
import pauseIcon from "../assets/SVG_Practice/Pause.svg";
import powerIcon from "../assets/SVG_Practice/Power.svg";
import qrIcon from "../assets/SVG_Practice/qrIcon.svg";
import { useState, useRef, useEffect, useContext } from "react";
import { MicPermissionContext } from "../contexts/MicPermissionContext";
import { startPractice, endPractice } from "../api/practiceApi";
import QRModal from "./QRModal";
import useOutsideClick from "../hooks/useOutsideClick";

const PracticeFooter = ({
  projectId,
  currentSlide,
  limitTime,
  onEnd,
  qrSlug,
}) => {
  const { micEnabled, canUseMic, selectedDeviceId } =
    useContext(MicPermissionContext);

  const [status, setStatus] = useState("ready"); // ready | running | paused
  const [sessionId, setSessionId] = useState(null);
  const [slideTransitions, setSlideTransitions] = useState([]);
  const [activeSlide, setActiveSlide] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const [remainingTime, setRemainingTime] = useState(600000);

  const mediaRef = useRef({ recorder: null, stream: null, chunks: [] });
  const startTimeRef = useRef(null);
  const timerRef = useRef(null);
  const pausedTimeRef = useRef(0); // 누적 pause 시간
  const pauseStartRef = useRef(null); // pause 시작 시각

  //마이크 버튼
  const [showMicTest, setShowMicTest] = useState(false);
  const [volume, setVolume] = useState(0); // 0 ~ 1

  const micTestStreamRef = useRef(null);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const rafRef = useRef(null);

  useOutsideClick(".PracticeFooter__qr-modal-wrapper", () => setShowQR(false));

  //limitTime 초로 변환
  useEffect(() => {
    if (limitTime) {
      const totalMs =
        (limitTime.minute || 0) * 60 * 1000 + (limitTime.second || 0) * 1000;
      setRemainingTime(totalMs);
    }
  }, [limitTime]);

  //타이머 시작/정지/리셋
  const startTimer = () => {
    const interval = 10;
    timerRef.current = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= interval) {
          clearInterval(timerRef.current);
          handleStop(); // 자동 종료
          return 0;
        }
        return prev - interval;
      });
    }, interval);
  };

  const pauseTimer = () => clearInterval(timerRef.current);

  // const resetTimer = () => {
  //   setStatus("ready");
  //   clearInterval(timerRef.current);
  //   // setRemainingTime(600000);
  //   const totalSec =
  //     (limitTime.minute || 0) * 60 * 1000 + (limitTime.second || 0) * 1000;
  //   setRemainingTime(totalSec);
  // };

  const handleRestart = async () => {
    console.log("Restart: 녹음 + 타이머 + 슬라이드 초기화");

    clearInterval(timerRef.current);

    const { recorder, stream } = mediaRef.current;

    try {
      if (recorder && recorder.state !== "inactive") {
        recorder.stop();
      }
    } catch (e) {
      console.warn("recorder.stop() 중 오류:", e);
    }

    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
    }

    // recorder/stream/chunks/시간/슬라이드 초기화
    mediaRef.current = { recorder: null, stream: null, chunks: [] };
    pausedTimeRef.current = 0;
    pauseStartRef.current = null;
    startTimeRef.current = null;

    setSlideTransitions([]);
    setActiveSlide(null);

    const totalMs =
      (limitTime.minute || 0) * 60 * 1000 + (limitTime.second || 0) * 1000;
    setRemainingTime(totalMs);

    setStatus("ready");
  };

  // 남은 시간 → 00:00:00 포맷
  const formatTime = (ms) => {
    const minutes = String(Math.floor(ms / 60000)).padStart(2, "0");
    const seconds = String(Math.floor((ms % 60000) / 1000)).padStart(2, "0");
    const milliseconds = String(Math.floor((ms % 1000) / 10)).padStart(2, "0"); // 1/100초 단위
    return `${minutes}:${seconds}:${milliseconds}`;
  };

  const getElapsedSec = () => {
    const raw = Date.now() - startTimeRef.current - pausedTimeRef.current;
    return (raw / 1000).toFixed(2);
  };

  //세션 시작
  const handleStart = async () => {
    if (showMicTest) {
      stopMicTest();
      setShowMicTest(false);
    }

    if (!canUseMic) {
      alert(
        "마이크 사용이 비활성화되어 있어요.\n설정에서 마이크 사용을 허용해주세요."
      );
      return;
    }

    try {
      pausedTimeRef.current = 0;
      pauseStartRef.current = null;

      //세션 생성 요청
      if (!sessionId) {
        const res = await startPractice(projectId);
        console.log("세션 시작:", res);
        const newSessionId = res.sessionId;
        setSessionId(newSessionId);
      }

      //마이크 접근 및 녹음 시작
      const audioConstraints = selectedDeviceId
        ? { deviceId: { exact: selectedDeviceId } }
        : true;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: audioConstraints,
      });
      const recorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });
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
    if (!mediaRef.current.recorder) return;
    pauseStartRef.current = Date.now();

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
    if (!mediaRef.current.recorder) return;
    // pause 기간 누적 기록
    pausedTimeRef.current += Date.now() - pauseStartRef.current;
    pauseStartRef.current = null;

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
    if (!mediaRef.current.recorder) return;
    clearInterval(timerRef.current);

    if (pauseStartRef.current) {
      pausedTimeRef.current += Date.now() - pauseStartRef.current;
      pauseStartRef.current = null;
    }

    if (!mediaRef.current.recorder) return;
    const { recorder, stream, chunks } = mediaRef.current;

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

        if (onEnd) onEnd({ blob, slideTransitions: finalTransitions });
      }
    };

    recorder.stop();
  };

  //마이크 테스트 시작
  const startMicTest = async () => {
    if (!canUseMic) {
      alert(
        "마이크 사용이 비활성화되어 있어요.\n설정에서 마이크 사용을 허용해주세요."
      );
      return;
    }

    try {
      // 1. 마이크 스트림
      const audioConstraints = selectedDeviceId
        ? { deviceId: { exact: selectedDeviceId } }
        : true;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: audioConstraints,
      });
      micTestStreamRef.current = stream;

      // 2. AudioContext
      const audioContext = new AudioContext();
      await audioContext.resume();
      audioCtxRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyserRef.current = analyser;

      analyser.fftSize = 256;
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      //스무딩 + 프레임 제한
      let smoothVolume = 0;
      let lastUpdate = 0;
      const SMOOTHING = 0.8; // 0.7~0.9 추천

      const updateVolume = (time) => {
        // 20fps 제한 (버벅임 방지)
        if (time - lastUpdate > 50) {
          lastUpdate = time;

          analyser.getByteTimeDomainData(dataArray);

          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            const v = (dataArray[i] - 128) / 128;
            sum += v * v;
          }

          const rms = Math.sqrt(sum / dataArray.length);
          const target = Math.min(rms * 3, 1);

          // 지수 이동 평균 (EMA)
          smoothVolume = smoothVolume * SMOOTHING + target * (1 - SMOOTHING);

          setVolume(smoothVolume);
        }

        rafRef.current = requestAnimationFrame(updateVolume);
      };

      rafRef.current = requestAnimationFrame(updateVolume);
    } catch (e) {
      alert("마이크 테스트를 시작할 수 없어요.");
      console.error(e);
    }
  };

  //마이크 테스트 종료
  const stopMicTest = () => {
    setVolume(0);

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    if (micTestStreamRef.current) {
      micTestStreamRef.current.getTracks().forEach((t) => t.stop());
      micTestStreamRef.current = null;
    }

    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }

    analyserRef.current = null;
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

  //마이크 스트림 클린업
  useEffect(() => {
    return () => {
      stopMicTest();
    };
  }, []);

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
              onClick={handleRestart}
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
        return (
          <button className="PracticeFooter__btn-primary" onClick={handleStart}>
            <img src={playIcon} alt="start" />
            시작
          </button>
        );
    }
  };

  return (
    <div className="PracticeFooter">
      <div className="PracticeFooter__timer">{formatTime(remainingTime)}</div>

      <img src={line} />

      {status === "ready" && (
        <button
          className="PracticeFooter__btn-mic"
          onClick={() => {
            if (showMicTest) {
              stopMicTest();
              setShowMicTest(false);
            } else {
              startMicTest();
              setShowMicTest(true);
            }
          }}
        >
          {showMicTest && status === "ready" && (
            <div className="PracticeFooter__mic-test">
              <p className="PracticeFooter__mic-title">마이크 테스트</p>

              <div className="PracticeFooter__mic-bar">
                <div
                  className="PracticeFooter__mic-bar-fill"
                  style={{
                    width: `${Math.min(volume * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          )}

          <img src={micIcon} alt="mic" />
          <span>마이크</span>
        </button>
      )}

      <div className="PracticeFooter__controls">{renderControls()}</div>

      <img src={line} />

      <button
        className="PracticeFooter__btn-qr"
        onMouseDown={(e) => {
          e.stopPropagation();
          setShowQR(!showQR);
        }}
      >
        <img src={qrIcon} alt="qr" />

        {/* QR모달 */}
        {showQR && (
          <div className="PracticeFooter__qr-modal-wrapper">
            <QRModal qrSlug={qrSlug} />
          </div>
        )}
      </button>
    </div>
  );
};

export default PracticeFooter;
