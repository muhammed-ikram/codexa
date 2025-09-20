import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const UserDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/auth/profile");
        setData(res.data.user);
      } catch (err) {
        console.error("Error fetching profile data:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>{data ? `Hello ${data.username}` : "Loading..."}</h1>
    </div>
  );
};

export default UserDashboard;
