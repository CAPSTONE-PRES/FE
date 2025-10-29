import { useState } from "react";
import "../styles/CommentItem.css";
import ReplyItem from "./ReplyItem";
import CommentInput from "./CommentInput";
import verticalLine from "../assets/SVG_Presentation/verticalLine.svg";

const CommentItem = ({ comment }) => {
  const [showAllReplies, setShowAllReplies] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  const repliesToShow = showAllReplies
    ? comment.replies
    : comment.replies.slice(0, 1);

  return (
    <div
      className={`CommentItem ${isReplying ? "replying" : ""}`}
      onClick={() => setIsReplying(!isReplying)}
    >
      <div className="CommentItem__comment">
        <div className="CommentItem__header">
          <div className="CommentItem__author">
            <img src={comment.authorProfile} />
            {comment.author}
            {comment.role && (
              <span className="CommentItem__role">({comment.role})</span>
            )}
          </div>
          <div className="CommentItem__meta">
            {comment.editable && isReplying ? (
              <>
                <button className="CommentItem__action">수정</button>
                <img src={verticalLine} />
                <button className="CommentItem__action">삭제</button>
              </>
            ) : (
              <span className="CommentItem__time">{comment.time}</span>
            )}
          </div>
        </div>

        <div className="CommentItem__target">{comment.target}</div>
        <p className="CommentItem__content">{comment.content}</p>
      </div>

      {isReplying && (
        <CommentInput
          placeholder="의견 달기.."
          onSubmit={(text) => console.log(`답글 내용: ${text}`)}
        />
      )}

      {comment.replies?.length > 0 && (
        <div className="CommentItem__replies">
          {repliesToShow.map((r) => (
            <ReplyItem key={r.id} reply={r} />
          ))}
          {comment.replies.length > 1 && (
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
