export const getIsEmpty = (v) => {
  if (!v) return true; // null/undefined
  if (Array.isArray(v)) return v.length === 0; // 배열
  if (typeof v === "object") return Object.keys(v).length === 0; // 객체
  return true; // 그 외 타입은 비어있다고 간주
};
