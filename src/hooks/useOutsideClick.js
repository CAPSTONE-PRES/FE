import { useEffect } from "react";

const useOutsideClick = (selector, onClose) => {
  useEffect(() => {
    const handler = (e) => {
      //selector 내부 클릭 무시
      if (e.target.closest(selector)) return;
      // 외부 클릭 시 onClose 실행
      onClose();
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }),
    [selector, onClose];
};

export default useOutsideClick;
