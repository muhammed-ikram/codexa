import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import api from '../utils/api';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const userMenuRef = useRef(null);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
      </svg>
    )},
    { name: 'Projects', path: '/projects', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-5L9 4H4zm3 6a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
      </svg>
    )},
    { name: 'Codexa Assistance', path: '/codexa-assistance', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
      </svg>
    )},
    { name: 'Career Hub', path: '/career-hub', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
        <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
      </svg>
    )},
    { name: 'Launch Advisor', path: '/launch-advisor', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l-1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
      </svg>
    )},
    { name: 'Learning', path: '/learning-suggestions', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H9l-4 3v-3H4a2 2 0 01-2-2V5z" />
      </svg>
    )},
  ];

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      // Clear token from localStorage
      localStorage.removeItem("token");
      // Redirect to login page
      navigate("/login");
    }
  };

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get("/auth/profile");
        setUserData(response.data.user);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      }
    };

    fetchUserData();
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get the first letter of the username or default to 'U'
  const getUserInitial = () => {
    if (userData && userData.username) {
      return userData.username.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="bg-gray-900 text-white w-16 min-h-screen flex flex-col items-center py-6 border-r border-gray-800 relative">
      {/* Logo */}
      <div className="mb-10">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white transform transition-transform duration-300 hover:scale-105">
            <img src={logo} alt="CodeXA Logo" className="w-8 h-8" />
          </div>
          <div className="text-xs font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mt-1">CodeXA</div>
        </div>
        <div className="text-xs font-medium text-gray-500 mt-2 text-center italic px-1">for the engineers, by the engineers</div>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-6">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                  location.pathname === item.path
                    ? 'text-blue-400 bg-gray-800/50 backdrop-blur-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-xs mt-1">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="mt-auto relative" ref={userMenuRef}>
        <div 
          className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center transform transition-transform duration-300 hover:scale-105 cursor-pointer"
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
        >
          <span className="font-bold text-sm">{getUserInitial()}</span>
        </div>
        
        {/* User Menu Dropdown */}
        {isUserMenuOpen && (
          <div className="absolute bottom-full left-1/2 mb-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10 animate-fade-in">
            <div className="py-1">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;