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

  if (loading) return <div>Loading...</div>;

  if (!authorized) {
    return role ? <Navigate to="/unauthorized" /> : <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
