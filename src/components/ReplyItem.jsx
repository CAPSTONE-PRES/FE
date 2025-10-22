import "../styles/ReplyItem.css";
import replyIcon from "../assets/SVG_Presentation/replyIcon.svg";

const ReplyItem = ({ reply }) => {
  return (
    <div className="ReplyItem">
      <img src={replyIcon} className="ReplyItem__icon" />
      <div className="ReplyItem__content-wrap">
        <div className="ReplyItem__author">
          <img src={reply.authorProfile} />
          {reply.author}{" "}
          {reply.role && (
            <span className="ReplyItem__role">({reply.role})</span>
          )}
        </div>
        <div className="ReplyItem__content">{reply.content}</div>
      </div>
    </div>
  );
};

export default ReplyItem;
