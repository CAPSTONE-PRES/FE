import "./App.css";
import api from "./api";
import { Routes, Route, data } from "react-router-dom";
import { useReducer, createContext, useState, useRef, useEffect } from "react";
import Home from "./pages/Home";
import Presentation from "./pages/Presentation";
import ClassHome from "./pages/ClassHome";
import NewClass from "./pages/NewClass";
import Class from "./pages/Class";
import Notfound from "./pages/Notfound";
import Storage from "./pages/Storage";
import Settings from "./pages/Settings";

import Feedback from "./pages/Feedback";
import user1 from "./assets/SVG_Main/user/user1.svg";
import user2 from "./assets/SVG_Main/user/user2.svg";
import user3 from "./assets/SVG_Main/user/user3.svg";
import user4 from "./assets/SVG_Main/user/user4.svg";


import NewPresentation from "./pages/NewPresentation";
import { mapClasses } from "./util/mapClasses";
import { mapPresentations } from "./util/mapPresentations";
import { mapUser } from "./util/mapUser";
import { LoadingProvider } from "./contexts/LoadingContext";
import PracticeMode from "./pages/PracticeMode";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ResetPassword from "./pages/ResetPassword";
import MobileCueCard from "./pages/MobileCueCard";

export const DataContext = createContext();
export const DataDispatchContext = createContext();

// const currentUser = {
//   id: "",
//   name: "박민영",
//   avatar: "/avatars/user1.svg",
//   email: "111@gmail.com",
// };

const initialPresentations = {
  p1: {
    id: "p1",
    classId: "c1",
    title: "타당석 분석_기말발표",
    date: "2025-06-16",
    time: "14:00",
    limitTime: { minute: 7, second: 0 },
    presenter: "이호성",
    lastVisited: "2025-08-24T10:10:00",
  },
  p2: {
    id: "p2",
    classId: "c1",
    title: "타당석 분석_중간발표",
    date: "2025-08-22",
    time: "14:00",
    limitTime: { minute: 5, second: 0 },
    presenter: "이호성",
    lastVisited: "2025-08-02T10:10:00",
  },
  p3: {
    id: "p3",
    classId: "c2",
    title: "캡스톤 중간발표",
    date: "2025-10-16",
    time: "15:00",
    limitTime: { minute: 10, second: 0 },
    presenter: "김땡땡",
    lastVisited: "2025-07-02T10:10:00",
  },
  p4: {
    id: "p4",
    classId: "c3",
    title: "이머징마켓 발표",
    date: "2025-10-19",
    time: "14:00",
    limitTime: { minute: 7, second: 0 },
    presenter: "박땡떙",
    lastVisited: "2025-09-14T20:10:00",
  },
  p5: {
    id: "p5",
    classId: "c4",
    title: "데이터마이닝 발표",
    date: "2025-09-20",
    time: "11:00",
    limitTime: { minute: 8, second: 0 },
    presenter: "박땡떙",
    lastVisited: "2025-09-02T21:10:00",
  },
  p6: {
    id: "p6",
    classId: "c4",
    title: "데이터마이닝 발표",
    date: "2025-09-26",
    time: "09:00",
    limitTime: { minute: 5, second: 0 },
    presenter: "박땡떙",
    lastVisited: "2025-09-04T21:10:00",
  },
  p7: {
    id: "p7",
    classId: "c4",
    title: "데이터베이스 발표",
    date: "2025-09-14",
    time: "16:00",
    limitTime: { minute: 5, second: 0 },
    presenter: "박땡떙",
    lastVisited: "2025-09-05T21:10:00",
  },
  p8: {
    id: "p8",
    classId: "c5",
    title: "데이터분석 발표",
    date: "2025-09-30",
    time: "12:00",
    limitTime: { minute: 5, second: 0 },
    presenter: "박땡떙",
    lastVisited: "2025-09-06T21:10:00",
  },
  p9: {
    id: "p9",
    classId: "c5",
    title: "데이터수집 발표",
    date: "2025-09-23",
    time: "13:00",
    limitTime: { minute: 15, second: 0 },
    presenter: "박땡떙",
    lastVisited: "2025-09-13T21:10:00",
  },
};

const initialFavorites = ["c1", "c2", "c3", "c5"];

const beRes = [
  {
    projectId: 1,
    date: "2025-10-16",
    projectTitle: "타당성 분석_중간발표",
    workspaceId: 1,
    workspaceName: "프로그래밍기초",
    presenterName: "yujin",
    presenterProfileUrl: "/avatars/user2.svg",
    lastVisited: "2025-08-24T10:10:00",
  },

  {
    projectId: 2,
    date: "2025-11-16",
    projectTitle: "타당성 분석_기말발표",
    workspaceId: 2,
    workspaceName: "프로그래밍심화",
    presenterName: "yujin",
    presenterProfileUrl: "/avatars/user2.svg",
    lastVisited: "2025-09-24T10:10:00",
  },
];

function classReducer(state, action) {
  let nextState;

  switch (action.type) {
    case "INIT":
      return action.data;
    case "CREATE": {
      nextState = { [action.data.id]: action.data, ...state };
      return nextState;
    }
    default:
      return state;
  }
}

function App() {
  const [classes, classDispatch] = useReducer(classReducer, {});
  const [presentations, setPresentations] = useState({});
  const [favoriteClassIds, setFavoriteClassIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  const classIdRef = useRef();

  useEffect(() => {
    async function initData() {
      try {
        const [classRes, presRes, userRes] = await Promise.all([
          api.get("/workspace/projects/list/tmp?type=1"),
          api.get("/list/tmp?type=1"),
          api.get("/user/me"),
        ]);

        console.log("class 응답:", classRes.data);
        const mappedClasses = mapClasses(classRes.data);
        classDispatch({ type: "INIT", data: mappedClasses });

        console.log("pres 응답:", presRes.data);
        const mappedPres = mapPresentations(presRes.data);
        console.log("presentation: ", mappedPres);
        setPresentations(mappedPres);

        console.log("user 응답:", userRes.data);
        const mappedUser = mapUser(userRes.data);
        setCurrentUser(mappedUser);
        console.log(currentUser);
      } catch (err) {
        console.error("데이터 초기화 실패: ", err);
      } finally {
        setLoading(false);
      }
    }

    initData();
  }, []);

  console.log("currentUser: ", currentUser);

  const onCreatePresentation = (newPresentation) => {
    setPresentations((prev) => ({
      ...prev,
      [newPresentation.id]: newPresentation,
    }));
  };

  const onCreateClass = (id, name, times, isTeamProject, teamMembers) => {
    classDispatch({
      type: "CREATE",
      data: {
        id,
        name,
        times,
        isTeamProject,
        owner: currentUser,
        teamMembers,
      },
    });
  };

  return (
    <>
      <DataContext.Provider
        value={{
          currentUser,
          classes,
          presentations,
          favoriteClassIds,
          loading,
          setFavoriteClassIds,
        }}
      >
        <DataDispatchContext.Provider
          value={{ onCreateClass, onCreatePresentation }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/class/:id" element={<Class />} />
            <Route path="/classHome" element={<ClassHome />} />
            <Route path="/newClass" element={<NewClass />} />
            <Route path="/presentation/:id" element={<Presentation />} />
            <Route path="/practice/:id" element={<PracticeMode />} />
            <Route path="/newPresentation" element={<NewPresentation />} />
            <Route path="/storage" element={<Storage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="*" element={<Notfound />} />
          </Routes>
        </DataDispatchContext.Provider>
      </DataContext.Provider>
    </>
  );
}

export default App;
