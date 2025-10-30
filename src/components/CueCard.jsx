import { useEffect, useRef, useState } from "react";
import "../styles/CueCard.css";

const CueCard = ({ keyword, value, onChange, showNonverbal = true }) => {
  const editorRef = useRef();
  const isComposingRef = useRef(false);

  // 커서 위치 저장,복원
  const saveSelection = () => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;
    return sel.getRangeAt(0);
  };
  const restoreSelection = (range) => {
    if (!range) return;
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  };

  //텍스트 -> 칩 html 변환
  const textToHTML = (text) => {
    if (!text) return "";
    // 1) 칩 변환: <> 중 html 태그는 제외
    const withChips = text.replace(/<(?!br\s*\/?)([^><\n]+?)>/g, (_m, chip) => {
      return showNonverbal
        ? `<span class="cue-chip" contenteditable="false">${chip}</span>`
        : `<span class="cue-chip cue-chip--hidden" contenteditable="false">${chip}</span>`;
    });
    // 2) 줄바꿈 변환
    return withChips.replace(/\n/g, "<br>");
  };

  //html → 원본 텍스트(<🌬 호흡>) 변환
  const htmlToText = (html) => {
    if (!html) return "";
    return html
      .replace(/<span[^>]*class="cue-chip"[^>]*>(.*?)<\/span>/g, "<$1>")
      .replace(/<br\s*\/?>/g, "\n")
      .replace(/<div>/g, "\n")
      .replace(/<\/div>/g, "")
      .replace(/&nbsp;/g, " ");
  };

  //외부 value가 바뀌었을 때만 에디터 반영 (비제어 유지)
  useEffect(() => {
    const current = editorRef.current;
    if (!current || isComposingRef.current) return;
    const currentText = htmlToText(current.innerHTML || "");
    if (currentText !== value) {
      current.innerHTML = textToHTML(value);
    }
  }, [value]);

  //showNonverbal 토글 -> 칩 표시 상태 업데이트 + 커서 복원
  useEffect(() => {
    const current = editorRef.current;
    if (!current) return;

    const selection = saveSelection(); // 커서 위치 저장
    // 브라우저 DOM 파서가 완전히 준비된 다음 안전하게 innerHTML 세팅
    requestAnimationFrame(() => {
      const html = textToHTML(value);
      current.innerHTML = html;
      restoreSelection(selection);
    });
  }, [showNonverbal]);

  //입력 핸들러
  const handleInput = () => {
    if (isComposingRef.current) return;
    const current = editorRef.current;
    if (!current) return;
    const newText = htmlToText(current.innerHTML);
    onChange?.(newText); // 원본 형태로 부모에 전달
  };

  const handleCompositionStart = () => {
    isComposingRef.current = true;
  };
  const handleCompositionEnd = () => {
    isComposingRef.current = false;
    handleInput(); // 조합 종료 시점에만 동기화
  };

  return (
    <div className="CueCard">
      <h3 className="CueCard__keyword">{keyword}</h3>
      <div
        className="CueCard__editor"
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
      />
    </div>
  );
};

export default CueCard;
