import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Register from "./pages/Register";
import "./App.css";
import CodeEditorPage from "./pages/CodeEditorPage";
import Dashboard from "./components/Dashboard";
import Workspace from "./components/Workspace";
import AiMentorPanel from "./components/AiMentorPanel";
import LaunchAdvisor from "./pages/LaunchAdvisor";
import CareerHub from "./pages/CareerHub";
import MainLayout from "./components/MainLayout";
import ProjectsPage from "./pages/ProjectsPage";
import LaunchAdvisorPage from "./pages/LaunchAdvisorPage";
import Unauthorized from "./pages/Unauthorized";
import PreviewPage from "./pages/PreviewPage";

function App() {
  return (
    <Router>
      <div className="w-full min-h-screen">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/code" element={<CodeEditorPage />} />
          <Route path="/preview" element={<PreviewPage />} />
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* <Route
            path="/dashboard"
            element={
              <ProtectedRoute role="user">
                <Dashboard />
              </ProtectedRoute>
            }
          /> */}
          
          {/* Main application routes with sidebar layout */}
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/workspace/:projectId" element={<Workspace />} />
            <Route path="/mentor" element={
              <div className="h-screen w-full">
                <AiMentorPanel />
              </div>
            } />
            <Route path="/launch-advisor" element={<LaunchAdvisorPage />} />
            <Route path="/launch-advisor/:projectId" element={<LaunchAdvisor />} />
            <Route path="/career-hub" element={<CareerHub />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;