import { useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const KakaoCallback = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");

    if (!accessToken) {
      alert("카카오 로그인 실패: 토큰 없음");
      navigate("/login");
      return;
    }

    login(accessToken);
    navigate("/home");
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <p>카카오 로그인 처리 중...</p>
    </div>
  );
};

export default KakaoCallback;
