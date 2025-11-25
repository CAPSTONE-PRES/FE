import "../styles/SlideOverviewModal.css";
import BaseModal from "./BaseModal";

const SlideOverviewModal = ({ isOpen }) => {
  return (
    <div>
      <BaseModal isOpen={isOpen} />
    </div>
  );
};

export default SlideOverviewModal;
