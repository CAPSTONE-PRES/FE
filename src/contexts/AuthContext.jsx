import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken")
  );

  const isAuthenticated = !!accessToken;

  const login = (token) => {
    localStorage.setItem("accessToken", token);
    setAccessToken(token);
  };

  const updateAccessToken = (newToken) => {
    localStorage.setItem("accessToken", newToken);
    setAccessToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, accessToken, login, logout, updateAccessToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};
