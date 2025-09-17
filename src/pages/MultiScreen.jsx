import { useParams } from "react-router-dom";

const MultiScreen = () => {
  const params = useParams();
  return <div>{params.id}번 발표</div>;
};

export default MultiScreen;
