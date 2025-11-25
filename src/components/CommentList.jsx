import { useState } from "react";
import "../styles/CommentList.css";
import CommentItem from "./CommentItem";

const CommentList = ({ comments, onAddReply, onDelete, onUpdate }) => {
  return (
    <div className="CommentList">
      {comments.map((c) => (
        <CommentItem
          key={c.commentId}
          comment={c}
          onAddReply={onAddReply}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
};

export default CommentList;
