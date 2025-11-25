import "../styles/ContextMenu.css";

const ContextMenu = ({ isVisible, position, items, onClose }) => {
  if (!isVisible) return null;

  return (
    <div
      className="ContextMenu"
      style={{
        position: "fixed",
        top: position.y,
        left: position.x,
        zIndex: 9999,
      }}
    >
      {items.map((item, i) => (
        <div
          key={i}
          className="ContextMenu__item"
          onClick={() => {
            item.onClick?.();
            onClose?.();
          }}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
};

export default ContextMenu;
