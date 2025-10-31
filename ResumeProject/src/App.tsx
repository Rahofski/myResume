import { useEffect } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "./App.css";
import MainPage from "./pages/MainPage/MainPage";
import Navigation from "./components/Navigation/Navigation";
import ProjectsPage from "./pages/ProjectPage/ProjectsPage";
import TasksPage from "./pages/TasksPage/TasksPage";
import { Picture } from "./pages/TasksPage/tasks/Picture/Picture";
import { TasksProvider } from "./contexts/TasksContext";
import { FlexBox } from "./pages/TasksPage/tasks/flex-box/flex-box";
import { Footer } from "./components/Footer/Footer";
import { Logo } from "./components/Logo/Logo";

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      return;
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname, hash]);

  return null;
}

function App() {
  return (
    <TasksProvider>
      <Router>
        <ScrollToTop />
        <div className="app">
          <Navigation />
          <div className="container">
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/tasks/picture-task" element={<Picture />} />
              <Route path="/tasks/flexbox-task" element={<FlexBox />} />
            </Routes>
          </div>
          <Footer />
          <Logo />
        </div>
      </Router>
    </TasksProvider>
  );
}

export default App;
