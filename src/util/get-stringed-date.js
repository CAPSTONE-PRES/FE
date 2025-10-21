export const getStringedDate = (targetDate, withTime = false) => {
  let year = targetDate.getFullYear();
  let month = targetDate.getMonth() + 1;
  let date = targetDate.getDate();
  let hour = targetDate.getHours();
  let minute = targetDate.getMinutes();

  if (month < 10) {
    month = `0${month}`;
  }
  if (date < 10) {
    date = `0${date}`;
  }
  if (hour < 10) {
    hour = `0${hour}`;
  }
  if (minute < 10) {
    minute = `0${minute}`;
  }

  if (withTime) {
    return `${year}.${month}.${date} ${hour}:${minute}`;
  } else {
    return `${year}.${month}.${date}`;
  }
};
