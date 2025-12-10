import "../styles/QuestionModal.css";
import BaseModal from "./BaseModal";
import qnaIcon from "../assets/SVG_Presentation/qnaIcon.svg";
import volumeIcon from "../assets/SVG_Presentation/volumeIcon.svg";

const QuestionModal = ({ isOpen, onClose, qna }) => {
  if (!qna) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      header="예상 질문"
      variant="question"
    >
      <div className="QuestionModal__Container">
        <div className="QuestionModal__info">
          <img src={volumeIcon} />
          <p>
            발표 후 랜덤으로 질문이 들어와요. 미리 예상 질문을 보며 발표를
            준비해보세요.
          </p>
        </div>

        <div className="QuestionModal__list">
          {qna.questions?.map((q) => (
            <div className="QuestionModal__item" key={q.questionId}>
              <img src={qnaIcon} />
              <p>{q.questionBody}</p>
            </div>
          ))}
        </div>
      </div>
    </BaseModal>
  );
};

export default QuestionModal;
