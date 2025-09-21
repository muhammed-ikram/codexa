import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../utils/api";

const ProtectedRoute = ({ children, role }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/profile");
        const user = res.data.user;

        if (role && user.role !== role) {
          setAuthorized(false);
        } else {
          setAuthorized(true);
        }
      } catch (err) {
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [role]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-300">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return role ? <Navigate to="/unauthorized" /> : <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;