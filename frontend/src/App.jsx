import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/home";
import Register from "./pages/Register";
import "./App.css";
import CodeEditorPage from "./pages/CodeEditorPage";
import Dashboard from "./components/Dashboard";
import Workspace from "./components/Workspace";
import AiMentorPanel from "./components/AiMentorPanel";

function App() {
  return (
    <Router>
      <div className="w-full min-h-screen">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/code" element={<CodeEditorPage />} />
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute role="user">
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          
          {/* New component routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/workspace/:projectId" element={<Workspace />} />
          <Route path="/mentor" element={
            <div className="h-screen w-full">
              <AiMentorPanel />
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;