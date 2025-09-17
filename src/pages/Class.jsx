import { useParams } from "react-router-dom";

const Class = () => {
  const params = useParams();
  return <div>{params.id}번 클래스</div>;
};

export default Class;
