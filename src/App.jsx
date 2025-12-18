import "./App.css";
import { Routes, Route, data, Navigate } from "react-router-dom";
import { createContext, useState, useEffect, useContext } from "react";
import KakaoCallback from "./pages/KakaoCallback";
import Home from "./pages/Home";
import Presentation from "./pages/Presentation";
import ClassHome from "./pages/ClassHome";
import NewClass from "./pages/NewClass";
import Class from "./pages/Class";
import Notfound from "./pages/Notfound";
import Settings from "./pages/Settings";
import Feedback from "./pages/Feedback";
import NewPresentation from "./pages/NewPresentation";
import PracticeMode from "./pages/PracticeMode";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import InsufficientPage from "./pages/InsufficientPage";
import ResetPassword from "./pages/ResetPassword";
import MobileCueCard from "./pages/MobileCueCard";
import { getFavWorkspaces } from "./api/workspaceApi";
import DesktopLayout from "./layouts/DesktopLayout";
import { AuthContext } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";

import { api } from "./api/api";
import { MicPermissionProvider } from "./contexts/MicPermissionContext";

export const DataContext = createContext();

// function classReducer(state, action) {
//   let nextState;

//   switch (action.type) {
//     case "INIT":
//       return action.data;
//     case "CREATE": {
//       nextState = { [action.data.id]: action.data, ...state };
//       return nextState;
//     }
//     default:
//       return state;
//   }
// }

function App() {
  // const [classes, classDispatch] = useReducer(classReducer, {});
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  const { isAuthenticated } = useContext(AuthContext);

  const hasVisited = () => localStorage.getItem("pres_has_visited") === "true";

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const [userRes, favRes] = await Promise.all([
          api.get("/user/me"),
          getFavWorkspaces(),
        ]);
        setCurrentUser(userRes.data);

        const favIds = favRes.map((w) => w.workspaceId);
        setFavoriteIds(favIds);
      } catch (err) {
        console.error("초기 데이터 불러오기 실패: ", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  console.log("currentUser: ", currentUser);

  // const onCreatePresentation = (newPresentation) => {
  //   setPresentations((prev) => ({
  //     ...prev,
  //     [newPresentation.id]: newPresentation,
  //   }));
  // };

  // const onCreateClass = (id, name, times, isTeamProject, teamMembers) => {
  //   classDispatch({
  //     type: "CREATE",
  //     data: {
  //       id,
  //       name,
  //       times,
  //       isTeamProject,
  //       owner: currentUser,
  //       teamMembers,
  //     },
  //   });
  // };

  if (loading) {
    return <div></div>;
  }

  return (
    <>
      <DataContext.Provider
        value={{
          currentUser,
          favoriteIds,
          setFavoriteIds,
        }}
      >
        <MicPermissionProvider>
          <Routes>
            <Route
              path="/entry"
              element={
                hasVisited() ? (
                  isAuthenticated ? (
                    <Navigate to="/home" replace />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                ) : (
                  <Landing />
                )
              }
            />

            <Route path="/" element={<Navigate to="/entry" replace />} />

            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <DesktopLayout>
                    <Home />
                  </DesktopLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/class/:id"
              element={
                <ProtectedRoute>
                  <DesktopLayout>
                    <Class />
                  </DesktopLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/classHome"
              element={
                <ProtectedRoute>
                  <DesktopLayout>
                    <ClassHome />
                  </DesktopLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/newClass"
              element={
                <ProtectedRoute>
                  <DesktopLayout>
                    <NewClass />
                  </DesktopLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/presentation/:id"
              element={
                <ProtectedRoute>
                  <DesktopLayout>
                    <Presentation />
                  </DesktopLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/practice/:id"
              element={
                <ProtectedRoute>
                  <DesktopLayout>
                    <PracticeMode />
                  </DesktopLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/newPresentation"
              element={
                <ProtectedRoute>
                  <DesktopLayout>
                    <NewPresentation />
                  </DesktopLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <DesktopLayout>
                    <Settings />
                  </DesktopLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/feedback/:sessionId"
              element={
                <ProtectedRoute>
                  <DesktopLayout>
                    <Feedback />
                  </DesktopLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/home" replace />
                ) : (
                  <DesktopLayout>
                    <Login />
                  </DesktopLayout>
                )
              }
            />
            <Route
              path="/signup"
              element={
                <DesktopLayout>
                  <Signup />
                </DesktopLayout>
              }
            />
            <Route
              path="*"
              element={
                <DesktopLayout>
                  <Notfound />
                </DesktopLayout>
              }
            />
            <Route
              path="/insufficient"
              element={
                <ProtectedRoute>
                  <DesktopLayout>
                    <InsufficientPage />
                  </DesktopLayout>
                </ProtectedRoute>
              }
            />

            <Route path="/mobile-cuecard/:slug" element={<MobileCueCard />} />
            <Route path="/kakao/callback" element={<KakaoCallback />} />
          </Routes>
        </MicPermissionProvider>
      </DataContext.Provider>
    </>
  );
}

export default App;
