import "../styles/SettingsPermissions.css";
import { useState, useEffect, useContext, useRef } from "react";
import { MicPermissionContext } from "../contexts/MicPermissionContext";
import checkedIcon from "../assets/SVG_Main/checked.svg";
import uncheckedIcon from "../assets/SVG_Main/unchecked.svg";
import chevronDownIcon from "../assets/SVG_Main/chevron-down.svg";

const SettingsPermissions = () => {
  const {
    micEnabled,
    setMicEnabled,
    browserMicPermission,
    selectedDeviceId,
    setSelectedDeviceId,
    canUseMic,
  } = useContext(MicPermissionContext);

  console.log("canUseMic:", canUseMic);
  console.log("micEnabled:", micEnabled);
  console.log("selectedDeviceId:", selectedDeviceId);

  //디바이스 선택
  const [devices, setDevices] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  //마이크 테스트
  const [isTesting, setIsTesting] = useState(false);
  const [volume, setVolume] = useState(0); // 0 ~ 1

  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const rafIdRef = useRef(null);

  const handleToggleMic = async () => {
    if (!micEnabled) {
      // OFF → ON 시도
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        stream.getTracks().forEach((t) => t.stop());
        setMicEnabled(true);
      } catch (e) {
        // 사용자가 거부한 경우
        alert(
          "마이크 권한이 필요해요.\n" +
            "브라우저에서 마이크 권한을 허용해주세요."
        );
        return;
      }
    } else {
      // ON → OFF
      setMicEnabled(false);
    }
  };

  //마이크 테스트 시작
  const startMicTest = async () => {
    if (!micEnabled) {
      alert("마이크를 먼저 선택해주세요.");
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
      streamRef.current = stream;

      // 2. AudioContext
      const audioContext = new AudioContext();
      await audioContext.resume();
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyserRef.current = analyser;

      analyser.fftSize = 256;
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      setIsTesting(true);

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

        rafIdRef.current = requestAnimationFrame(updateVolume);
      };

      rafIdRef.current = requestAnimationFrame(updateVolume);
    } catch (e) {
      alert("마이크 테스트를 시작할 수 없어요.");
      console.error(e);
    }
  };

  //마이크 테스트 중단
  const stopMicTest = () => {
    setIsTesting(false);
    setVolume(0);

    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    analyserRef.current = null;
  };

  //디바이스 가져오기
  useEffect(() => {
    if (!micEnabled) return;
    if (browserMicPermission !== "granted") return;

    navigator.mediaDevices.enumerateDevices().then((list) => {
      const mics = list.filter((d) => d.kind === "audioinput");
      setDevices(mics);

      if (!selectedDeviceId && mics.length > 0) {
        setSelectedDeviceId(mics[0].deviceId);
      }
    });
  }, [micEnabled, browserMicPermission]);

  //마이크 권한 없으면 드롭다운 닫기
  useEffect(() => {
    if (!micEnabled) {
      setIsOpen(false);
    }
  }, [micEnabled]);

  const selectedDevice = devices.find((d) => d.deviceId === selectedDeviceId);

  return (
    <div className="MicPermission__section">
      <div className="MicPermission__section-header">
        <h2 className="Settings__section-title">마이크</h2>
        <p className="Settings__section-description">
          발표 연습 음성을 받기 위해 마이크 사용 허용이 필요해요.
        </p>
      </div>

      {/* 마이크 허용 상태 */}
      <div className="MicPermission__check-row">
        <img
          src={micEnabled ? checkedIcon : uncheckedIcon}
          alt="toggle"
          onClick={handleToggleMic}
        />
        <span>Pres.에서 마이크를 사용하도록 허용해요.</span>
      </div>

      {/* 녹음장치 */}
      <div className="MicPermission__device-wrapper">
        <div
          className={`MicPermission__block ${!micEnabled ? "disabled" : ""}`}
        >
          <h3 className="Settings__label">녹음장치</h3>

          <div
            className="MicPermission__device-select"
            onClick={() => {
              if (browserMicPermission !== "granted") {
                alert(
                  "마이크 권한이 필요해요.\n" +
                    "브라우저에서 마이크 권한을 허용해주세요."
                );
                return;
              }
              setIsOpen((prev) => !prev);
            }}
          >
            <span>
              {selectedDevice ? selectedDevice.label : "마이크를 선택해주세요"}
            </span>
            <img src={chevronDownIcon} alt="open" />
          </div>

          {isOpen && devices.length > 0 && (
            <ul className="MicPermission__device-list">
              {devices.map((device) => (
                <li
                  key={device.deviceId}
                  className={`MicPermission__device-item ${
                    device.deviceId === selectedDeviceId ? "active" : ""
                  }`}
                  onClick={() => {
                    setSelectedDeviceId(device.deviceId);
                    setIsOpen(false);
                  }}
                >
                  {device.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* 마이크 테스트 */}
      <div className={`MicPermission__block ${!micEnabled ? "disabled" : ""}`}>
        <h3 className="Settings__label">마이크 테스트</h3>
        <p className="Settings__section-description">
          마이크에 문제가 있나요? 마이크 테스트를 통해 소리를 받아오고 있는지
          확인해드릴게요.
        </p>

        <div className="MicPermission__test">
          <button
            className="MicPermission__test-button"
            onClick={() => {
              if (isTesting) {
                stopMicTest();
              } else {
                startMicTest();
              }
            }}
          >
            {isTesting ? "테스트 종료" : "테스트하기"}
          </button>

          <div className="MicPermission__gauge">
            <div
              className="MicPermission__gauge-fill"
              style={{
                width: `${volume * 100}%`,
                transition: "none",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPermissions;
