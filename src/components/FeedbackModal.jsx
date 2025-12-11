import BaseModal from "./BaseModal";
import FeedbackCompact from "./FeedbackCompact"; // 새로 만들 축약 UI

const FeedbackModal = ({ isOpen, onClose, sessionId }) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      header="이전 발표 피드백"
      variant="feedback"
      width="960px"
      height="640px"
    >
      <FeedbackCompact sessionId={sessionId} />
    </BaseModal>
  );
};

export default FeedbackModal;
