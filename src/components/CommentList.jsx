import { useState } from "react";
import "../styles/CommentList.css";
import CommentItem from "./CommentItem";

const mockComments = [
  {
    id: 1,
    author: "원태인",
    authorProfile: "/avatars/user2.svg",
    role: "You",
    time: "2일 전",
    target: "타당성 분석",
    content: "단어는 괜찮은가요?",
    editable: true,
    replies: [
      {
        id: 101,
        author: "김호석",
        authorProfile: "/avatars/user4.svg",
        role: "You",
        content: "저는 좋은 것 같습니다.",
      },
    ],
  },
  {
    id: 2,
    author: "백정현",
    authorProfile: "/avatars/user1.svg",
    role: "",
    time: "1분 전",
    target: "실행 가능하지",
    content: "'실행여부를'로 바꾸는 것은 어떤가요?",
    replies: [
      {
        id: 102,
        author: "이호성",
        authorProfile: "/avatars/user3.svg",
        role: "",
        content: "저는 좋은 것 같습니다.",
      },
      {
        id: 103,
        author: "원태인",
        authorProfile: "/avatars/user2.svg",
        role: "You",
        content: "좋아요!",
      },
    ],
  },
];

const CommentList = () => {
  const [comments, setComments] = useState(mockComments);

  return (
    <div className="CommentList">
      {comments.map((c) => (
        <CommentItem key={c.id} comment={c} />
      ))}
    </div>
  );
};

export default CommentList;
