import "../styles/HomeHero.css";
import SearchBar from "./SearchBar";
import UpcomingItem from "./UpcomingItem";
import notice_Button from "../assets/SVG_Main/notice_Button.svg";
import { getIsEmpty } from "../util/get-is-empty";
import { getStringedDate } from "../util/get-stringed-date";
import { useContext, useState, useMemo } from "react";
import { DataContext } from "../App";
import HomeCalendar from "./calendars/HomeCalendar";
import { useNavigate } from "react-router-dom";

const today = new Date();
const isSameDay = (a, b) => getStringedDate(a) === getStringedDate(b);

//다가오는 발표 오름차순 정렬
function getUpcomingPresentations(presentations) {
  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  return Object.values(presentations)
    .filter((p) => new Date(p.date) >= startOfToday)
    .toSorted((a, b) => +new Date(a.date) - +new Date(b.date));
}

//dday 카드 발표
function getNearestUpcoming(presentations) {
  return getUpcomingPresentations(presentations)[0] || null;
}

//dday 계산
function daysUntil(targetISO) {
  const target = new Date(targetISO);
  const today = new Date();

  const startOfTarget = new Date(
    target.getFullYear(),
    target.getMonth(),
    target.getDate()
  );
  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  return Math.ceil((startOfTarget - startOfToday) / MS_PER_DAY);
}

//날짜 선택X -> 다가오는 발표 2개(일주일 이내)
function getUpcomingTwo(presentations) {
  return getUpcomingPresentations(presentations)
    .filter(
      (p) =>
        new Date(p.date) <=
        new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7)
    )
    .slice(0, 2);
}

//선택 날짜의 발표
function getDailyTwo(presentations, selectedDate) {
  return Object.values(presentations).filter((p) =>
    isSameDay(new Date(p.date), selectedDate)
  );
}

const HomeHero = () => {
  const nav = useNavigate();
  const { classes, presentations } = useContext(DataContext);
  const [selectedDate, setSelectedDate] = useState(null);

  const { currentUser } = useContext(DataContext);

  const isEmpty = getIsEmpty(presentations) || getIsEmpty(classes);
  const nearestUpcoming = !isEmpty ? getNearestUpcoming(presentations) : null;

  const upcomingTwo = useMemo(() => {
    if (isEmpty) return [];
    if (selectedDate) return getDailyTwo(presentations, selectedDate);
    return getUpcomingTwo(presentations);
  }, [isEmpty, presentations, selectedDate]);

  //발표가 있는 날짜
  const eventDates = useMemo(() => {
    if (isEmpty) return new Set();
    return new Set(
      Object.values(presentations).map((p) => getStringedDate(new Date(p.date)))
    );
  }, [isEmpty, presentations]);

  return (
    <div className="HomeHero">
      <section className="hero-top">
        <div className="hero-greeting">
          <h2>
            <span>{currentUser.name}</span> 님,
            <br />
            이번에는 A+ 받아보세요
          </h2>
        </div>
        <div className="hero-search">
          <SearchBar type={"PRESENTATION"} />
        </div>
      </section>
      <section className="hero-bottom">
        <div className="hero-dday">
          <h3>
            {nearestUpcoming
              ? daysUntil(nearestUpcoming.date) === 0
                ? "D-DAY"
                : `D-${daysUntil(nearestUpcoming.date)}`
              : "발표수업,"}
          </h3>
          <h4>
            {nearestUpcoming
              ? "발표까지 조금만 더 연습해보아요!"
              : "완벽하게 마무리하기 위한 여정"}
          </h4>
          {nearestUpcoming ? (
            <p>
              <time dateTime={nearestUpcoming.date}>
                {getStringedDate(new Date(nearestUpcoming.date))}
              </time>{" "}
              |
              <span className="dday-subject">
                {" "}
                {classes[nearestUpcoming.classId].name}{" "}
              </span>
              {nearestUpcoming.title}
            </p>
          ) : (
            <p>강의별로 자료를 관리하고 발표연습을 통해 완성도를 높여보세요</p>
          )}
          <div className="dday-foot">
            {nearestUpcoming ? <div className="dday-thumb"></div> : null}

            <button
              className="dday-button"
              type="button"
              onClick={() =>
                nearestUpcoming
                  ? nav(`/practice/${nearestUpcoming.id}`)
                  : nav("/newClass")
              }
            >
              <img src={notice_Button} />
              {nearestUpcoming ? "연습하기" : "워크스페이스 만들기"}
            </button>
          </div>
        </div>
        <div className="hero-upcoming">
          <div className="upcoming-list">
            <h3>다가오는 발표</h3>
            {upcomingTwo.length > 0 ? (
              <div className="upcoming-wrapper">
                {upcomingTwo.map((p) => (
                  <UpcomingItem
                    key={p.id}
                    classBadge={classes[p.classId].name}
                    {...p}
                  />
                ))}
              </div>
            ) : (
              <div className="upcoming-empty-message">
                발표 스케줄이 없어요!
              </div>
            )}
          </div>
          <div className="calendar">
            <HomeCalendar
              value={selectedDate}
              onChange={setSelectedDate}
              eventDates={eventDates}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeHero;
