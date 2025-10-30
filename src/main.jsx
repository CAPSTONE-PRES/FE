import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { LoadingProvider } from "./contexts/LoadingContext.jsx";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ScrollToTop />
    <App />
  </BrowserRouter>
);
