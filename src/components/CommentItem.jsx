import "../styles/CommentItem.css";
import ReplyItem from "./ReplyItem";

const CommentItem = ({ comment }) => {
  return (
    <div className="CommentItem">
      <div className="CommentItem__header">
        <div className="CommentItem__author">
          <img src={comment.authorProfile} />
          {comment.author}
          {comment.role && (
            <span className="CommentItem__role">({comment.role})</span>
          )}
        </div>
        <div className="CommentItem__meta">{comment.time}</div>
      </div>

      <div className="CommentItem__target">{comment.target}</div>
      <p className="CommentItem__content">{comment.content}</p>
    </div>
  );
};

export default CommentItem;
