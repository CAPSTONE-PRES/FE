import "../styles/ReplyItem.css";
import replyIcon from "../assets/SVG_Presentation/replyIcon.svg";
import { useContext } from "react";
import { DataContext } from "../App";

const ReplyItem = ({ reply }) => {
  const { currentUser } = useContext(DataContext);

  return (
    <div className="ReplyItem">
      <img src={replyIcon} className="ReplyItem__icon" />
      <div className="ReplyItem__content-wrap">
        <div className="ReplyItem__author">
          <img src={reply.authorProfileImageUrl} />
          {reply.authorName}{" "}
          {reply.authorUserId === currentUser.id && (
            <span className="ReplyItem__role">(YOU)</span>
          )}
        </div>
        <div className="ReplyItem__content">{reply.content}</div>
      </div>
    </div>
  );
};

export default ReplyItem;
