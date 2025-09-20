import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/home";
import Register from "./pages/Register";
import "./App.css";
import CodeEditorPage from "./pages/CodeEditorPage";

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/code" element={<CodeEditorPage/>} />
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
      </Routes>
    </Router>
  );
}

export default App;
