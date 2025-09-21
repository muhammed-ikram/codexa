import React from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Outlet />
        {/* Footer */}
        <div className="mt-auto py-6 text-center text-gray-500 text-sm border-t border-gray-800">
          <p className="mb-2">
            <span className="font-medium text-gray-400 italic">CodeXA - for the engineers, by the engineers</span>
          </p>
          <p>© 2025 CodeXA. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;