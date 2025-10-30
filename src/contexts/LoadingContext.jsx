import { Children, createContext, useContext, useState } from "react";
import LoadingScreen from "../components/LoadingScreen";

const LoadingContext = createContext();

export const LoadingProvider = ({ Children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");

  const showLoading = (text = "로딩 중...") => {
    setLoadingText(text);
    setIsLoading(true);
  };

  const hideLoading = () => {
    setLoadingText("");
    setIsLoading(false);
  };

  return (
    <LoadingContext.Provider
      value={{ isLoading, loadingText, showLoading, hideLoading }}
    >
      {Children}
      {isLoading && <LoadingScreen text={loadingText} />}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
