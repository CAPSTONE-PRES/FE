export const normalizeTime = (val, min, max, defaultValue = 0) => {
  let num = Number(val);
  if (isNaN(num)) return String(defaultValue).padStart(2, "0");
  if (num < min) num = min;
  if (num > max) num = max;
  return String(num).padStart(2, "0");
};
