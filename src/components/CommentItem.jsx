import { useContext, useEffect, useRef, useState } from "react";
import "../styles/CommentItem.css";
import ReplyItem from "./ReplyItem";
import ReplyInput from "./ReplyInput";
import verticalLine from "../assets/SVG_Presentation/verticalLine.svg";
import { DataContext } from "../App";
import getTimeAgo from "../util/get-time-ago";

const CommentItem = ({ comment, onAddReply, onDelete, onUpdate }) => {
  const [showAllReplies, setShowAllReplies] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(comment.content);
  const editRef = useRef(null);
  const { currentUser } = useContext(DataContext);

  const repliesToShow = showAllReplies
    ? comment.replies
    : comment.replies.slice(0, 1);

  // const repliesToShow = comment.replies;

  const handleSubmitReply = (content) => {
    onAddReply?.(comment.commentId, content);
    setShowAllReplies(true);
  };

  const handleEditSubmit = () => {
    if (!editValue.trim()) return;
    onUpdate?.(comment.commentId, editValue, comment.location);
    setIsEditing(false);
  };

  useEffect(() => {
    if (isEditing && editRef.current) {
      editRef.current.focus();

      //커서를 맨 뒤로 이동
      const length = editRef.current.value.length;
      editRef.current.setSelectionRange(length, length);
    }
  }, [isEditing]);

  useEffect(() => {
    const textarea = editRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [editValue, isEditing]);

  return (
    <div
      className={`CommentItem ${isReplying ? "replying" : ""}`}
      onClick={() => setIsReplying(!isReplying)}
    >
      <div className="CommentItem__comment">
        <div className="CommentItem__header">
          <div className="CommentItem__author">
            <img src={comment.authorProfileImageUrl} />
            {comment.authorName}
            {comment.authorUserId === currentUser.id && (
              <span className="CommentItem__role">(YOU)</span>
            )}
          </div>
          <div className="CommentItem__meta">
            {comment.editable && isReplying ? (
              <>
                {isEditing ? (
                  <>
                    <button
                      className="CommentItem__action"
                      onClick={handleEditSubmit}
                    >
                      저장
                    </button>
                    <img src={verticalLine} />
                    <button
                      className="CommentItem__action"
                      onClick={() => setIsEditing(false)}
                    >
                      취소
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="CommentItem__action"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsEditing(true);
                      }}
                    >
                      수정
                    </button>
                    <img src={verticalLine} />
                    <button
                      className="CommentItem__action"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete?.(comment.commentId);
                      }}
                    >
                      삭제
                    </button>
                  </>
                )}
              </>
            ) : (
              <span className="CommentItem__time">
                {getTimeAgo(comment.createdAt)}
              </span>
            )}
          </div>
        </div>

        <div className="CommentItem__target">{comment.location}</div>
        {isEditing ? (
          <textarea
            ref={editRef}
            className="CommentItem__edit-input"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              e.stopPropagation();

              // 조합 중(한글 입력 등)에는 Enter 무시
              if (e.nativeEvent.isComposing) return;

              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                const trimmed = editValue.trim();
                if (!trimmed) return;
                onUpdate?.(comment.commentId, trimmed, comment.location);
                setIsEditing(false);
              }
            }}
            rows={1}
          />
        ) : (
          <p className="CommentItem__content">{comment.content}</p>
        )}
      </div>

      {isReplying && (
        <ReplyInput placeholder="의견 달기.." onSubmit={handleSubmitReply} />
      )}

      {comment.replies?.length > 0 && (
        <div className="CommentItem__replies">
          {repliesToShow.map((r) => (
            <ReplyItem key={r.commentId} reply={r} />
          ))}
          {comment.replies?.length > 1 && (
            <button
              className="CommentItem__more"
              onClick={(e) => {
                e.stopPropagation();
                setShowAllReplies(!showAllReplies);
              }}
            >
              {showAllReplies ? "접기" : "더보기"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
