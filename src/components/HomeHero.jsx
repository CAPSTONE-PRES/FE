import "../styles/HomeHero.css";
import SearchBar from "./SearchBar";
import UpcomingItem from "./UpcomingItem";
import notice_Button from "../assets/SVG_Main/notice_Button.svg";
import { getIsEmpty } from "../util/get-is-empty";
import { getStringedDate } from "../util/get-stringed-date";
import { useContext, useState, useMemo, useEffect } from "react";
import { DataContext } from "../App";
import HomeCalendar from "./calendars/HomeCalendar";
import { useNavigate } from "react-router-dom";
import {
  getAllProjects,
  getNextProject,
  getProjectsByDate,
} from "../api/projectApi";
import { getIsoDateString } from "../util/getIsoDateString";

const today = new Date();
const isSameDay = (a, b) => getStringedDate(a) === getStringedDate(b);

//dday 계산
function daysUntil(targetISO) {
  const target = new Date(targetISO);
  const now = new Date();

  const startOfTarget = new Date(
    target.getFullYear(),
    target.getMonth(),
    target.getDate()
  );
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  return Math.ceil((startOfTarget - startOfToday) / MS_PER_DAY);
}

const HomeHero = () => {
  const nav = useNavigate();
  const { currentUser } = useContext(DataContext);
  // const { classes, presentations } = useContext(DataContext);

  const [allProjects, setAllProjects] = useState([]);
  const [dailyProjects, setDailyProjects] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [nearestUpcoming, setNearestUpcoming] = useState(null);

  //전체 프로젝트 불러오기
  useEffect(() => {
    const fetchAllProjects = async () => {
      try {
        const data = await getAllProjects();
        setAllProjects(data);
      } catch (err) {
        console.error("전체 프로젝트 불러오기 실패:", err);
      }
    };
    fetchAllProjects();
  }, []);

  //가장 가까운 발표 불러오기
  useEffect(() => {
    const fetchNext = async () => {
      try {
        const data = await getNextProject();
        setNearestUpcoming(data);
      } catch (err) {
        console.error("nextProject 불러오기 실패:", err);
      }
    };

    fetchNext();
  }, []);

  //선택한 날짜의 프로젝트 가져오기
  useEffect(() => {
    if (!selectedDate) {
      setDailyProjects([]);
      return;
    }

    const fetchDaily = async () => {
      try {
        const data = await getProjectsByDate(getIsoDateString(selectedDate));
        setDailyProjects(data);
      } catch (err) {
        console.error("데일리 프로젝트 불러오기 실패:".err);
      }
    };

    fetchDaily();
  }, [selectedDate]);

  //가장 가까운 발표 찾기
  // const nearestUpcoming = useMemo(() => {
  //   if (!allProjects.length) return null;
  //   const todayStart = new Date(
  //     today.getFullYear(),
  //     today.getMonth(),
  //     today.getDate()
  //   );
  //   const upcoming = allProjects
  //     .filter((p) => new Date(p.date) >= todayStart)
  //     .sort((a, b) => new Date(a.date) - new Date(b.date));
  //   return upcoming[0] || null;
  // }, [allProjects]);

  //다가오는 발표
  const upcomingTwo = useMemo(() => {
    if (selectedDate) return dailyProjects;

    const oneWeekLater = new Date(today);
    oneWeekLater.setDate(today.getDate() + 7);
    return allProjects
      .filter(
        (p) => new Date(p.date) >= today && new Date(p.date) <= oneWeekLater
      )
      .slice(0, 2);
  }, [allProjects, dailyProjects, selectedDate]);

  //발표가 있는 날짜
  const eventDates = useMemo(() => {
    return new Set(allProjects.map((p) => getStringedDate(new Date(p.date))));
  }, [allProjects]);

  return (
    <div className="HomeHero">
      <section className="hero-top">
        <div className="hero-greeting">
          <h2>
            <span>{currentUser.username}</span> 님,
            <br />
            이번에는 A+ 받아보세요
          </h2>
        </div>
        <div className="hero-search">
          <SearchBar />
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
                {nearestUpcoming.workspaceName}{" "}
              </span>
              {nearestUpcoming.projectTitle}
            </p>
          ) : (
            <p>강의별로 자료를 관리하고 발표연습을 통해 완성도를 높여보세요</p>
          )}
          <div className="dday-foot">
            {nearestUpcoming ? (
              <div
                className="dday-thumb"
                style={{
                  backgroundImage: `url("${nearestUpcoming.thumbnail}")`,
                }}
              ></div>
            ) : null}

            <button
              className="dday-button"
              type="button"
              onClick={() =>
                nearestUpcoming
                  ? nav(`/practice/${nearestUpcoming.projectId}`)
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
                    key={p.projectId}
                    id={p.projectId}
                    classBadge={p.workspaceName}
                    title={p.projectTitle}
                    date={p.date}
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
