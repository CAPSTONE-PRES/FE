import React, { createContext, useEffect, useMemo, useState } from "react";

export const MicPermissionContext = createContext(null);

export const MicPermissionProvider = ({ children }) => {
  const [micEnabled, setMicEnabled] = useState(true);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [browserMicPermission, setBrowserMicPermission] = useState("prompt");

  useEffect(() => {
    let permissionStatus;

    const setup = async () => {
      //Permissions API 지원 여부 확인
      if (!navigator?.permissions?.query) return;

      try {
        permissionStatus = await navigator.permissions.query({
          name: "microphone",
        });

        setBrowserMicPermission(permissionStatus.state);

        permissionStatus.onchange = () => {
          setBrowserMicPermission(permissionStatus.state);
        };
      } catch (e) {
        console.warn("microphone permission query failed:", e);
      }
    };

    setup();

    return () => {
      if (permissionStatus) permissionStatus.onchange = null;
    };
  }, []);

  const canUseMic = useMemo(() => {
    return micEnabled && browserMicPermission === "granted";
  }, [micEnabled, browserMicPermission]);

  const value = useMemo(
    () => ({
      micEnabled,
      setMicEnabled,
      selectedDeviceId,
      setSelectedDeviceId,
      browserMicPermission,
      canUseMic,
    }),
    [micEnabled, browserMicPermission, canUseMic, selectedDeviceId]
  );

  return (
    <MicPermissionContext.Provider value={value}>
      {children}
    </MicPermissionContext.Provider>
  );
};
