import "../styles/SortToggle.css";

const SortToggle = ({ value, onChange, dateType }) => {
  const OPTIONS = [
    { key: "date", label: `${dateType}` },
    { key: "title", label: "제목순" },
  ];

  return (
    <div className="SortToggle" role="radiogroup" aria-label="정렬 기준">
      {OPTIONS.map((opt) => (
        <button
          key={opt.key}
          type="button"
          role="radio"
          aria-checked={value === opt.key}
          className={`sortToggle_btn sortToggle_btn ${
            value === opt.key ? "is-active" : ""
          }`}
          onClick={() => {
            onChange(opt.key);
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
};

export default SortToggle;
