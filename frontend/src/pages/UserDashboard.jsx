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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
      <div className="max-w-6xl mx-auto animate-fade-in">
        <h1 className="text-4xl font-bold mb-2">
          {data ? `Hello, ${data.username}` : "Loading..."}
        </h1>
        <p className="text-gray-400 text-xl mb-12">Welcome to your personalized dashboard</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Stats Cards */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700 shadow-xl animate-slide-up">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">Projects</h3>
            <p className="text-3xl font-bold text-blue-400">5</p>
            <p className="text-gray-400 mt-2">Active projects</p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700 shadow-xl animate-slide-up">
            <div className="text-4xl mb-4">📈</div>
            <h3 className="text-xl font-semibold mb-2">Progress</h3>
            <p className="text-3xl font-bold text-green-400">78%</p>
            <p className="text-gray-400 mt-2">Average completion</p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700 shadow-xl animate-slide-up">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold mb-2">Achievements</h3>
            <p className="text-3xl font-bold text-yellow-400">12</p>
            <p className="text-gray-400 mt-2">Badges earned</p>
          </div>
        </div>
      </div>
      {/* Footer */}
      <div className="mt-16 text-center text-gray-500 text-sm">
        <p className="mb-2">
          <span className="font-medium text-gray-400 italic">CodeXA - for the engineers, by the engineers</span>
        </p>
        <p>© 2025 CodeXA. All rights reserved.</p>
      </div>
    </div>
  );
};

export default UserDashboard;