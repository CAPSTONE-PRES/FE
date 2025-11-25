import { getStringedDate } from "./get-stringed-date";

export default function getTimeAgo(target) {
  let t = new Date(target);
  let seconds = Math.floor((new Date() - t.getTime()) / 1000);
  if (seconds > 86400) return getStringedDate(t);
  if (seconds > 3600) return Math.floor(seconds / 3600) + "시간 전";
  if (seconds > 60) return Math.floor(seconds / 60) + "분 전";
  return "방금";
}
