import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useContext, createContext, useState } from "react";
import Home from "./pages/Home";
import MultiScrren from "./pages/MultiScreen";
import ClassHome from "./pages/ClassHome";
import Class from "./pages/Class";
import Notfound from "./pages/Notfound";
import Storage from "./pages/Storage";
import Settings from "./pages/Settings";
import Login from "./pages/Login";

export const DataContext = createContext();

const initialClasses = {
  c1: {
    id: "c1",
    name: "마케팅조사론",
    times: ["월 09:00-10:15", "화 09:00-10:15"],
  },
  c2: { id: "c2", name: "캡스톤디자인1", times: ["목 15:00-17:45"] },
  c3: {
    id: "c3",
    name: "이머징마켓경영론",
    times: ["월 15:00-17:45", "수 09:00-10:15"],
  },
  c4: { id: "c4", name: "데이터마이닝기반기업운영", times: ["화 15:00-17:45"] },
  c5: { id: "c5", name: "캡스톤디자인2", times: ["금 15:00-17:45"] },
};

const initialPresentations = {
  p1: {
    id: "p1",
    classId: "c1",
    title: "타당석 분석_기말발표",
    date: "2025-06-16",
    presenter: "이호성",
    lastPracticedAt: "2025-08-24T10:10:00",
  },
  p2: {
    id: "p2",
    classId: "c1",
    title: "타당석 분석_중간발표",
    date: "2025-08-22",
    presenter: "이호성",
    lastPracticedAt: "2025-08-02T10:10:00",
  },
  p3: {
    id: "p3",
    classId: "c2",
    title: "캡스톤 중간발표",
    date: "2025-10-16",
    presenter: "김땡땡",
    lastPracticedAt: "2025-07-02T10:10:00",
  },
  p4: {
    id: "p4",
    classId: "c3",
    title: "이머징마켓 발표",
    date: "2025-10-19",
    presenter: "박땡떙",
    lastPracticedAt: "2025-09-14T20:10:00",
  },
  p5: {
    id: "p5",
    classId: "c4",
    title: "데이터마이닝 발표",
    date: "2025-09-20",
    presenter: "박땡떙",
    lastPracticedAt: "2025-09-02T21:10:00",
  },
  p6: {
    id: "p6",
    classId: "c4",
    title: "데이터마이닝 발표",
    date: "2025-09-26",
    presenter: "박땡떙",
    lastPracticedAt: "2025-09-04T21:10:00",
  },
  p7: {
    id: "p7",
    classId: "c4",
    title: "데이터베이스 발표",
    date: "2025-09-14",
    presenter: "박땡떙",
    lastPracticedAt: "2025-09-05T21:10:00",
  },
  p8: {
    id: "p8",
    classId: "c5",
    title: "데이터분석 발표",
    date: "2025-09-30",
    presenter: "박땡떙",
    lastPracticedAt: "2025-09-06T21:10:00",
  },
  p9: {
    id: "p9",
    classId: "c5",
    title: "데이터수집 발표",
    date: "2025-09-23",
    presenter: "박땡떙",
    lastPracticedAt: "2025-09-13T21:10:00",
  },
};

const initialFavorites = ["c1", "c2", "c3", "c5"];

function App() {
  const [classes, setClasses] = useState(initialClasses);
  const [presentations, setPresentations] = useState(initialPresentations);
  const [favoriteClassIds, setFavoriteClassIds] = useState(initialFavorites);

  return (
    <>
      <div>
        <DataContext.Provider
          value={{
            classes,
            presentations,
            favoriteClassIds,
            setFavoriteClassIds,
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/class/:id" element={<Class />} />
            <Route path="/classHome" element={<ClassHome />} />
            <Route path="/multiScreen/:id" element={<MultiScrren />} />
            <Route path="/storage" element={<Storage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Notfound />} />
          </Routes>
        </DataContext.Provider>
      </div>
    </>
  );
}

export default App;
