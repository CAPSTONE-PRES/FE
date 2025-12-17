import { useRef } from "react";
import BaseModal from "./BaseModal";
import Feedback from "../pages/Feedback";

const FeedbackModal = ({ isOpen, onClose, sessionId }) => {
  const scrollRef = useRef(null);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      header="이전 발표 피드백"
      variant="feedback"
      width="960px"
      height="640px"
    >
      <div ref={scrollRef} style={{ height: "100%", overflowY: "auto" }}>
        <Feedback
          sessionId={sessionId}
          mode="modal"
          scrollContainerRef={scrollRef}
        />
      </div>
    </BaseModal>
  );
};

export default FeedbackModal;
