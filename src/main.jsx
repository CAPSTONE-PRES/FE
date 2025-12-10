import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, useLocation } from "react-router-dom";
import { useEffect, useContext, useState } from "react";
import { LoadingProvider } from "./contexts/LoadingContext.jsx";
import { AuthProvider, AuthContext } from "./contexts/AuthContext.jsx";
import { setupInterceptors } from "./api/api.js";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

//인터셉터를 등록할 때까지 children 렌더링을 막음
function InterceptorSetupWrapper({ children }) {
  const { updateAccessToken, logout } = useContext(AuthContext);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setupInterceptors(updateAccessToken, logout);
    setReady(true);
  }, [updateAccessToken, logout]);

  if (!ready) return null;

  return children;
}

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ScrollToTop />
    <AuthProvider>
      <InterceptorSetupWrapper>
        <App />
      </InterceptorSetupWrapper>
    </AuthProvider>
  </BrowserRouter>
);
