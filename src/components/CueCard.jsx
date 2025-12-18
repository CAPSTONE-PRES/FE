import { useEffect, useRef, useState, useMemo } from "react";
import "../styles/CueCard.css";
import ContextMenu from "./ContextMenu";
import CommentInput from "./CommentInput";
import { useContextMenu } from "../hooks/useContextMenu";

const CueCard = ({
  cueId,
  keyword,
  value,
  onChange,
  onBlur,
  onAddComment,
  showNonverbal = true,
  editable = true,
}) => {
  const editorRef = useRef();
  const commentRef = useRef(null);
  const { isVisible, position, handleContextMenu, setIsVisible } =
    useContextMenu();
  const [selectionText, setSelectionText] = useState("");
  const [inputVisible, setInputVisible] = useState(false);

  const isComposingRef = useRef(false);

  //드래그+우클릭 -> 메뉴 표시
  const handleRightClick = (e) => {
    e.preventDefault();
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    if (!selectedText) return;

    setSelectionText(selectedText);
    handleContextMenu(e);
  };

  //CommentInput 표시
  const handleAddCommentClick = () => {
    setIsVisible(false);
    setInputVisible(true);
  };

  //코멘트 submit
  const handleSubmitComment = (content) => {
    onAddComment?.(cueId, content, selectionText);
    setInputVisible(false);
  };

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

  //입력창 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (e) => {
      // 클릭한 요소가 입력창 내부면 무시
      if (commentRef.current && commentRef.current.contains(e.target)) return;
      // 바깥 클릭이면 닫기
      setInputVisible(false);
    };

    if (inputVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [inputVisible]);

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

  const menuItems = useMemo(
    () => [{ label: "댓글 추가", onClick: handleAddCommentClick }],
    []
  );

  return (
    <div className="CueCard" onContextMenu={handleRightClick}>
      <h3 className="CueCard__keyword">{keyword}</h3>
      <div
        className="CueCard__editor"
        ref={editorRef}
        contentEditable={editable}
        suppressContentEditableWarning
        onInput={editable ? handleInput : undefined}
        onBlur={
          editable
            ? () => {
                const newText = htmlToText(editorRef.current.innerHTML);
                onBlur?.(newText);
              }
            : undefined
        }
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (!editable) e.preventDefault(); // 키 입력 차단
          e.stopPropagation();
        }}
        onCompositionStart={editable ? handleCompositionStart : undefined}
        onCompositionEnd={editable ? handleCompositionEnd : undefined}
      />

      {/* 우클릭 메뉴 */}
      <ContextMenu
        isVisible={isVisible}
        position={position}
        items={menuItems}
        onClose={() => setIsVisible(false)}
      />

      {/* 댓글 입력창 */}
      {inputVisible && (
        <div
          ref={commentRef}
          className="CueCard__comment-input-wrapper"
          style={{
            position: "fixed",
            top: position.y + 15,
            left: position.x - 50,
            zIndex: 9999,
          }}
        >
          <CommentInput
            placeholder="Comment..."
            onSubmit={handleSubmitComment}
          />
        </div>
      )}
    </div>
  );
};

export default CueCard;
