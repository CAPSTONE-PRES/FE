import "./App.css";
import { Routes, Route } from "react-router-dom";
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

export const DataContext = createContext();
export const DataDispatchContext = createContext();

const currentUser = {
  id: "u1",
  name: "박민영",
  avatar: "/avatars/user1.svg",
  email: "111@gmail.com",
};

const initialClasses = {
  c1: {
    id: "c1",
    name: "마케팅조사론",
    times: ["월 09:00-10:15", "화 09:00-10:15"],
    lastVisited: "2025-09-20T10:15:00",
    isTeamProject: true,
    owner: currentUser,
    teamMembers: [
      {
        id: "u2",
        name: "김민지",
        avatar: "/avatars/user2.svg",
        email: "222@gmail.com",
      },
    ],
  },
  c2: {
    id: "c2",
    name: "캡스톤디자인1",
    times: ["목 15:00-17:45"],
    lastVisited: "2025-09-19T10:15:00",
    isTeamProject: true,
    owner: {
      id: "u2",
      name: "김민지",
      avatar: "/avatars/user2.svg",
      email: "222@gmail.com",
    },
    teamMembers: [
      {
        id: "u3",
        name: "이호성",
        avatar: "/avatars/user3.svg",
        email: "333@gmail.com",
      },
      {
        id: "u4",
        name: "김소영",
        avatar: "/avatars/user4.svg",
        email: "444@gmail.com",
      },
    ],
  },
  c3: {
    id: "c3",
    name: "이머징마켓경영론",
    times: ["월 15:00-17:45", "수 09:00-10:15"],
    lastVisited: "2025-08-20T10:15:00",
    isTeamProject: false,
    owner: currentUser,
    teamMembers: [],
  },
  c4: {
    id: "c4",
    name: "데이터마이닝기반기업운영",
    times: ["화 15:00-17:45"],
    lastVisited: "2025-09-05T10:15:00",
    isTeamProject: false,
    owner: currentUser,
    teamMembers: [],
  },
  c5: {
    id: "c5",
    name: "캡스톤디자인2",
    times: ["금 15:00-17:45"],
    lastVisited: "2025-09-20T09:15:00",
    isTeamProject: true,
    owner: currentUser,
    teamMembers: [
      {
        id: "u2",
        name: "김민지",
        avatar: "/avatars/user2.svg",
        email: "222@gmail.com",
      },
      {
        id: "u3",
        name: "이호성",
        avatar: "/avatars/user3.svg",
        email: "333@gmail.com",
      },
      {
        id: "u4",
        name: "김소영",
        avatar: "/avatars/user4.svg",
        email: "444@gmail.com",
      },
      {
        id: "u5",
        name: "김현서",
        avatar: "/avatars/user1.svg",
        email: "555@gmail.com",
      },
      {
        id: "u6",
        name: "김승빈",
        avatar: "/avatars/user2.svg",
        email: "666@gmail.com",
      },
    ],
  },
};

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

function classReducer(state, action) {
  let nextState;

  switch (action.type) {
    case "CREATE": {
      nextState = { [action.data.id]: action.data, ...state };
      return nextState;
    }
    default:
      return state;
  }
}

function App() {
  const [classes, classDispatch] = useReducer(classReducer, initialClasses);
  const [presentations, setPresentations] = useState(initialPresentations);
  const [favoriteClassIds, setFavoriteClassIds] = useState(initialFavorites);

  const classIdRef = useRef();

  useEffect(() => {
    const ids = Object.keys(classes).map((id) => Number(id.replace("c", "")));
    let maxClassId = ids.length > 0 ? Math.max(...ids) : 0;
    classIdRef.current = maxClassId + 1;
  }, []);

  const onCreatePresentation = (newPresentation) => {
    setPresentations((prev) => ({
      ...prev,
      [newPresentation.id]: newPresentation,
    }));
  };

  const onCreateClass = (
    name,
    times,
    lastVisited,
    isTeamProject,
    teamMembers
  ) => {
    const newClassId = `c${classIdRef.current++}`;

    classDispatch({
      type: "CREATE",
      data: {
        id: newClassId,
        name,
        times,
        lastVisited,
        isTeamProject,
        owner: currentUser,
        teamMembers,
      },
    });

    return newClassId;
  };

  return (
    <>
      <div>
        <DataContext.Provider
          value={{
            currentUser,
            classes,
            presentations,
            favoriteClassIds,
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
              <Route path="/Presentation/:id" element={<Presentation />} />
              <Route path="/newPresentation" element={<NewPresentation />} />
              <Route path="/storage" element={<Storage />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="*" element={<Notfound />} />
            </Routes>
          </DataDispatchContext.Provider>
        </DataContext.Provider>
      </div>
    </>
  );
}

export default App;
