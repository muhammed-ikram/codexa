import React from 'react';
import Sidebar from './Sidebar';
import { Outlet, useLocation } from 'react-router-dom';

const MainLayout = () => {
  const location = useLocation();
  const isWorkspace = location.pathname.startsWith('/workspace');
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Outlet />
        {/* Footer */}
        <div className="mt-auto py-2 text-center text-gray-500 text-xs border-t border-gray-800">
          <div className="flex items-center justify-center">
            <img src="/src/assets/logo.png" alt="CodeXA Logo" className="w-4 h-4 mr-2" />
            <span className="font-medium text-gray-400 italic">CodeXA - for the engineers, by the engineers</span>
          </div>
          <p className="mt-1 text-xs">© 2025 CodeXA. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;