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
import Storage from "./pages/Storage";
import Settings from "./pages/Settings";
import Feedback from "./pages/Feedback";
import NewPresentation from "./pages/NewPresentation";
import PracticeMode from "./pages/PracticeMode";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ResetPassword from "./pages/ResetPassword";
import MobileCueCard from "./pages/MobileCueCard";
import { getFavWorkspaces } from "./api/workspaceApi";
import DesktopLayout from "./layouts/DesktopLayout";
import { AuthContext } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { api } from "./api/api";

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
        <Routes>
          <Route
            path="/"
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
              <DesktopLayout>
                <Class />
              </DesktopLayout>
            }
          />
          <Route
            path="/classHome"
            element={
              <DesktopLayout>
                <ClassHome />
              </DesktopLayout>
            }
          />
          <Route
            path="/newClass"
            element={
              <DesktopLayout>
                <NewClass />
              </DesktopLayout>
            }
          />
          <Route
            path="/presentation/:id"
            element={
              <DesktopLayout>
                <Presentation />
              </DesktopLayout>
            }
          />
          <Route
            path="/practice/:id"
            element={
              <DesktopLayout>
                <PracticeMode />
              </DesktopLayout>
            }
          />
          <Route
            path="/newPresentation"
            element={
              <DesktopLayout>
                <NewPresentation />
              </DesktopLayout>
            }
          />
          <Route
            path="/storage"
            element={
              <DesktopLayout>
                <Storage />
              </DesktopLayout>
            }
          />
          <Route
            path="/settings"
            element={
              <DesktopLayout>
                <Settings />
              </DesktopLayout>
            }
          />
          <Route
            path="/feedback/:sessionId"
            element={
              <DesktopLayout>
                <Feedback />
              </DesktopLayout>
            }
          />
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/" replace />
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
          <Route path="/mobile-cuecard/:slug" element={<MobileCueCard />} />
          <Route path="/kakao/callback" element={<KakaoCallback />} />
        </Routes>
      </DataContext.Provider>
    </>
  );
}

export default App;
